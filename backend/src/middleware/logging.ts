import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

// Enhanced request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  // Add request ID to request object for tracking
  ;(req as any).requestId = requestId

  // Log incoming request
  logger.info("Incoming request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip: req.ip || req.connection.remoteAddress,
    contentType: req.headers["content-type"],
    contentLength: req.headers["content-length"],
  })

  // Override res.json to log response data
  const originalJson = res.json
  res.json = function (body: any) {
    const duration = Date.now() - start

    logger.info("Request completed", {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(body).length,
    })

    // Log slow requests
    if (duration > 1000) {
      logger.warn("Slow request detected", {
        requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
      })
    }

    return originalJson.call(this, body)
  }

  next()
}

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId

  logger.error("Request error", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  })

  next(err)
}

// Performance monitoring middleware
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint()

  res.on("finish", () => {
    const end = process.hrtime.bigint()
    const duration = Number(end - start) / 1000000 // Convert to milliseconds

    // Log performance metrics
    logger.debug("Performance metrics", {
      requestId: (req as any).requestId,
      method: req.method,
      url: req.originalUrl,
      duration: `${duration.toFixed(2)}ms`,
      statusCode: res.statusCode,
      memoryUsage: process.memoryUsage(),
    })
  })

  next()
}

// Security logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId

  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
  ]

  const url = req.originalUrl
  const body = JSON.stringify(req.body)
  const query = JSON.stringify(req.query)

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(body) || pattern.test(query)) {
      logger.warn("Suspicious request detected", {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        pattern: pattern.toString(),
      })
      break
    }
  }

  next()
}
