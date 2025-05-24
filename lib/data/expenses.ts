import { query, transaction } from "../database"

export interface Expense {
  id: string
  group_id: string
  created_by: string
  paid_by: string
  title: string
  description?: string
  amount: number
  currency: string
  category: string
  receipt_url?: string
  split_type: string
  is_settled: boolean
  created_at: Date
  updated_at: Date
}

export interface ExpenseSplit {
  id: string
  expense_id: string
  user_id: string
  amount: number
  percentage?: number
  shares?: number
  is_settled: boolean
  settled_at?: Date
  user_name?: string
  user_email?: string
}

export interface CreateExpenseData {
  group_id: string
  created_by: string
  paid_by: string
  title: string
  description?: string
  amount: number
  currency?: string
  category?: string
  receipt_url?: string
  split_type?: string
  splits: { user_id: string; amount: number; percentage?: number; shares?: number }[]
}

export async function createExpense(expenseData: CreateExpenseData): Promise<Expense> {
  return transaction(async (client) => {
    // Create expense
    const expenseResult = await client.query(
      `
      INSERT INTO expenses (group_id, created_by, paid_by, title, description, amount, currency, category, receipt_url, split_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        expenseData.group_id,
        expenseData.created_by,
        expenseData.paid_by,
        expenseData.title,
        expenseData.description,
        expenseData.amount,
        expenseData.currency || "INR",
        expenseData.category || "food",
        expenseData.receipt_url,
        expenseData.split_type || "equal",
      ],
    )

    const expense = expenseResult.rows[0]

    // Create expense splits
    for (const split of expenseData.splits) {
      await client.query(
        `
        INSERT INTO expense_splits (expense_id, user_id, amount, percentage, shares)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [expense.id, split.user_id, split.amount, split.percentage, split.shares],
      )
    }

    // Log activity
    await client.query(
      `
      INSERT INTO activity_log (user_id, group_id, expense_id, action, description)
      VALUES ($1, $2, $3, 'expense_created', $4)
    `,
      [expenseData.created_by, expenseData.group_id, expense.id, `Created expense: ${expenseData.title}`],
    )

    return expense
  })
}

export async function getGroupExpenses(
  groupId: string,
  limit = 50,
  offset = 0,
): Promise<(Expense & { paid_by_name: string; created_by_name: string })[]> {
  const result = await query(
    `
    SELECT 
      e.*,
      u1.name as paid_by_name,
      u2.name as created_by_name
    FROM expenses e
    JOIN users u1 ON e.paid_by = u1.id
    JOIN users u2 ON e.created_by = u2.id
    WHERE e.group_id = $1
    ORDER BY e.created_at DESC
    LIMIT $2 OFFSET $3
  `,
    [groupId, limit, offset],
  )

  return result.rows
}

export async function getExpenseById(expenseId: string): Promise<Expense | null> {
  const result = await query(
    `
    SELECT * FROM expenses WHERE id = $1
  `,
    [expenseId],
  )

  return result.rows[0] || null
}

export async function getExpenseSplits(expenseId: string): Promise<ExpenseSplit[]> {
  const result = await query(
    `
    SELECT 
      es.*,
      u.name as user_name,
      u.email as user_email
    FROM expense_splits es
    JOIN users u ON es.user_id = u.id
    WHERE es.expense_id = $1
    ORDER BY es.amount DESC
  `,
    [expenseId],
  )

  return result.rows
}

export async function getUserExpenses(
  userId: string,
  limit = 50,
): Promise<(Expense & { your_share: number; paid_by_name: string })[]> {
  const result = await query(
    `
    SELECT 
      e.*,
      es.amount as your_share,
      u.name as paid_by_name
    FROM expenses e
    JOIN expense_splits es ON e.id = es.expense_id
    JOIN users u ON e.paid_by = u.id
    WHERE es.user_id = $1
    ORDER BY e.created_at DESC
    LIMIT $2
  `,
    [userId, limit],
  )

  return result.rows
}

export async function settleExpenseSplit(expenseId: string, userId: string): Promise<void> {
  await transaction(async (client) => {
    // Mark split as settled
    await client.query(
      `
      UPDATE expense_splits 
      SET is_settled = true, settled_at = NOW()
      WHERE expense_id = $1 AND user_id = $2
    `,
      [expenseId, userId],
    )

    // Check if all splits are settled
    const unsettledResult = await client.query(
      `
      SELECT COUNT(*) as unsettled_count
      FROM expense_splits 
      WHERE expense_id = $1 AND is_settled = false
    `,
      [expenseId],
    )

    const unsettledCount = Number.parseInt(unsettledResult.rows[0].unsettled_count)

    // If all splits are settled, mark expense as settled
    if (unsettledCount === 0) {
      await client.query(
        `
        UPDATE expenses 
        SET is_settled = true
        WHERE id = $1
      `,
        [expenseId],
      )
    }

    // Log activity
    await client.query(
      `
      INSERT INTO activity_log (user_id, expense_id, action, description)
      VALUES ($1, $2, 'split_settled', 'Settled expense split')
    `,
      [userId, expenseId],
    )
  })
}

export async function updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense> {
  const fields = Object.keys(updates).filter(
    (key) => key !== "id" && key !== "created_by" && key !== "created_at" && key !== "group_id",
  )
  const assignments = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `
    UPDATE expenses 
    SET ${assignments}
    WHERE id = $1
    RETURNING *
  `,
    [expenseId, ...fields.map((field) => updates[field as keyof Expense])],
  )

  return result.rows[0]
}

export async function deleteExpense(expenseId: string, userId: string): Promise<boolean> {
  return transaction(async (client) => {
    // Check if user can delete (creator or admin)
    const checkResult = await client.query(
      `
      SELECT e.created_by, gm.role
      FROM expenses e
      JOIN group_members gm ON e.group_id = gm.group_id
      WHERE e.id = $1 AND gm.user_id = $2 AND gm.is_active = true
    `,
      [expenseId, userId],
    )

    if (checkResult.rows.length === 0) {
      return false
    }

    const { created_by, role } = checkResult.rows[0]

    if (created_by !== userId && role !== "admin") {
      return false
    }

    // Delete expense splits first
    await client.query(
      `
      DELETE FROM expense_splits WHERE expense_id = $1
    `,
      [expenseId],
    )

    // Delete expense
    await client.query(
      `
      DELETE FROM expenses WHERE id = $1
    `,
      [expenseId],
    )

    // Log activity
    await client.query(
      `
      INSERT INTO activity_log (user_id, expense_id, action, description)
      VALUES ($1, $2, 'expense_deleted', 'Deleted expense')
    `,
      [userId, expenseId],
    )

    return true
  })
}

export async function getUserBalance(
  userId: string,
): Promise<{ you_owe: number; you_are_owed: number; net_balance: number }> {
  const result = await query(
    `
    SELECT 
      COALESCE(SUM(CASE 
        WHEN es.user_id = $1 AND e.paid_by != $1 THEN es.amount 
        ELSE 0 
      END), 0) as you_owe,
      COALESCE(SUM(CASE 
        WHEN e.paid_by = $1 AND es.user_id != $1 THEN es.amount 
        ELSE 0 
      END), 0) as you_are_owed
    FROM expenses e
    JOIN expense_splits es ON e.id = es.expense_id
    WHERE (es.user_id = $1 OR e.paid_by = $1) AND es.is_settled = false
  `,
    [userId],
  )

  const balance = result.rows[0]
  const youOwe = Number.parseFloat(balance.you_owe)
  const youAreOwed = Number.parseFloat(balance.you_are_owed)

  return {
    you_owe: youOwe,
    you_are_owed: youAreOwed,
    net_balance: youAreOwed - youOwe,
  }
}
