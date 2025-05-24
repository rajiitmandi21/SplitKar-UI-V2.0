import { query, transaction } from "../database"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  phone?: string
  name: string
  upi_id?: string
  avatar_url?: string
  default_currency: string
  language: string
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  phone?: string
  upi_id?: string
  default_currency?: string
  language?: string
}

export interface UserSettings {
  id: string
  user_id: string
  push_notifications: boolean
  email_notifications: boolean
  sms_notifications: boolean
  payment_reminders: boolean
  expense_updates: boolean
  group_activity: boolean
  weekly_reports: boolean
  profile_visibility: string
  show_balance: boolean
  allow_friend_requests: boolean
  show_online_status: boolean
  dark_mode: boolean
  sound_effects: boolean
  auto_backup: boolean
  biometric_auth: boolean
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  return transaction(async (client) => {
    // Create user
    const userResult = await client.query(
      `
      INSERT INTO users (email, name, password_hash, phone, upi_id, default_currency, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, phone, name, upi_id, avatar_url, default_currency, language, is_verified, is_active, created_at, updated_at
    `,
      [
        userData.email,
        userData.name,
        hashedPassword,
        userData.phone,
        userData.upi_id,
        userData.default_currency || "INR",
        userData.language || "en",
      ],
    )

    const user = userResult.rows[0]

    // Create default user settings
    await client.query(
      `
      INSERT INTO user_settings (user_id)
      VALUES ($1)
    `,
      [user.id],
    )

    return user
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    `
    SELECT id, email, phone, name, upi_id, avatar_url, default_currency, language, is_verified, is_active, created_at, updated_at
    FROM users 
    WHERE email = $1 AND is_active = true
  `,
    [email],
  )

  return result.rows[0] || null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query(
    `
    SELECT id, email, phone, name, upi_id, avatar_url, default_currency, language, is_verified, is_active, created_at, updated_at
    FROM users 
    WHERE id = $1 AND is_active = true
  `,
    [id],
  )

  return result.rows[0] || null
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const fields = Object.keys(updates).filter((key) => key !== "id")
  const values = fields.map((_, index) => `$${index + 2}`).join(", ")
  const assignments = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `
    UPDATE users 
    SET ${assignments}
    WHERE id = $1
    RETURNING id, email, phone, name, upi_id, avatar_url, default_currency, language, is_verified, is_active, created_at, updated_at
  `,
    [id, ...fields.map((field) => updates[field as keyof User])],
  )

  return result.rows[0]
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await query(
    `
    SELECT id, email, phone, name, password_hash, upi_id, avatar_url, default_currency, language, is_verified, is_active, created_at, updated_at
    FROM users 
    WHERE email = $1 AND is_active = true
  `,
    [email],
  )

  if (result.rows.length === 0) {
    return null
  }

  const user = result.rows[0]
  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    return null
  }

  // Remove password_hash from returned object
  delete user.password_hash
  return user
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const result = await query(
    `
    SELECT * FROM user_settings WHERE user_id = $1
  `,
    [userId],
  )

  return result.rows[0] || null
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
  const fields = Object.keys(settings).filter((key) => key !== "id" && key !== "user_id")
  const assignments = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `
    UPDATE user_settings 
    SET ${assignments}
    WHERE user_id = $1
    RETURNING *
  `,
    [userId, ...fields.map((field) => settings[field as keyof UserSettings])],
  )

  return result.rows[0]
}

export async function getUserStats(userId: string) {
  const result = await query(
    `
    SELECT 
      COUNT(DISTINCT gm.group_id) as active_groups,
      COUNT(DISTINCT f.friend_id) as total_friends,
      COALESCE(SUM(CASE WHEN es.amount > 0 THEN es.amount ELSE 0 END), 0) as total_expenses,
      COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) as total_settled,
      COUNT(DISTINCT e.id) as total_transactions
    FROM users u
    LEFT JOIN group_members gm ON u.id = gm.user_id AND gm.is_active = true
    LEFT JOIN friends f ON u.id = f.user_id AND f.status = 'accepted'
    LEFT JOIN expense_splits es ON u.id = es.user_id
    LEFT JOIN expenses e ON es.expense_id = e.id
    LEFT JOIN payments p ON (u.id = p.from_user_id OR u.id = p.to_user_id)
    WHERE u.id = $1
    GROUP BY u.id
  `,
    [userId],
  )

  return (
    result.rows[0] || {
      active_groups: 0,
      total_friends: 0,
      total_expenses: 0,
      total_settled: 0,
      total_transactions: 0,
    }
  )
}

export async function searchUsers(query: string, currentUserId: string, limit = 10): Promise<User[]> {
  const result = await query(
    `
    SELECT id, email, phone, name, avatar_url
    FROM users 
    WHERE (name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1)
    AND id != $2 
    AND is_active = true
    LIMIT $3
  `,
    [`%${query}%`, currentUserId, limit],
  )

  return result.rows
}

export async function deactivateUser(id: string): Promise<void> {
  await query(
    `
    UPDATE users 
    SET is_active = false 
    WHERE id = $1
  `,
    [id],
  )
}
