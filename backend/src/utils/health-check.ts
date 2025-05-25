import type { Pool } from "pg"
import Redis from "ioredis"
import { logger } from "./logger"

interface HealthStatus {
  status: "healthy" | "unhealthy"
  timestamp: string
  services: {
    database: "connected" | "disconnected" | "error"
    cache: "connected" | "disconnected" | "error"
    email: "configured" | "not_configured"
    security: "configured" | "not_configured"
  }
  performance: {
    uptime: string
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
  }
  version: string
  environment: string
}

export class HealthChecker {
  private dbPool: Pool
  private redis: Redis | null = null

  constructor(dbPool: Pool) {
    this.dbPool = dbPool

    // Initialize Redis if URL is provided
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL)
    }
  }

  async checkDatabase(): Promise<"connected" | "disconnected" | "error"> {
    try {
      const client = await this.dbPool.connect()
      await client.query("SELECT 1")
      client.release()
      return "connected"
    } catch (error) {
      logger.error("Database health check failed", { error: (error as Error).message })
      return "error"
    }
  }

  async checkCache(): Promise<"connected" | "disconnected" | "error"> {
    if (!this.redis) {
      return "disconnected"
    }

    try {
      await this.redis.ping()
      return "connected"
    } catch (error) {
      logger.error("Cache health check failed", { error: (error as Error).message })
      return "error"
    }
  }

  checkEmailConfiguration(): "configured" | "not_configured" {
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD
    const gmailClientId = process.env.GMAIL_CLIENT_ID
    const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET

    return gmailUser && gmailPassword && gmailClientId && gmailClientSecret ? "configured" : "not_configured"
  }

  checkSecurityConfiguration(): "configured" | "not_configured" {
    const jwtSecret = process.env.JWT_SECRET
    const allowedApiKeys = process.env.ALLOWED_API_KEYS
    const apiKey = process.env.API_KEY

    return jwtSecret && allowedApiKeys && apiKey ? "configured" : "not_configured"
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = process.hrtime.bigint()

    const [databaseStatus, cacheStatus] = await Promise.all([this.checkDatabase(), this.checkCache()])

    const emailStatus = this.checkEmailConfiguration()
    const securityStatus = this.checkSecurityConfiguration()

    const endTime = process.hrtime.bigint()
    const checkDuration = Number(endTime - startTime) / 1000000 // Convert to milliseconds

    const isHealthy =
      databaseStatus === "connected" &&
      (cacheStatus === "connected" || cacheStatus === "disconnected") &&
      emailStatus === "configured" &&
      securityStatus === "configured"

    const status: HealthStatus = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: databaseStatus,
        cache: cacheStatus,
        email: emailStatus,
        security: securityStatus,
      },
      performance: {
        uptime: `${Math.floor(process.uptime())}s`,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "development",
    }

    logger.info("Health check completed", {
      status: status.status,
      duration: `${checkDuration.toFixed(2)}ms`,
      services: status.services,
    })

    return status
  }

  async startPeriodicHealthChecks(intervalMs = 60000) {
    logger.info("Starting periodic health checks", { interval: `${intervalMs}ms` })

    setInterval(async () => {
      try {
        const health = await this.getHealthStatus()

        if (health.status === "unhealthy") {
          logger.warn("System health check failed", { health })
        } else {
          logger.debug("System health check passed", { health })
        }
      } catch (error) {
        logger.error("Health check error", { error: (error as Error).message })
      }
    }, intervalMs)
  }
}
