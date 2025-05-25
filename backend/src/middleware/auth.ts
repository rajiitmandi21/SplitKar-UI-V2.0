import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    userId: string
    email: string
    role: string
  }
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = {
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    }
    next()
  } catch (error) {
    logger.error("Token verification failed:", error)
    res.status(401).json({ error: "Invalid token" })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" })
      return
    }

    next()
  }
}

// Alias for backward compatibility
export const authenticateToken = authenticate
