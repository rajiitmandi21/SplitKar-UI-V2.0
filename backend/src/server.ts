import express from "express"
import cors from "cors"
import helmet from "helmet"

const app = express()
const PORT = process.env.PORT || 5000

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
  console.log("Registration attempt:", { name, email })

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
  console.log("Login attempt:", { email })

  // Return mock token
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: "mock-jwt-token-123",
    user: { id: "temp-id-123", name: "Test User", email },
  })
})

// Start server function
export async function startServer() {
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`)
      resolve()
    })
  })
}

// Direct execution
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error)
    process.exit(1)
  })
}
