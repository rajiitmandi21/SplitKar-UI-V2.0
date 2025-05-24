import { query, transaction } from "../database"

export interface Friend {
  id: string
  user_id: string
  friend_id: string
  status: string
  created_at: Date
  accepted_at?: Date
  friend_name?: string
  friend_email?: string
  friend_avatar?: string
}

export async function sendFriendRequest(userId: string, friendId: string): Promise<void> {
  await query(
    `
    INSERT INTO friends (user_id, friend_id, status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (user_id, friend_id) 
    DO UPDATE SET status = 'pending', created_at = NOW()
  `,
    [userId, friendId],
  )
}

export async function acceptFriendRequest(userId: string, friendId: string): Promise<void> {
  await transaction(async (client) => {
    // Accept the request
    await client.query(
      `
      UPDATE friends 
      SET status = 'accepted', accepted_at = NOW()
      WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
    `,
      [friendId, userId],
    )

    // Create reverse friendship
    await client.query(
      `
      INSERT INTO friends (user_id, friend_id, status, accepted_at)
      VALUES ($1, $2, 'accepted', NOW())
      ON CONFLICT (user_id, friend_id) 
      DO UPDATE SET status = 'accepted', accepted_at = NOW()
    `,
      [userId, friendId],
    )
  })
}

export async function getFriends(userId: string): Promise<(Friend & { net_balance: number })[]> {
  const result = await query(
    `
    SELECT 
      f.*,
      u.name as friend_name,
      u.email as friend_email,
      u.avatar_url as friend_avatar,
      COALESCE(
        SUM(CASE WHEN e.paid_by = $1 AND es.user_id = f.friend_id THEN es.amount ELSE 0 END) -
        SUM(CASE WHEN e.paid_by = f.friend_id AND es.user_id = $1 THEN es.amount ELSE 0 END),
        0
      ) as net_balance
    FROM friends f
    JOIN users u ON f.friend_id = u.id
    LEFT JOIN expenses e ON (e.paid_by = $1 OR e.paid_by = f.friend_id)
    LEFT JOIN expense_splits es ON e.id = es.expense_id AND (es.user_id = $1 OR es.user_id = f.friend_id)
    WHERE f.user_id = $1 AND f.status = 'accepted' AND u.is_active = true
    GROUP BY f.id, u.id
    ORDER BY u.name
  `,
    [userId],
  )

  return result.rows
}

export async function getFriendRequests(userId: string): Promise<Friend[]> {
  const result = await query(
    `
    SELECT 
      f.*,
      u.name as friend_name,
      u.email as friend_email,
      u.avatar_url as friend_avatar
    FROM friends f
    JOIN users u ON f.user_id = u.id
    WHERE f.friend_id = $1 AND f.status = 'pending' AND u.is_active = true
    ORDER BY f.created_at DESC
  `,
    [userId],
  )

  return result.rows
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  await transaction(async (client) => {
    // Remove both directions of friendship
    await client.query(
      `
      DELETE FROM friends 
      WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)
    `,
      [userId, friendId],
    )
  })
}

export async function blockFriend(userId: string, friendId: string): Promise<void> {
  await query(
    `
    UPDATE friends 
    SET status = 'blocked'
    WHERE user_id = $1 AND friend_id = $2
  `,
    [userId, friendId],
  )
}

export async function getFriendshipStatus(userId: string, friendId: string): Promise<string | null> {
  const result = await query(
    `
    SELECT status FROM friends 
    WHERE user_id = $1 AND friend_id = $2
  `,
    [userId, friendId],
  )

  return result.rows[0]?.status || null
}

export async function getSuggestedFriends(userId: string, limit = 10): Promise<any[]> {
  // This is a simplified suggestion algorithm
  // In production, you might want more sophisticated logic
  const result = await query(
    `
    SELECT DISTINCT
      u.id,
      u.name,
      u.email,
      u.avatar_url,
      COUNT(mutual_groups.group_id) as mutual_groups
    FROM users u
    LEFT JOIN group_members gm ON u.id = gm.user_id
    LEFT JOIN group_members mutual_groups ON gm.group_id = mutual_groups.group_id AND mutual_groups.user_id = $1
    WHERE u.id != $1 
    AND u.is_active = true
    AND u.id NOT IN (
      SELECT friend_id FROM friends WHERE user_id = $1
    )
    GROUP BY u.id, u.name, u.email, u.avatar_url
    HAVING COUNT(mutual_groups.group_id) > 0
    ORDER BY mutual_groups DESC
    LIMIT $2
  `,
    [userId, limit],
  )

  return result.rows
}
