import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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
  private readonly SALT_ROUNDS = 12

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
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
