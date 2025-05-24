import { db } from "../config/database"
import { authService } from "../config/auth"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  password_hash: string
  avatar_url?: string
  role: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  role?: string
}

export interface UserStats {
  total_groups: number
  total_friends: number
  total_expenses: number
  net_balance: number
}

export class UserModel {
  async create(userData: CreateUserData): Promise<User> {
    const { email, name, password, phone, role = "user" } = userData

    // Check if user already exists
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`)
    }

    // Hash password
    const password_hash = await authService.hashPassword(password)

    const result = await db.query(
      `INSERT INTO users (email, name, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, phone, avatar_url, role, is_verified, created_at, updated_at`,
      [email, name, phone, password_hash, role],
    )

    return result.rows[0]
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email])

    return result.rows[0] || null
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      "SELECT id, email, name, phone, avatar_url, role, is_verified, created_at, updated_at FROM users WHERE id = $1",
      [id],
    )

    return result.rows[0] || null
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const allowedFields = ["name", "phone", "avatar_url"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update")
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
    const values = [id, ...updateFields.map((field) => updates[field as keyof User])]

    const result = await db.query(
      `UPDATE users SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, phone, avatar_url, role, is_verified, created_at, updated_at`,
      values,
    )

    if (result.rows.length === 0) {
      throw new Error("User not found")
    }

    return result.rows[0]
  }

  async getStats(userId: string): Promise<UserStats> {
    const result = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM group_members WHERE user_id = $1) as total_groups,
        (SELECT COUNT(*) FROM friendships WHERE (user_id = $1 OR friend_id = $1) AND status = 'accepted') as total_friends,
        (SELECT COUNT(*) FROM expenses WHERE paid_by = $1) as total_expenses,
        COALESCE((
          SELECT SUM(
            CASE 
              WHEN e.paid_by = $1 THEN e.amount - COALESCE(es.amount, 0)
              ELSE -COALESCE(es.amount, 0)
            END
          )
          FROM expenses e
          LEFT JOIN expense_splits es ON e.id = es.expense_id AND es.user_id = $1
          WHERE e.paid_by = $1 OR es.user_id = $1
        ), 0) as net_balance`,
      [userId],
    )

    const stats = result.rows[0]
    return {
      total_groups: Number.parseInt(stats.total_groups),
      total_friends: Number.parseInt(stats.total_friends),
      total_expenses: Number.parseInt(stats.total_expenses),
      net_balance: Number.parseFloat(stats.net_balance),
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id])

    return result.rowCount > 0
  }
}

export const userModel = new UserModel()
