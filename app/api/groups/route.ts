import { type NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user's groups with member count and balance info
    const result = await query(
      `
      SELECT 
        g.id,
        g.name,
        g.description,
        g.created_by,
        g.created_at,
        COUNT(gm.user_id) as member_count,
        COALESCE(SUM(CASE WHEN e.paid_by = $1 THEN e.amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(es.amount), 0) as total_owed
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN expenses e ON g.id = e.group_id
      LEFT JOIN expense_splits es ON e.id = es.expense_id AND es.user_id = $1
      WHERE gm.user_id = $1 AND gm.status = 'active'
      GROUP BY g.id, g.name, g.description, g.created_by, g.created_at
      ORDER BY g.created_at DESC
    `,
      [userId],
    )

    return NextResponse.json({ groups: result.rows })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, createdBy, members = [] } = body

    if (!name || !createdBy) {
      return NextResponse.json({ error: "Name and creator are required" }, { status: 400 })
    }

    const result = await transaction(async (client) => {
      // Create group
      const groupResult = await client.query(
        "INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
        [name, description, createdBy],
      )

      const group = groupResult.rows[0]

      // Add creator as admin member
      await client.query("INSERT INTO group_members (group_id, user_id, role, status) VALUES ($1, $2, $3, $4)", [
        group.id,
        createdBy,
        "admin",
        "active",
      ])

      // Add other members
      for (const memberId of members) {
        if (memberId !== createdBy) {
          await client.query("INSERT INTO group_members (group_id, user_id, role, status) VALUES ($1, $2, $3, $4)", [
            group.id,
            memberId,
            "member",
            "active",
          ])
        }
      }

      return group
    })

    return NextResponse.json({ group: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
