import { type NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get("groupId")
    const userId = searchParams.get("userId")

    if (!groupId && !userId) {
      return NextResponse.json({ error: "Group ID or User ID is required" }, { status: 400 })
    }

    let queryText = `
      SELECT 
        e.id,
        e.description,
        e.amount,
        e.category,
        e.date,
        e.created_at,
        e.group_id,
        u.name as paid_by_name,
        u.email as paid_by_email,
        g.name as group_name,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'user_id', es.user_id,
              'amount', es.amount,
              'user_name', split_users.name
            )
          ) FILTER (WHERE es.user_id IS NOT NULL), 
          '[]'
        ) as splits
      FROM expenses e
      JOIN users u ON e.paid_by = u.id
      LEFT JOIN groups g ON e.group_id = g.id
      LEFT JOIN expense_splits es ON e.id = es.expense_id
      LEFT JOIN users split_users ON es.user_id = split_users.id
    `

    let params: any[] = []

    if (groupId) {
      queryText += " WHERE e.group_id = $1"
      params = [groupId]
    } else if (userId) {
      queryText += " WHERE e.paid_by = $1 OR es.user_id = $1"
      params = [userId]
    }

    queryText += " GROUP BY e.id, u.name, u.email, g.name ORDER BY e.created_at DESC"

    const result = await query(queryText, params)

    return NextResponse.json({ expenses: result.rows })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, amount, category, paidBy, groupId, splits, date } = body

    if (!description || !amount || !paidBy || !splits || splits.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate splits total equals expense amount
    const totalSplits = splits.reduce((sum: number, split: any) => sum + split.amount, 0)
    if (Math.abs(totalSplits - amount) > 0.01) {
      return NextResponse.json({ error: "Split amounts must equal total expense" }, { status: 400 })
    }

    const result = await transaction(async (client) => {
      // Create expense
      const expenseResult = await client.query(
        "INSERT INTO expenses (description, amount, category, paid_by, group_id, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [description, amount, category, paidBy, groupId, date || new Date()],
      )

      const expense = expenseResult.rows[0]

      // Create splits
      for (const split of splits) {
        await client.query("INSERT INTO expense_splits (expense_id, user_id, amount) VALUES ($1, $2, $3)", [
          expense.id,
          split.userId,
          split.amount,
        ])
      }

      return expense
    })

    return NextResponse.json({ expense: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
