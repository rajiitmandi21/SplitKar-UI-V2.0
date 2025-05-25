import { Pool, type PoolClient } from "pg"
import { logger } from "../utils/logger"

class Database {
  private pool: Pool
  private isConnected = false

  constructor() {
    // Load environment variables
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      logger.error("❌ DATABASE_URL environment variable is required")
      throw new Error("DATABASE_URL environment variable is required")
    }

    logger.info("🔗 Initializing database connection...", {
      url: databaseUrl.replace(/:[^:@]*@/, ":****@"), // Hide password in logs
    })

    // Parse connection string for validation
    try {
      const url = new URL(databaseUrl)
      logger.info("📊 Database connection details", {
        host: url.hostname,
        port: url.port || "5432",
        database: url.pathname.slice(1),
        user: url.username,
        ssl: databaseUrl.includes("sslmode=require") ? "required" : "disabled",
      })
    } catch (error) {
      logger.error("❌ Invalid DATABASE_URL format", {
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw new Error("Invalid DATABASE_URL format. Expected: postgres://user:password@host:port/database")
    }

    // Configure connection pool
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
      acquireTimeoutMillis: 60000, // Return an error after 60 seconds if unable to acquire a connection
    })

    // Pool event handlers
    this.pool.on("connect", (client) => {
      logger.info("✅ Database client connected", {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
      })
      this.isConnected = true
    })

    this.pool.on("error", (err: Error) => {
      logger.error("❌ Unexpected error on idle client", {
        error: err.message,
        stack: err.stack,
        code: (err as any).code,
      })
      this.isConnected = false
    })

    this.pool.on("remove", () => {
      logger.debug("🔌 Database client removed from pool")
    })

    // Test the connection immediately
    this.testConnection()
  }

  private async testConnection(): Promise<void> {
    const maxRetries = 3
    let retryCount = 0

    while (retryCount < maxRetries) {
      try {
        logger.info(`🔍 Testing database connection (attempt ${retryCount + 1}/${maxRetries})...`)

        const client = await this.pool.connect()
        const result = await client.query(
          "SELECT NOW() as current_time, version() as pg_version, current_database() as db_name",
        )

        logger.info("✅ Database connected successfully", {
          serverTime: result.rows[0].current_time,
          pgVersion: result.rows[0].pg_version.split(" ")[0],
          database: result.rows[0].db_name,
          poolStats: {
            total: this.pool.totalCount,
            idle: this.pool.idleCount,
            waiting: this.pool.waitingCount,
          },
        })

        client.release()
        this.isConnected = true
        return
      } catch (error) {
        retryCount++
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        const errorCode = (error as any)?.code

        logger.error(`❌ Database connection failed (attempt ${retryCount}/${maxRetries})`, {
          error: errorMessage,
          code: errorCode,
          hint: this.getConnectionHint(errorCode),
        })

        if (retryCount >= maxRetries) {
          this.isConnected = false
          throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${errorMessage}`)
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000 * retryCount))
      }
    }
  }

  private getConnectionHint(errorCode: string): string {
    switch (errorCode) {
      case "ECONNREFUSED":
        return "Database server is not running or not accessible"
      case "ENOTFOUND":
        return "Database host not found - check hostname"
      case "ECONNRESET":
        return "Connection was reset - check network or firewall"
      case "28P01":
        return "Invalid username or password"
      case "3D000":
        return "Database does not exist"
      case "28000":
        return "Invalid authorization specification"
      default:
        return "Check your DATABASE_URL and ensure PostgreSQL is running"
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.isConnected) {
      logger.warn("⚠️ Database not connected, attempting to reconnect...")
      await this.testConnection()
    }

    const start = Date.now()
    const queryId = Math.random().toString(36).substring(7)

    logger.debug("🔍 Executing query", {
      queryId,
      query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
      params: params ? params.length : 0,
    })

    try {
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start

      // Log slow queries (> 1000ms)
      if (duration > 1000) {
        logger.warn("🐌 Slow query detected", {
          queryId,
          duration: `${duration}ms`,
          query: text.substring(0, 100),
          rowCount: result.rowCount,
        })
      } else {
        logger.debug("✅ Query completed", {
          queryId,
          duration: `${duration}ms`,
          rowCount: result.rowCount,
        })
      }

      return result
    } catch (error) {
      logger.error("❌ Database query error", {
        queryId,
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code,
        query: text.substring(0, 100),
        params: params ? params.length : 0,
      })
      throw error
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.isConnected) {
      await this.testConnection()
    }
    return await this.pool.connect()
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient()
    try {
      await client.query("BEGIN")
      logger.debug("🔄 Transaction started")

      const result = await callback(client)

      await client.query("COMMIT")
      logger.debug("✅ Transaction committed")

      return result
    } catch (error) {
      await client.query("ROLLBACK")
      logger.error("🔄 Transaction rolled back", {
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    } finally {
      client.release()
    }
  }

  async close(): Promise<void> {
    logger.info("🔌 Closing database connection...")
    await this.pool.end()
    this.isConnected = false
    logger.info("✅ Database connection closed")
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
          NOW() as current_time,
          pg_database_size(current_database()) as db_size
      `)
      client.release()

      const healthData = {
        status: "healthy",
        details: {
          connected: true,
          database: result.rows[0].database_name,
          user: result.rows[0].user_name,
          version: result.rows[0].version.split(" ")[0],
          timestamp: result.rows[0].current_time,
          databaseSize: result.rows[0].db_size,
          pool: {
            total: this.pool.totalCount,
            idle: this.pool.idleCount,
            waiting: this.pool.waitingCount,
          },
        },
      }

      logger.debug("📊 Database health check passed", healthData.details)
      return healthData
    } catch (error) {
      const healthData = {
        status: "unhealthy",
        details: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
          code: (error as any)?.code,
          timestamp: new Date().toISOString(),
        },
      }

      logger.error("❌ Database health check failed", healthData.details)
      return healthData
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

// Export connection function for app.ts
export const connectDatabase = async (): Promise<void> => {
  logger.info("🚀 Database connection initialized")
}

// Graceful shutdown handlers
process.on("SIGINT", async () => {
  logger.info("🛑 Received SIGINT, closing database connection...")
  try {
    await db.close()
    process.exit(0)
  } catch (error) {
    logger.error("❌ Error during graceful shutdown", {
      error: error instanceof Error ? error.message : "Unknown error",
    })
    process.exit(1)
  }
})

process.on("SIGTERM", async () => {
  logger.info("🛑 Received SIGTERM, closing database connection...")
  try {
    await db.close()
    process.exit(0)
  } catch (error) {
    logger.error("❌ Error during graceful shutdown", {
      error: error instanceof Error ? error.message : "Unknown error",
    })
    process.exit(1)
  }
})
