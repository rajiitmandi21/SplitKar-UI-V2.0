import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { db } from "./config/database"
import { emailService } from "./config/email"

// Import routes
import authRoutes from "./routes/auth"
import groupRoutes from "./routes/groups"
import expenseRoutes from "./routes/expenses"
import friendRoutes from "./routes/friends"

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too Many Requests",
    message: "Too many requests from this IP, please try again later.",
  },
})

app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbHealth = await db.healthCheck()
    const emailHealth = await emailService.testConnection()

    const health = {
      status: dbHealth.status === "healthy" && emailHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        email: {
          status: emailHealth ? "healthy" : "unhealthy",
          connected: emailHealth,
        },
      },
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
    }

    res.status(health.status === "healthy" ? 200 : 503).json(health)
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/friends", friendRoutes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SplitKar API Server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      groups: "/api/groups",
      expenses: "/api/expenses",
      friends: "/api/friends",
    },
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  })
})

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Global error handler:", error)

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development"

  res.status(error.status || 500).json({
    error: "Internal Server Error",
    message: isDevelopment ? error.message : "Something went wrong",
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  })
})

export default app
