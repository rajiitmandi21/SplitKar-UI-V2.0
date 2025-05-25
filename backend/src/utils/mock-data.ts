import { userModel } from "../models/User"
import { groupModel } from "../models/Group"
import { getDB } from "../config/database"
import { logger } from "./logger"

export class MockDataService {
  async createMockUsers() {
    const mockUsers = [
      {
        email: "user@demo.com",
        name: "Demo User",
        password: "password123",
        phone: "+91-9876543210",
        upi_id: "demouser@paytm",
        role: "user",
      },
      {
        email: "admin@demo.com",
        name: "Admin User",
        password: "password123",
        phone: "+91-9876543211",
        upi_id: "adminuser@phonepe",
        role: "admin",
      },
      {
        email: "alice@demo.com",
        name: "Alice Johnson",
        password: "password123",
        phone: "+91-9876543212",
        upi_id: "alice.johnson@gpay",
        role: "user",
      },
      {
        email: "bob@demo.com",
        name: "Bob Smith",
        password: "password123",
        phone: "+91-9876543213",
        upi_id: "bobsmith@paytm",
        role: "user",
      },
      {
        email: "charlie@demo.com",
        name: "Charlie Brown",
        password: "password123",
        phone: "+91-9876543214",
        upi_id: "charlie.brown@phonepe",
        role: "user",
      },
    ]

    const createdUsers = []
    for (const userData of mockUsers) {
      try {
        const user = await userModel.create(userData)
        createdUsers.push(user)
        logger.info(`✅ Created user: ${user.email}`)
      } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
          logger.info(`⚠️  User already exists: ${userData.email}`)
          const existingUser = await userModel.findByEmail(userData.email)
          if (existingUser) {
            createdUsers.push(existingUser)
          }
        } else {
          logger.error(`❌ Failed to create user ${userData.email}:`, { error })
        }
      }
    }

    return createdUsers
  }

  async createMockGroups(users: any[]) {
    if (users.length < 3) {
      logger.warn("⚠️  Need at least 3 users to create mock groups")
      return []
    }

    const mockGroups = [
      {
        name: "Flatmates",
        description: "Apartment expenses and bills",
        icon: "home",
        color: "bg-blue-500",
        currency: "INR",
        created_by: users[0].id,
        member_ids: [users[1].id, users[2].id],
      },
      {
        name: "College Friends",
        description: "Weekend trips and hangouts",
        icon: "graduation",
        color: "bg-green-500",
        currency: "INR",
        created_by: users[1].id,
        member_ids: [users[0].id, users[3].id],
      },
      {
        name: "Office Team",
        description: "Team lunches and events",
        icon: "briefcase",
        color: "bg-purple-500",
        currency: "INR",
        created_by: users[2].id,
        member_ids: [users[0].id, users[1].id, users[4].id],
      },
    ]

    const createdGroups = []
    for (const groupData of mockGroups) {
      try {
        const group = await groupModel.create(groupData)
        createdGroups.push(group)
        logger.info(`✅ Created group: ${group.name}`)
      } catch (error) {
        logger.error(`❌ Failed to create group ${groupData.name}:`, { error })
      }
    }

    return createdGroups
  }

  async createMockExpenses(groups: any[], users: any[]) {
    if (groups.length === 0 || users.length === 0) {
      logger.warn("⚠️  Need groups and users to create mock expenses")
      return []
    }

    const mockExpenses = [
      {
        description: "Electricity Bill",
        amount: 2500,
        category: "utilities",
        paid_by: users[0].id,
        group_id: groups[0].id,
        splits: [
          { userId: users[0].id, amount: 833.33 },
          { userId: users[1].id, amount: 833.33 },
          { userId: users[2].id, amount: 833.34 },
        ],
      },
      {
        description: "Grocery Shopping",
        amount: 1800,
        category: "food",
        paid_by: users[1].id,
        group_id: groups[0].id,
        splits: [
          { userId: users[0].id, amount: 600 },
          { userId: users[1].id, amount: 600 },
          { userId: users[2].id, amount: 600 },
        ],
      },
      {
        description: "Weekend Trip to Goa",
        amount: 15000,
        category: "travel",
        paid_by: users[0].id,
        group_id: groups[1].id,
        splits: [
          { userId: users[0].id, amount: 5000 },
          { userId: users[1].id, amount: 5000 },
          { userId: users[3].id, amount: 5000 },
        ],
      },
    ]

    const createdExpenses = []
    for (const expenseData of mockExpenses) {
      try {
        const result = await getDB().transaction(async (client) => {
          // Create expense
          const expenseResult = await client.query(
            `INSERT INTO expenses (description, amount, category, paid_by, group_id, date)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING *`,
            [
              expenseData.description,
              expenseData.amount,
              expenseData.category,
              expenseData.paid_by,
              expenseData.group_id,
            ],
          )

          const expense = expenseResult.rows[0]

          // Create splits
          for (const split of expenseData.splits) {
            await client.query(
              `INSERT INTO expense_splits (expense_id, user_id, amount)
               VALUES ($1, $2, $3)`,
              [expense.id, split.userId, split.amount],
            )
          }

          return expense
        })

        createdExpenses.push(result)
        logger.info(`✅ Created expense: ${expenseData.description}`)
      } catch (error) {
        logger.error(`❌ Failed to create expense ${expenseData.description}:`, { error })
      }
    }

    return createdExpenses
  }

  async setupMockData() {
    logger.info("🎭 Setting up mock data...")

    try {
      const users = await this.createMockUsers()
      const groups = await this.createMockGroups(users)
      const expenses = await this.createMockExpenses(groups, users)

      logger.info("🎉 Mock data setup completed!")
      logger.info(`📊 Created: ${users.length} users, ${groups.length} groups, ${expenses.length} expenses`)

      return {
        users,
        groups,
        expenses,
      }
    } catch (error) {
      logger.error("❌ Mock data setup failed:", { error })
      throw error
    }
  }

  async clearMockData() {
    logger.info("🧹 Clearing mock data...")

    try {
      await getDB().query("DELETE FROM expense_splits WHERE 1=1")
      await getDB().query("DELETE FROM expenses WHERE 1=1")
      await getDB().query("DELETE FROM group_members WHERE 1=1")
      await getDB().query("DELETE FROM groups WHERE 1=1")
      await getDB().query("DELETE FROM user_settings WHERE 1=1")
      await getDB().query("DELETE FROM users WHERE email LIKE '%@demo.com'")

      logger.info("✅ Mock data cleared successfully")
    } catch (error) {
      logger.error("❌ Failed to clear mock data:", { error })
      throw error
    }
  }
}

export const mockDataService = new MockDataService()
