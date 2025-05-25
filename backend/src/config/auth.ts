import jwt from "jsonwebtoken"
import crypto from "crypto"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

  // Simple hash function using Node's crypto module instead of bcrypt
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
    return `${salt}:${hash}`
  }

  // Compare password with hash
  async comparePassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(":")
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
    return hash === calculatedHash
  }

  generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload
    } catch (error) {
      throw new Error("Invalid or expired token")
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or invalid")
    }
    return authHeader.substring(7)
  }
}

export const authService = new AuthService()
