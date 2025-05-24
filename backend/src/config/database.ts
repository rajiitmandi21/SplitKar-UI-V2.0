import { Pool } from "pg"

class Database {
  private pool: Pool
  private isConnected = false

  constructor() {
    // Validate DATABASE_URL format
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required")
    }

    // Validate URL format: postgres://user:pwd@host.com:port/xyz?sslmode=require
    const urlPattern = /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/
    if (!urlPattern.test(databaseUrl)) {
      throw new Error("DATABASE_URL must be in format: postgres://user:pwd@host.com:port/xyz?sslmode=require")
    }

    console.log("🔗 Connecting to database...")

    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    })

    this.pool.on("connect", () => {
      console.log("✅ Database client connected")
      this.isConnected = true
    })

    this.pool.on("error", (err) => {
      console.error("❌ Unexpected error on idle client", err)
      this.isConnected = false
    })

    // Test the connection
    this.testConnection()
  }

  private async testConnection() {
    try {
      const client = await this.pool.connect()
      const result = await client.query("SELECT NOW() as current_time, version() as pg_version")
      console.log("✅ Database connected successfully")
      console.log(`📅 Server time: ${result.rows[0].current_time}`)
      console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(" ")[0]}`)
      client.release()
      this.isConnected = true
    } catch (error) {
      console.error("❌ Database connection failed:", error)
      this.isConnected = false
      throw error
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.isConnected) {
      throw new Error("Database not connected")
    }

    const start = Date.now()
    try {
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start

      // Log slow queries (> 1000ms)
      if (duration > 1000) {
        console.warn(`🐌 Slow query detected (${duration}ms):`, text.substring(0, 100))
      }

      return result
    } catch (error) {
      console.error("❌ Database query error:", error)
      console.error("Query:", text)
      console.error("Params:", params)
      throw error
    }
  }

  async getClient() {
    return await this.pool.connect()
  }

  async close() {
    console.log("🔌 Closing database connection...")
    await this.pool.end()
    this.isConnected = false
    console.log("✅ Database connection closed")
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const client = await this.pool.connect()
      const result = await client.query(`
        SELECT 
          current_database() as database_name,
          current_user as user_name,
          version() as version,
          NOW() as current_time
      `)
      client.release()

      return {
        status: "healthy",
        details: {
          connected: true,
          database: result.rows[0].database_name,
          user: result.rows[0].user_name,
          version: result.rows[0].version.split(" ")[0],
          timestamp: result.rows[0].current_time,
          pool_total: this.pool.totalCount,
          pool_idle: this.pool.idleCount,
          pool_waiting: this.pool.waitingCount,
        },
      }
    } catch (error) {
      return {
        status: "unhealthy",
        details: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }
    }
  }

  // Get connection info
  getConnectionInfo() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      isConnected: this.isConnected,
    }
  }
}

// Create and export database instance
export const db = new Database()

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT, closing database connection...")
  await db.close()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, closing database connection...")
  await db.close()
  process.exit(0)
})
