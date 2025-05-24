import { db } from "../config/database"
import { authService } from "../config/auth"
import crypto from "crypto"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  upi_id: string // Now required
  password_hash: string
  avatar_url?: string
  role: string
  is_verified: boolean
  verification_token?: string
  reset_token?: string
  reset_token_expires?: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  upi_id: string // Now required
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
    const { email, name, password, phone, upi_id, role = "user" } = userData

    // Validation
    if (!email || !name || !password || !upi_id) {
      throw new Error("Email, name, password, and UPI ID are required")
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`)
    }

    // Check if UPI ID already exists
    const existingUpiUser = await this.findByUpiId(upi_id)
    if (existingUpiUser) {
      throw new Error(`UPI ID ${upi_id} is already registered`)
    }

    // Hash password and generate verification token
    const password_hash = await authService.hashPassword(password)
    const verification_token = crypto.randomBytes(32).toString("hex")

    const result = await db.query(
      `INSERT INTO users (email, name, phone, upi_id, password_hash, role, verification_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, phone, upi_id, avatar_url, role, is_verified, verification_token, created_at, updated_at`,
      [email, name, phone, upi_id, password_hash, role, verification_token],
    )

    return result.rows[0]
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0] || null
  }

  async findByUpiId(upi_id: string): Promise<User | null> {
    const result = await db.query("SELECT * FROM users WHERE upi_id = $1", [upi_id])
    return result.rows[0] || null
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      "SELECT id, email, name, phone, upi_id, avatar_url, role, is_verified, created_at, updated_at FROM users WHERE id = $1",
      [id],
    )
    return result.rows[0] || null
  }

  async verifyEmail(token: string): Promise<User | null> {
    const result = await db.query(
      `UPDATE users 
       SET is_verified = true, verification_token = NULL, updated_at = NOW()
       WHERE verification_token = $1 AND is_verified = false
       RETURNING id, email, name, phone, upi_id, avatar_url, role, is_verified, created_at, updated_at`,
      [token],
    )

    return result.rows[0] || null
  }

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    const result = await db.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expires = $2, updated_at = NOW()
       WHERE email = $3 AND is_verified = true
       RETURNING id`,
      [resetToken, expiresAt, email],
    )

    return result.rows.length > 0 ? resetToken : null
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const password_hash = await authService.hashPassword(newPassword)

    const result = await db.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW()
       WHERE reset_token = $2 AND reset_token_expires > NOW()`,
      [password_hash, token],
    )

    return result.rowCount > 0
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const allowedFields = ["name", "phone", "upi_id", "avatar_url"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update")
    }

    // Check if UPI ID is being updated and if it already exists
    if (updates.upi_id) {
      const existingUpiUser = await this.findByUpiId(updates.upi_id)
      if (existingUpiUser && existingUpiUser.id !== id) {
        throw new Error(`UPI ID ${updates.upi_id} is already registered`)
      }
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
    const values = [id, ...updateFields.map((field) => updates[field as keyof User])]

    const result = await db.query(
      `UPDATE users SET ${setClause}, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, phone, upi_id, avatar_url, role, is_verified, created_at, updated_at`,
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
