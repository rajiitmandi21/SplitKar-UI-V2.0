import { getDB } from "../config/database"

export interface Group {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  currency: string
  created_by: string
  created_at: string
  updated_at: string
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

export interface GroupMember {
  user_id: string
  group_id: string
  role: string
  joined_at: string
  name: string
  email: string
  avatar_url?: string
}

export interface GroupMembership {
  role: string
  joined_at: string
}

export class GroupModel {
  async create(groupData: CreateGroupData): Promise<Group> {
    const { name, description, icon, color, currency = "INR", created_by, member_ids = [] } = groupData

    return await getDB().transaction(async (client) => {
      // Create group
      const groupResult = await client.query(
        `INSERT INTO groups (name, description, icon, color, currency, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, icon, color, currency, created_by],
      )

      const group = groupResult.rows[0]

      // Add creator as admin
      await client.query(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES ($1, $2, 'admin')`,
        [group.id, created_by],
      )

      // Add other members
      for (const memberId of member_ids) {
        if (memberId !== created_by) {
          await client.query(
            `INSERT INTO group_members (group_id, user_id, role)
             VALUES ($1, $2, 'member')`,
            [group.id, memberId],
          )
        }
      }

      return group
    })
  }

  async findUserGroups(userId: string) {
    const result = await getDB().query(
      `SELECT 
        g.*,
        COUNT(DISTINCT gm.user_id) as member_count,
        COALESCE(SUM(e.amount), 0) as total_expenses,
        COALESCE(SUM(
          CASE 
            WHEN e.paid_by = $1 THEN e.amount - COALESCE(es.amount, 0)
            ELSE -COALESCE(es.amount, 0)
          END
        ), 0) as user_balance
       FROM groups g
       JOIN group_members gm_user ON g.id = gm_user.group_id AND gm_user.user_id = $1
       LEFT JOIN group_members gm ON g.id = gm.group_id
       LEFT JOIN expenses e ON g.id = e.group_id
       LEFT JOIN expense_splits es ON e.id = es.expense_id AND es.user_id = $1
       GROUP BY g.id, g.name, g.description, g.icon, g.color, g.currency, g.created_by, g.created_at, g.updated_at
       ORDER BY g.updated_at DESC`,
      [userId],
    )

    return result.rows
  }

  async findById(groupId: string): Promise<Group | null> {
    const result = await getDB().query("SELECT * FROM groups WHERE id = $1", [groupId])

    return result.rows[0] || null
  }

  async checkMembership(groupId: string, userId: string): Promise<GroupMembership | null> {
    const result = await getDB().query("SELECT role, joined_at FROM group_members WHERE group_id = $1 AND user_id = $2", [
      groupId,
      userId,
    ])

    return result.rows[0] || null
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    const result = await getDB().query(
      `SELECT 
        gm.user_id, gm.group_id, gm.role, gm.joined_at,
        u.name, u.email, u.avatar_url
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.role DESC, gm.joined_at ASC`,
      [groupId],
    )

    return result.rows
  }

  async addMember(groupId: string, userId: string, role = "member"): Promise<void> {
    await getDB().query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [groupId, userId, role],
    )
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await getDB().query("DELETE FROM group_members WHERE group_id = $1 AND user_id = $2", [groupId, userId])
  }

  async update(groupId: string, updates: Partial<Group>): Promise<Group> {
    const allowedFields = ["name", "description", "icon", "color", "currency"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update")
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
    const values = [groupId, ...updateFields.map((field) => updates[field as keyof Group])]

    const result = await getDB().query(
      `UPDATE groups SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values,
    )

    if (result.rows.length === 0) {
      throw new Error("Group not found")
    }

    return result.rows[0]
  }

  async delete(groupId: string, userId: string): Promise<boolean> {
    const result = await getDB().query("DELETE FROM groups WHERE id = $1 AND created_by = $2", [groupId, userId])

    return result.rowCount > 0
  }
}

export const groupModel = new GroupModel()
