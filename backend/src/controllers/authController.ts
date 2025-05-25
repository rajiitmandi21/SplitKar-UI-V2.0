import type { Request, Response } from "express"
import { userModel } from "../models/User"
import { authService } from "../config/auth"
import { emailService } from "../config/email"
import { logger } from "../utils/logger"

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const { email, name, password, phone, upi_id } = req.body

      logger.info("📝 User registration attempt", {
        requestId,
        email: email?.substring(0, 3) + "***", // Mask email for privacy
        name,
        hasPhone: !!phone,
        hasUpiId: !!upi_id,
      })

      // Validation
      if (!email || !name || !password || !upi_id) {
        logger.warn("❌ Registration validation failed - missing required fields", {
          requestId,
          missingFields: {
            email: !email,
            name: !name,
            password: !password,
            upi_id: !upi_id,
          },
        })

        res.status(400).json({
          error: "Validation Error",
          message: "Email, name, password, and UPI ID are required",
        })
        return
      }

      if (password.length < 6) {
        logger.warn("❌ Registration validation failed - password too short", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Password must be at least 6 characters long",
        })
        return
      }

      // Validate UPI ID format (basic validation)
      const upiRegex = /^[\w.-]+@[\w.-]+$/
      if (!upiRegex.test(upi_id)) {
        logger.warn("❌ Registration validation failed - invalid UPI ID format", {
          requestId,
          upiId: upi_id?.substring(0, 3) + "***",
        })

        res.status(400).json({
          error: "Validation Error",
          message: "Please enter a valid UPI ID (e.g., username@paytm)",
        })
        return
      }

      // Create user
      const user = await userModel.create({ email, name, password, phone, upi_id })

      logger.info("✅ User created successfully", {
        requestId,
        userId: user.id,
        email: email.substring(0, 3) + "***",
      })

      // Send verification email
      await emailService.sendVerificationEmail(user.email, user.name, user.verification_token!)

      logger.info("📧 Verification email sent", { requestId, userId: user.id })

      res.status(201).json({
        message: "User registered successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          upi_id: user.upi_id,
          role: user.role,
          is_verified: user.is_verified,
        },
      })
    } catch (error) {
      logger.error("❌ Registration error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      if (error instanceof Error) {
        if (error.message.includes("already exists") || error.message.includes("already registered")) {
          res.status(409).json({
            error: "Conflict",
            message: error.message,
          })
          return
        }
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Registration failed",
      })
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const { token } = req.body

      logger.info("📧 Email verification attempt", {
        requestId,
        token: token?.substring(0, 3) + "***",
      })

      if (!token) {
        logger.warn("❌ Email verification validation failed - missing token", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Verification token is required",
        })
        return
      }

      const user = await userModel.verifyEmail(token)

      if (!user) {
        logger.warn("❌ Email verification failed - invalid or expired token", {
          requestId,
          token: token.substring(0, 3) + "***",
        })
        res.status(400).json({
          error: "Invalid Token",
          message: "Invalid or expired verification token",
        })
        return
      }

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.name)
      logger.info("📧 Welcome email sent", { requestId, userId: user.id })

      // Generate JWT token for immediate login
      const authToken = authService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      logger.info("✅ Email verified successfully", {
        requestId,
        userId: user.id,
        role: user.role,
      })

      res.json({
        message: "Email verified successfully! Welcome to SplitKar!",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          upi_id: user.upi_id,
          role: user.role,
          is_verified: user.is_verified,
        },
        token: authToken,
      })
    } catch (error) {
      logger.error("❌ Email verification error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      res.status(500).json({
        error: "Internal Server Error",
        message: "Email verification failed",
      })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const { email, password } = req.body

      logger.info("🔐 Login attempt", {
        requestId,
        email: email?.substring(0, 3) + "***",
        userAgent: req.headers["user-agent"]?.substring(0, 50),
      })

      // Validation
      if (!email || !password) {
        logger.warn("❌ Login validation failed - missing credentials", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Email and password are required",
        })
        return
      }

      // Find user
      const user = await userModel.findByEmail(email)
      if (!user) {
        logger.warn("❌ Login failed - user not found", {
          requestId,
          email: email.substring(0, 3) + "***",
        })

        res.status(401).json({
          error: "Authentication Failed",
          message: "Invalid email or password",
        })
        return
      }

      // Check if email is verified
      if (!user.is_verified) {
        logger.warn("❌ Login failed - email not verified", {
          requestId,
          userId: user.id,
        })

        res.status(401).json({
          error: "Email Not Verified",
          message: "Please verify your email before logging in",
        })
        return
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, user.password_hash)
      if (!isValidPassword) {
        logger.warn("❌ Login failed - invalid password", {
          requestId,
          userId: user.id,
        })

        res.status(401).json({
          error: "Authentication Failed",
          message: "Invalid email or password",
        })
        return
      }

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      logger.info("✅ Login successful", {
        requestId,
        userId: user.id,
        role: user.role,
      })

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          upi_id: user.upi_id,
          role: user.role,
          is_verified: user.is_verified,
        },
        token,
      })
    } catch (error) {
      logger.error("❌ Login error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      res.status(500).json({
        error: "Internal Server Error",
        message: "Login failed",
      })
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const { email } = req.body

      logger.info("🔑 Password reset request", {
        requestId,
        email: email?.substring(0, 3) + "***",
      })

      if (!email) {
        logger.warn("❌ Password reset validation failed - missing email", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Email is required",
        })
        return
      }

      const user = await userModel.findByEmail(email)
      if (!user) {
        // Don't reveal if email exists or not for security
        logger.info("🔑 Password reset link sent (if email exists)", { requestId })
        res.json({
          message: "If an account with that email exists, we've sent a password reset link.",
        })
        return
      }

      if (!user.is_verified) {
        logger.warn("❌ Password reset failed - email not verified", {
          requestId,
          userId: user.id,
        })
        res.status(400).json({
          error: "Email Not Verified",
          message: "Please verify your email first",
        })
        return
      }

      const resetToken = await userModel.generatePasswordResetToken(email)
      if (resetToken) {
        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken)
        logger.info("🔑 Password reset email sent", { requestId, userId: user.id })
      }

      res.json({
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    } catch (error) {
      logger.error("❌ Forgot password error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to process password reset request",
      })
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const { token, password } = req.body

      logger.info("🔑 Password reset attempt", {
        requestId,
        token: token?.substring(0, 3) + "***",
        hasPassword: !!password,
      })

      if (!token || !password) {
        logger.warn("❌ Password reset validation failed - missing token or password", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Token and new password are required",
        })
        return
      }

      if (password.length < 6) {
        logger.warn("❌ Password reset validation failed - password too short", { requestId })
        res.status(400).json({
          error: "Validation Error",
          message: "Password must be at least 6 characters long",
        })
        return
      }

      const success = await userModel.resetPassword(token, password)

      if (!success) {
        logger.warn("❌ Password reset failed - invalid or expired token", {
          requestId,
          token: token.substring(0, 3) + "***",
        })
        res.status(400).json({
          error: "Invalid Token",
          message: "Invalid or expired reset token",
        })
        return
      }

      logger.info("✅ Password reset successful", { requestId })

      res.json({
        message: "Password reset successfully. You can now login with your new password.",
      })
    } catch (error) {
      logger.error("❌ Reset password error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      res.status(500).json({
        error: "Internal Server Error",
        message: "Password reset failed",
      })
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const userId = (req as any).user?.userId

      logger.info("🔍 Profile retrieval attempt", { requestId, userId })

      const user = await userModel.findById(userId)
      if (!user) {
        logger.warn("❌ Profile retrieval failed - user not found", { requestId })
        res.status(404).json({
          error: "Not Found",
          message: "User not found",
        })
        return
      }

      const stats = await userModel.getStats(userId)

      logger.info("🔍 Profile retrieved successfully", { requestId, userId })

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          upi_id: user.upi_id,
          avatar_url: user.avatar_url,
          role: user.role,
          is_verified: user.is_verified,
          created_at: user.created_at,
        },
        stats,
      })
    } catch (error) {
      logger.error("❌ Get profile error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch profile",
      })
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const requestId = Math.random().toString(36).substring(7)

    try {
      const userId = (req as any).user?.userId
      const updates = req.body

      logger.info("📝 Profile update attempt", { requestId, userId, updates })

      const user = await userModel.update(userId, updates)

      logger.info("📝 Profile updated successfully", { requestId, userId })

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          upi_id: user.upi_id,
          avatar_url: user.avatar_url,
          role: user.role,
          is_verified: user.is_verified,
        },
      })
    } catch (error) {
      logger.error("❌ Update profile error", {
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      if (error instanceof Error) {
        if (error.message.includes("No valid fields") || error.message.includes("already registered")) {
          logger.warn("❌ Profile update validation failed", { requestId })
          res.status(400).json({
            error: "Validation Error",
            message: error.message,
          })
          return
        }
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update profile",
      })
    }
  }
}

export const authController = new AuthController()
