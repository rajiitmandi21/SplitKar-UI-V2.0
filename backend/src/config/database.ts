import { Pool, type PoolClient } from "pg"
import { logger } from "../utils/logger"

class Database {
  private pool: Pool
  private isConnected = false

  constructor() {
    // Load environment variables first
    const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/splitkar"

    logger.info("🔍 Environment check", {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!databaseUrl,
      databaseUrlLength: databaseUrl?.length || 0,
      databaseUrlPrefix: databaseUrl?.substring(0, 10) || "undefined",
    })

    logger.info("🔗 Connecting to database...")

    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    this.pool.on("connect", () => {
      logger.info("✅ Database client connected")
      this.isConnected = true
    })

    this.pool.on("error", (err: Error) => {
      logger.error("❌ Unexpected error on idle client", { error: err.message, stack: err.stack })
      this.isConnected = false
    })
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
        query: text.substring(0, 100),
        params: params ? params.length : 0,
      })
      throw error
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect()
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query("BEGIN")
      const result = await callback(client)
      await client.query("COMMIT")
      return result
    } catch (error) {
      await client.query("ROLLBACK")
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

  async testConnection(): Promise<void> {
    try {
      logger.info("🔍 Testing database connection...")
      const client = await this.pool.connect()
      const result = await client.query("SELECT NOW() as current_time, version() as pg_version")

      logger.info("✅ Database connected successfully", {
        serverTime: result.rows[0].current_time,
        pgVersion: result.rows[0].pg_version.split(" ")[0],
      })

      client.release()
      this.isConnected = true
    } catch (error) {
      logger.error("❌ Database connection failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code,
      })
      this.isConnected = false
      throw error
    }
  }

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

      const healthData = {
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

      logger.debug("📊 Database health check", healthData.details)
      return healthData
    } catch (error) {
      const healthData = {
        status: "unhealthy",
        details: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }

      logger.error("❌ Database health check failed", healthData.details)
      return healthData
    }
  }

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
const db = new Database()

// Export the database instance as getDB for compatibility
export const getDB = () => db

export const connectDatabase = async (): Promise<void> => {
  // Test the connection immediately
  await db.testConnection()
  logger.info("Database connection initialized")
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("🛑 Received SIGINT, closing database connection...")
  await db.close()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  logger.info("🛑 Received SIGTERM, closing database connection...")
  await db.close()
  process.exit(0)
})
