import express from "express"
import cors from "cors"
import { logger } from "./utils/logger"

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
app.use(express.json())

// Simple auth middleware that accepts any token
const simpleAuth = (req: any, res: any, next: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }
  // Mock user for any valid token
  req.user = { userId: "1", email: "test@example.com", name: "Test User" }
  next()
}

// API Key middleware
const validateApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.header("X-API-Key")
  if (!apiKey || !["dev-api-key-123", "frontend-key"].includes(apiKey)) {
    return res.status(403).json({ error: "Invalid API key" })
  }
  next()
}

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
  })
})

// Dashboard endpoint
app.get("/api/dashboard", validateApiKey, simpleAuth, (req: any, res) => {
  const dashboardData = {
    user: {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      avatar_url: null,
      is_verified: true,
    },
    stats: {
      totalExpenses: 5,
      totalGroups: 2,
      totalFriends: 8,
      pendingSettlements: 1,
    },
    recentExpenses: [
      {
        id: "1",
        description: "Dinner at Pizza Palace",
        amount: 1250.00,
        date: new Date().toISOString(),
        group: "Weekend Squad",
        paidBy: "Test User",
        yourShare: 312.50,
      },
      {
        id: "2", 
        description: "Movie tickets",
        amount: 800.00,
        date: new Date(Date.now() - 86400000).toISOString(),
        group: "College Friends",
        paidBy: "Priya Sharma",
        yourShare: 200.00,
      },
    ],
    recentGroups: [
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
        lastActivity: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    pendingSettlements: [
      {
        id: "1",
        withUser: "Amit Kumar",
        amount: 125.50,
        type: "you_owe",
        group: "Weekend Squad",
        dueDate: new Date(Date.now() + 604800000).toISOString(),
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

  res.json({
    success: true,
    data: dashboardData,
  })
})

// Auth endpoints for compatibility
app.post("/api/auth/login", validateApiKey, (req, res) => {
  res.json({
    success: true,
    token: "mock-jwt-token",
    user: {
      id: "1",
      name: "Test User",
      email: req.body.email,
      is_verified: true,
    },
  })
})

app.post("/api/auth/register", validateApiKey, (req, res) => {
  res.json({
    success: true,
    message: "User registered successfully",
    user: {
      id: "1",
      name: req.body.name,
      email: req.body.email,
      is_verified: false,
    },
  })
})

app.post("/api/auth/verify-email", validateApiKey, (req, res) => {
  res.json({
    success: true,
    message: "Email verified successfully",
    token: "mock-jwt-token",
  })
})

app.get("/api/auth/profile", validateApiKey, simpleAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      is_verified: true,
    },
  })
})

// Start server
app.listen(PORT, () => {
  logger.info("🚀 Simple Backend Server started", {
    port: PORT,
    healthCheck: `http://localhost:${PORT}/health`,
    apiBase: `http://localhost:${PORT}/api`,
  })
}) 