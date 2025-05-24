import type { Request, Response, NextFunction } from "express"
import { authService, type JWTPayload } from "../config/auth"

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = authService.extractTokenFromHeader(req.headers.authorization)
    const payload = authService.verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: error instanceof Error ? error.message : "Authentication failed",
    })
  }
}

export const authorize = (roles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "User not authenticated" })
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" })
    }

    next()
  }
}

export const validateOwnership = (resourceUserIdField = "userId") => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]

    if (req.user.role !== "admin" && req.user.userId !== resourceUserId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only access your own resources",
      })
    }

    next()
  }
}
