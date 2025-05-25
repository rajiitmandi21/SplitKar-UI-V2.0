import dotenv from "dotenv"

// Load environment variables first
dotenv.config()

import { logger } from "./utils/logger"

logger.info("🚀 Starting SplitKar Backend Application...")
logger.info("Environment check", {
  nodeEnv: process.env.NODE_ENV,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
})

// Import and start the server
import { startServer } from "./server"

startServer().catch((err) => {
  logger.error("❌ Error during startup", { error: err.message, stack: err.stack })
  process.exit(1)
})
