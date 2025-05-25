import dotenv from "dotenv"

// Load environment variables first
dotenv.config()

import app from "./app"
import { db } from "./config/database"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    logger.info("🚀 Starting SplitKar Backend Server...")

    // Validate required environment variables
    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"]
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      logger.error("❌ Missing required environment variables", { missing: missingEnvVars })
      process.exit(1)
    }

    // Test database connection
    logger.info("🔍 Testing database connection...")
    await db.query("SELECT NOW() as server_time")
    logger.info("✅ Database connection verified")

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info("🚀 Server started successfully", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        healthCheck: `http://localhost:${PORT}/health`,
        apiBase: `http://localhost:${PORT}/api`,
        database: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":****@"), // Hide password
      })
    })

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🛑 Received ${signal}, shutting down gracefully...`)

      server.close(async () => {
        logger.info("🔌 HTTP server closed")

        try {
          await db.close()
          logger.info("✅ Graceful shutdown completed")
          process.exit(0)
        } catch (error) {
          logger.error("❌ Error during shutdown", { error: error instanceof Error ? error.message : "Unknown error" })
          process.exit(1)
        }
      })

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error("⚠️ Forced shutdown after timeout")
        process.exit(1)
      }, 10000)
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    logger.error("❌ Failed to start server", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("❌ Uncaught Exception", { error: error.message, stack: error.stack })
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  logger.error("❌ Unhandled Rejection", { reason, promise })
  process.exit(1)
})

startServer()
