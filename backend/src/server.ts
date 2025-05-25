import express from "express"
import cors from "cors"
import helmet from "helmet"

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Simple logger
const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️  ${message}`, data ? JSON.stringify(data, null, 2) : "")
  },
  error: (message: string, data?: any) => {
    console.error(`❌ ${message}`, data ? JSON.stringify(data, null, 2) : "")
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️  ${message}`, data ? JSON.stringify(data, null, 2) : "")
  },
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
  })
})

// Basic auth endpoints for testing
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, upi_id } = req.body

  logger.info("Registration attempt", { name, email, upi_id })

  // Simple validation
  if (!name || !email || !password || !upi_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, password, upi_id",
    })
  }

  // Mock successful registration
  res.status(201).json({
    success: true,
    message: "User registered successfully. Please check your email to verify your account.",
    user: {
      id: `user-${Date.now()}`,
      name,
      email,
      upi_id,
      is_verified: false,
    },
  })
})

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  logger.info("Login attempt", { email })

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    })
  }

  // Mock successful login
  res.json({
    success: true,
    message: "Login successful",
    token: `mock-jwt-${Date.now()}`,
    user: {
      id: `user-${Date.now()}`,
      name: "Test User",
      email,
      is_verified: true,
    },
  })
})

// Test email endpoint
app.post("/api/test/send-email", (req, res) => {
  const { email } = req.body

  logger.info("Test email request", { email })

  // Mock email sending
  res.json({
    success: true,
    message: "Test email sent successfully (development mode)",
    verificationUrl: `http://localhost:3000/auth/verify?token=test-token-${Date.now()}`,
  })
})

// Start server function
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
        logger.error(`Port ${PORT} is already in use`)
        reject(new Error(`Port ${PORT} is already in use`))
      } else {
        logger.error("Failed to start server", { error: error.message })
        reject(error)
      }
    })
  })
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Start server if this file is run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  })
}
