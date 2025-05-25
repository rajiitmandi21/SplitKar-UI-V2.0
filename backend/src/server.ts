import dotenv from "dotenv"

// Load environment variables first
dotenv.config()

import app from "./app"
import { db } from "./config/database"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 5000

export async function startServer() {
  try {
    logger.info("🚀 Starting SplitKar Backend Server...")

    // Validate environment variables
    if (!process.env.DATABASE_URL) {
      logger.error("❌ DATABASE_URL environment variable is required")
      process.exit(1)
    }

    // Wait a moment for database connection to establish
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Test database connection
    logger.info("🔍 Testing database connection...")
    await db.query("SELECT NOW() as server_time")
    logger.info("✅ Database connection verified")

    app.listen(PORT, () => {
      logger.info("🚀 Server started successfully", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        healthCheck: `http://localhost:${PORT}/health`,
        apiBase: `http://localhost:${PORT}/api`,
      })
    })
  } catch (error) {
    logger.error("❌ Failed to start server", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully")
  await db.close()
  process.exit(0)
})

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully")
  await db.close()
  process.exit(0)
})

// Only start server if this file is run directly
if (require.main === module) {
  startServer()
}
