import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { validateApiKey, createApiKeyRateLimit, logApiKeyUsage } from "./middleware/apiKey"
import authRoutes from "./routes/auth"
import groupRoutes from "./routes/groups"
import { connectDatabase } from "./config/database"

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// API key middleware (applied to all routes except health check)
app.use("/api", validateApiKey)
app.use("/api", createApiKeyRateLimit())
app.use("/api", logApiKeyUsage)

// Health check endpoint (no API key required)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "splitkar-backend",
    version: "1.0.0",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/groups", groupRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist.",
    path: req.originalUrl,
  })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err)

  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// Initialize database connection
connectDatabase().catch(console.error)

export default app
