import { getDB } from "../config/database"
import { authService } from "../config/auth"
import crypto from "crypto"

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  upi_id: string
  role?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  upi_id: string
  password_hash: string
  avatar_url?: string
  role: string
  is_verified: boolean
  verification_token?: string
  verification_token_expires?: Date
  password_reset_token?: string
  password_reset_expires?: Date
  created_at: Date
  updated_at: Date
}

export class UserModel {
  async create(userData: CreateUserData): Promise<User> {
    const { email, name, password, phone, upi_id, role = "user" } = userData

    // Check if user already exists
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`)
    }

    // Check if UPI ID already exists
    const existingUpiUser = await this.findByUpiId(upi_id)
    if (existingUpiUser) {
      throw new Error(`User with UPI ID ${upi_id} already registered`)
    }

    // Hash password
    const passwordHash = await authService.hashPassword(password)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const result = await getDB().query(
      `INSERT INTO users (email, name, phone, upi_id, password_hash, role, verification_token, verification_token_expires)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [email, name, phone, upi_id, passwordHash, role, verificationToken, verificationExpires],
    )

    return result.rows[0]
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await getDB().query("SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0] || null
  }

  async findByUpiId(upiId: string): Promise<User | null> {
    const result = await getDB().query("SELECT * FROM users WHERE upi_id = $1", [upiId])
    return result.rows[0] || null
  }

  async findById(id: string): Promise<User | null> {
    const result = await getDB().query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0] || null
  }

  async verifyEmail(token: string): Promise<User | null> {
    const result = await getDB().query(
      `UPDATE users 
       SET is_verified = true, verification_token = NULL, verification_token_expires = NULL, updated_at = NOW()
       WHERE verification_token = $1 AND verification_token_expires > NOW()
       RETURNING *`,
      [token],
    )

    return result.rows[0] || null
  }

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    const result = await getDB().query(
      `UPDATE users 
       SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW()
       WHERE email = $3 AND is_verified = true
       RETURNING id`,
      [resetToken, resetExpires, email],
    )

    return result.rows[0] ? resetToken : null
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const passwordHash = await authService.hashPassword(newPassword)

    const result = await getDB().query(
      `UPDATE users 
       SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW()
       WHERE password_reset_token = $2 AND password_reset_expires > NOW()
       RETURNING id`,
      [passwordHash, token],
    )

    return result.rows.length > 0
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const allowedFields = ["name", "phone", "upi_id", "avatar_url"]
    const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key))

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update")
    }

    // Check if email or UPI ID conflicts
    if (updates.upi_id) {
      const existingUser = await this.findByUpiId(updates.upi_id)
      if (existingUser && existingUser.id !== id) {
        throw new Error(`UPI ID ${updates.upi_id} already registered`)
      }
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
    const values = [id, ...updateFields.map((field) => updates[field as keyof User])]

    const result = await getDB().query(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, values)

    if (result.rows.length === 0) {
      throw new Error("User not found")
    }

    return result.rows[0]
  }

  async getStats(userId: string): Promise<any> {
    const result = await getDB().query(
      `SELECT 
        COUNT(DISTINCT gm.group_id) as total_groups,
        COUNT(DISTINCT e.id) as total_expenses,
        COALESCE(SUM(CASE WHEN e.paid_by = $1 THEN e.amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(es.amount), 0) as total_owed
       FROM users u
       LEFT JOIN group_members gm ON u.id = gm.user_id
       LEFT JOIN expenses e ON gm.group_id = e.group_id
       LEFT JOIN expense_splits es ON e.id = es.expense_id AND es.user_id = $1
       WHERE u.id = $1`,
      [userId],
    )

    return result.rows[0]
  }
}

export const userModel = new UserModel()
