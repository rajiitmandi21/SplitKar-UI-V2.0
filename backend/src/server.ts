import dotenv from 'dotenv';
dotenv.config();

import app from "./app"
import { getDB } from "./config/database"

const PORT = process.env.PORT || 5000

export async function startServer() {
  try {
    // Test database connection
    const db = getDB(); // Get the database instance after connection is established
    await db.query("SELECT NOW()")
    console.log("✅ Database connected successfully")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  const db = getDB();
  await db.close()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully")
  const db = getDB();
  await db.close()
  process.exit(0)
})

startServer()
