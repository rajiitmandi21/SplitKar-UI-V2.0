import { Pool, type PoolClient } from "pg"
import { logger } from "../utils/logger"

// Database connection pool
let pool: Pool | null = null

class Database {
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

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    pool.on("connect", () => {
      logger.info("✅ Database client connected")
      this.isConnected = true
    })

    pool.on("error", (err: Error) => {
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
      const result = await pool!.query(text, params)
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
    return await pool!.connect()
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool!.connect()
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
    if (pool) {
      await pool.end()
      this.isConnected = false
      logger.info("✅ Database connection closed")
    }
  }

  async testConnection(): Promise<void> {
    try {
      logger.info("🔍 Testing database connection...")
      const client = await pool!.connect()
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
      const client = await pool!.connect()
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
          pool_total: pool!.totalCount,
          pool_idle: pool!.idleCount,
          pool_waiting: pool!.waitingCount,
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
      totalCount: pool?.totalCount || 0,
      idleCount: pool?.idleCount || 0,
      waitingCount: pool?.waitingCount || 0,
      isConnected: this.isConnected,
    }
  }
}

// Get database instance
export const getDB = () => {
  if (!pool) {
    throw new Error("Database not initialized. Call connectDatabase() first.")
  }
  return pool
}

// Export db for compatibility
export const db = {
  query: async (text: string, params?: any[]) => {
    const client = await getDB().connect()
    try {
      const result = await client.query(text, params)
      return result
    } finally {
      client.release()
    }
  },
  transaction: async (callback: (client: any) => Promise<any>) => {
    const client = await getDB().connect()
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
  },
}

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create database instance to initialize the connection
    const database = new Database()
    await database.testConnection()

    logger.info("✅ Database connected successfully")
  } catch (error) {
    logger.error("❌ Database connection failed", { error })
    throw error
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("🛑 Received SIGINT, closing database connection...")
  if (pool) {
    await pool.end()
  }
  process.exit(0)
})

process.on("SIGTERM", async () => {
  logger.info("🛑 Received SIGTERM, closing database connection...")
  if (pool) {
    await pool.end()
  }
  process.exit(0)
})
