import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { db } from "./config/database"

// Import routes
import authRoutes from "./routes/auth"
import groupRoutes from "./routes/groups"

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1")
    res.json({ status: "healthy", timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: "Database connection failed" })
  }
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/groups", groupRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err)

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid JSON in request body",
    })
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  })
})

export default app
