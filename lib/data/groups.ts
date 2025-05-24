import { query, transaction } from "../database"

export interface Group {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  currency: string
  created_by: string
  is_active: boolean
  auto_generate_upi: boolean
  smart_debt_simplification: boolean
  expense_notifications: boolean
  payment_reminders: boolean
  created_at: Date
  updated_at: Date
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: string
  joined_at: Date
  is_active: boolean
  user_name?: string
  user_email?: string
  user_avatar?: string
}

export interface CreateGroupData {
  name: string
  description?: string
  icon?: string
  color?: string
  currency?: string
  created_by: string
  member_ids?: string[]
}

export async function createGroup(groupData: CreateGroupData): Promise<Group> {
  return transaction(async (client) => {
    // Create group
    const groupResult = await client.query(
      `
      INSERT INTO groups (name, description, icon, color, currency, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        groupData.name,
        groupData.description,
        groupData.icon || "users",
        groupData.color || "bg-gray-500",
        groupData.currency || "INR",
        groupData.created_by,
      ],
    )

    const group = groupResult.rows[0]

    // Add creator as admin
    await client.query(
      `
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'admin')
    `,
      [group.id, groupData.created_by],
    )

    // Add other members
    if (groupData.member_ids && groupData.member_ids.length > 0) {
      for (const memberId of groupData.member_ids) {
        await client.query(
          `
          INSERT INTO group_members (group_id, user_id, role)
          VALUES ($1, $2, 'member')
        `,
          [group.id, memberId],
        )
      }
    }

    return group
  })
}

export async function getUserGroups(
  userId: string,
): Promise<(Group & { member_count: number; your_balance: number })[]> {
  const result = await query(
    `
    SELECT 
      g.*,
      COUNT(gm.user_id) as member_count,
      COALESCE(
        SUM(CASE WHEN es.user_id = $1 THEN es.amount ELSE 0 END) - 
        SUM(CASE WHEN e.paid_by = $1 THEN e.amount ELSE 0 END), 
        0
      ) as your_balance
    FROM groups g
    JOIN group_members gm ON g.id = gm.group_id
    LEFT JOIN expenses e ON g.id = e.group_id
    LEFT JOIN expense_splits es ON e.id = es.expense_id
    WHERE gm.user_id = $1 AND gm.is_active = true AND g.is_active = true
    GROUP BY g.id
    ORDER BY g.updated_at DESC
  `,
    [userId],
  )

  return result.rows
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  const result = await query(
    `
    SELECT * FROM groups WHERE id = $1 AND is_active = true
  `,
    [groupId],
  )

  return result.rows[0] || null
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  const result = await query(
    `
    SELECT 
      gm.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url as user_avatar
    FROM group_members gm
    JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = $1 AND gm.is_active = true AND u.is_active = true
    ORDER BY gm.role DESC, gm.joined_at ASC
  `,
    [groupId],
  )

  return result.rows
}

export async function addGroupMember(groupId: string, userId: string, role = "member"): Promise<void> {
  await query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (group_id, user_id) 
    DO UPDATE SET is_active = true, role = $3
  `,
    [groupId, userId, role],
  )
}

export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  await query(
    `
    UPDATE group_members 
    SET is_active = false 
    WHERE group_id = $1 AND user_id = $2
  `,
    [groupId, userId],
  )
}

export async function updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
  const fields = Object.keys(updates).filter((key) => key !== "id" && key !== "created_by" && key !== "created_at")
  const assignments = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `
    UPDATE groups 
    SET ${assignments}
    WHERE id = $1
    RETURNING *
  `,
    [groupId, ...fields.map((field) => updates[field as keyof Group])],
  )

  return result.rows[0]
}

export async function getGroupBalance(groupId: string, userId: string) {
  const result = await query(
    `
    SELECT 
      COALESCE(SUM(CASE WHEN es.user_id = $2 THEN es.amount ELSE 0 END), 0) as you_owe,
      COALESCE(SUM(CASE WHEN e.paid_by = $2 THEN e.amount ELSE 0 END), 0) as you_paid,
      COALESCE(SUM(e.amount), 0) as total_expenses
    FROM expenses e
    LEFT JOIN expense_splits es ON e.id = es.expense_id
    WHERE e.group_id = $1
  `,
    [groupId, userId],
  )

  const balance = result.rows[0]
  return {
    you_owe: Number.parseFloat(balance.you_owe),
    you_paid: Number.parseFloat(balance.you_paid),
    net_balance: Number.parseFloat(balance.you_paid) - Number.parseFloat(balance.you_owe),
    total_expenses: Number.parseFloat(balance.total_expenses),
  }
}

export async function checkGroupMembership(groupId: string, userId: string): Promise<boolean> {
  const result = await query(
    `
    SELECT 1 FROM group_members 
    WHERE group_id = $1 AND user_id = $2 AND is_active = true
  `,
    [groupId, userId],
  )

  return result.rows.length > 0
}

export async function deleteGroup(groupId: string, userId: string): Promise<boolean> {
  // Only allow group creator/admin to delete
  const result = await query(
    `
    UPDATE groups 
    SET is_active = false 
    WHERE id = $1 AND created_by = $2
    RETURNING id
  `,
    [groupId, userId],
  )

  return result.rows.length > 0
}
