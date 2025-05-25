import dotenv from "dotenv"

// Load environment variables first
dotenv.config()

import express from "express"
import cors from "cors"
import helmet from "helmet"
import { logger } from "./utils/logger"

const app = express()
const PORT = process.env.PORT || 5001 // Changed from 5000 to 5001

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
  })
})

// Basic auth endpoint for testing
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    })
  }

  // In a real app, you would save to database here
  logger.info("Registration attempt:", { name, email })

  // Return success response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: "temp-id-123", name, email },
  })
})

// Login endpoint for testing
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    })
  }

  // In a real app, you would verify credentials here
  logger.info("Login attempt:", { email })

  // Return mock token
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: "mock-jwt-token-123",
    user: { id: "temp-id-123", name: "Test User", email },
  })
})

// Test email endpoint
app.post("/api/test/send-email", (req, res) => {
  const { email } = req.body

  logger.info("Test email request:", { email })

  // Mock email sending for now
  res.json({
    success: true,
    message: "Test email sent successfully",
    verificationUrl: `http://localhost:3000/auth/verify?token=test-token-123`,
  })
})

// Start server function with better error handling
export async function startServer() {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(PORT, () => {
      logger.info("🚀 Server started successfully", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        healthCheck: `http://localhost:${PORT}/health`,
        apiBase: `http://localhost:${PORT}/api`,
      })
      resolve()
    })

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`❌ Port ${PORT} is already in use`, {
          port: PORT,
          suggestion: `Try running: lsof -ti:${PORT} | xargs kill -9`,
        })
        reject(new Error(`Port ${PORT} is already in use`))
      } else {
        logger.error("❌ Failed to start server", { error: error.message })
        reject(error)
      }
    })
  })
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Only start server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  })
}
