import type { Request, Response, NextFunction } from "express"
import rateLimit from "express-rate-limit"

export interface ApiKeyRequest extends Request {
  apiKey?: string
}

// API Key validation middleware
export const validateApiKey = (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string
  const allowedKeys = process.env.ALLOWED_API_KEYS?.split(",") || []

  if (!apiKey) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "API key is required. Please provide X-API-Key header.",
    })
  }

  if (!allowedKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Invalid API key provided.",
    })
  }

  req.apiKey = apiKey
  next()
}

// Rate limiting per API key
export const createApiKeyRateLimit = () => {
  const windowMs = Number.parseInt(process.env.API_RATE_LIMIT_WINDOW || "900000") // 15 minutes
  const max = Number.parseInt(process.env.API_RATE_LIMIT_MAX || "100") // 100 requests

  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: ApiKeyRequest) => {
      return req.apiKey || req.ip
    },
    message: {
      error: "Too Many Requests",
      message: `Rate limit exceeded. Maximum ${max} requests per ${windowMs / 60000} minutes.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// Logging middleware for API key usage
export const logApiKeyUsage = (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.originalUrl
  const apiKey = req.apiKey ? `${req.apiKey.substring(0, 8)}...` : "none"
  const userAgent = req.headers["user-agent"] || "unknown"

  console.log(`[${timestamp}] ${method} ${url} - API Key: ${apiKey} - User Agent: ${userAgent}`)
  next()
}
