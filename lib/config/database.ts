export const databaseConfig = {
  // Connection settings
  connectionTimeout: 30000,
  idleTimeout: 30000,
  maxConnections: 20,

  // Query settings
  defaultLimit: 50,
  maxLimit: 1000,

  // Security settings
  hashRounds: 10,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours

  // Feature flags
  enableAnalytics: true,
  enableNotifications: true,
  enableDisputes: true,

  // Currency settings
  defaultCurrency: "INR",
  supportedCurrencies: ["INR", "USD", "EUR", "GBP"],

  // File upload settings
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
}

export const sqlQueries = {
  // Common queries that can be reused
  getUserWithSettings: `
    SELECT u.*, us.* 
    FROM users u 
    LEFT JOIN user_settings us ON u.id = us.user_id 
    WHERE u.id = $1 AND u.is_active = true
  `,

  getGroupWithMembers: `
    SELECT g.*, 
           json_agg(
             json_build_object(
               'user_id', gm.user_id,
               'name', u.name,
               'email', u.email,
               'role', gm.role,
               'joined_at', gm.joined_at
             )
           ) as members
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.is_active = true
    LEFT JOIN users u ON gm.user_id = u.id AND u.is_active = true
    WHERE g.id = $1 AND g.is_active = true
    GROUP BY g.id
  `,

  getExpenseWithSplits: `
    SELECT e.*,
           u1.name as paid_by_name,
           u2.name as created_by_name,
           json_agg(
             json_build_object(
               'user_id', es.user_id,
               'user_name', u3.name,
               'amount', es.amount,
               'is_settled', es.is_settled
             )
           ) as splits
    FROM expenses e
    JOIN users u1 ON e.paid_by = u1.id
    JOIN users u2 ON e.created_by = u2.id
    LEFT JOIN expense_splits es ON e.id = es.expense_id
    LEFT JOIN users u3 ON es.user_id = u3.id
    WHERE e.id = $1
    GROUP BY e.id, u1.name, u2.name
  `,
}
