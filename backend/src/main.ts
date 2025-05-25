import app from "./app"
import { initializeDatabase } from "./config/database"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 5001

async function startServer() {
  try {
    // Initialize database connection
    logger.info("🔗 Initializing database connection...")
    await initializeDatabase()
    logger.info("✅ Database initialized successfully")

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info("🚀 SplitKar Backend Server started successfully", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        healthCheck: `http://localhost:${PORT}/health`,
        apiBase: `http://localhost:${PORT}/api`,
        database: "PostgreSQL connected",
        features: [
          "User registration with email verification",
          "Database-backed authentication", 
          "Real user creation with is_verified flag",
          "Group management",
          "Expense tracking"
        ]
      })
    })

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`❌ Port ${PORT} is already in use`)
        process.exit(1)
      } else {
        logger.error("❌ Failed to start server", { error: error.message })
        process.exit(1)
      }
    })

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("📴 SIGTERM received, shutting down gracefully")
      server.close(() => {
        logger.info("✅ Server closed")
        process.exit(0)
      })
    })

    process.on("SIGINT", () => {
      logger.info("📴 SIGINT received, shutting down gracefully")
      server.close(() => {
        logger.info("✅ Server closed")
        process.exit(0)
      })
    })

  } catch (error) {
    logger.error("❌ Failed to start server", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    process.exit(1)
  }
}

startServer() 