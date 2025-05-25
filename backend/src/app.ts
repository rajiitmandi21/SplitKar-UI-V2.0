import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"

import { logger, logRequest } from "./utils/logger"
import { validateApiKey, createApiKeyRateLimit, logApiKeyUsage } from "./middleware/apiKey"

// Import routes
import authRoutes from "./routes/auth"
import groupRoutes from "./routes/groups"
import dashboardRoutes from "./routes/dashboard"
import testRoutes from "./routes/test"

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Compression
app.use(compression())

// Request logging
app.use(logRequest)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too Many Requests",
    message: "Too many requests from this IP, please try again later.",
  },
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: process.env.PORT || 5001,
  })
})

// API routes with key validation
app.use("/api", validateApiKey, createApiKeyRateLimit(), logApiKeyUsage)
app.use("/api/auth", authRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/test", testRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  })

  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong",
  })
})

export default app
