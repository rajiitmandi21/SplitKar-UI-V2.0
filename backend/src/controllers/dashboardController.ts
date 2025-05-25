import type { Request, Response } from "express"
import { userModel } from "../models/User"
import { logger } from "../utils/logger"

export class DashboardController {
  async getDashboardData(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const userId = (req as any).user?.userId

      logger.info("📊 Dashboard data request", { requestId, userId })

      if (!userId) {
        res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        })
        return
      }

      // Get user profile
      const user = await userModel.findById(userId)
      if (!user) {
        res.status(404).json({
          error: "Not Found",
          message: "User not found",
        })
        return
      }

      // Get user stats
      const stats = await userModel.getStats(userId)

      // Mock data for dashboard (in a real app, this would come from various models)
      const dashboardData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          is_verified: user.is_verified,
        },
        stats: {
          totalExpenses: stats.totalExpenses || 0,
          totalGroups: stats.totalGroups || 0,
          totalFriends: stats.totalFriends || 0,
          pendingSettlements: stats.pendingSettlements || 0,
        },
        recentExpenses: [
          // Mock recent expenses - in real app, fetch from expenses table
          {
            id: "1",
            description: "Dinner at Pizza Palace",
            amount: 1250.00,
            date: new Date().toISOString(),
            group: "Weekend Squad",
            paidBy: user.name,
            yourShare: 312.50,
          },
          {
            id: "2", 
            description: "Movie tickets",
            amount: 800.00,
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            group: "College Friends",
            paidBy: "Priya Sharma",
            yourShare: 200.00,
          },
        ],
        recentGroups: [
          // Mock recent groups - in real app, fetch from groups table
          {
            id: "1",
            name: "Weekend Squad",
            memberCount: 4,
            totalExpenses: 5420.00,
            yourBalance: -125.50,
            lastActivity: new Date().toISOString(),
          },
          {
            id: "2",
            name: "College Friends", 
            memberCount: 6,
            totalExpenses: 2340.00,
            yourBalance: 89.25,
            lastActivity: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
        ],
        pendingSettlements: [
          // Mock pending settlements
          {
            id: "1",
            withUser: "Amit Kumar",
            amount: 125.50,
            type: "you_owe", // or "owes_you"
            group: "Weekend Squad",
            dueDate: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
          },
        ],
        quickActions: [
          {
            id: "add_expense",
            title: "Add Expense",
            description: "Record a new expense",
            icon: "plus",
            href: "/expenses/add",
          },
          {
            id: "create_group",
            title: "Create Group",
            description: "Start a new group",
            icon: "users",
            href: "/groups/create",
          },
          {
            id: "settle_up",
            title: "Settle Up",
            description: "Pay or request money",
            icon: "credit-card",
            href: "/settle",
          },
          {
            id: "add_friends",
            title: "Add Friends",
            description: "Invite friends to SplitKar",
            icon: "user-plus",
            href: "/friends/add",
          },
        ],
      }

      logger.info("📊 Dashboard data retrieved successfully", { 
        requestId, 
        userId,
        expenseCount: dashboardData.recentExpenses.length,
        groupCount: dashboardData.recentGroups.length,
      })

      res.json({
        success: true,
        data: dashboardData,
      })
    } catch (error) {
      logger.error("❌ Dashboard data error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch dashboard data",
      })
    }
  }
}

export const dashboardController = new DashboardController() 