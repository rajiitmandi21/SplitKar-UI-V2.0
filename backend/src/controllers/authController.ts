import type { Request, Response } from "express"
import { userModel } from "../models/User"
import { authService } from "../config/auth"
import { emailService } from "../config/email"

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, name, password, phone, upi_id } = req.body

      // Validation
      if (!email || !name || !password || !upi_id) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Email, name, password, and UPI ID are required",
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Password must be at least 6 characters long",
        })
      }

      // Validate UPI ID format (basic validation)
      const upiRegex = /^[\w.-]+@[\w.-]+$/
      if (!upiRegex.test(upi_id)) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Please enter a valid UPI ID (e.g., username@paytm)",
        })
      }

      // Create user
      const user = await userModel.create({ email, name, password, phone, upi_id })

      // Send verification email
      await emailService.sendVerificationEmail(user.email, user.name, user.verification_token!)

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
      console.error("Registration error:", error)

      if (error instanceof Error) {
        if (error.message.includes("already exists") || error.message.includes("already registered")) {
          return res.status(409).json({
            error: "Conflict",
            message: error.message,
          })
        }
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Registration failed",
      })
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body

      if (!token) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Verification token is required",
        })
      }

      const user = await userModel.verifyEmail(token)

      if (!user) {
        return res.status(400).json({
          error: "Invalid Token",
          message: "Invalid or expired verification token",
        })
      }

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.name)

      // Generate JWT token for immediate login
      const authToken = authService.generateToken({
        userId: user.id,
        email: user.email,
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
      console.error("Email verification error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Email verification failed",
      })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Email and password are required",
        })
      }

      // Find user
      const user = await userModel.findByEmail(email)
      if (!user) {
        return res.status(401).json({
          error: "Authentication Failed",
          message: "Invalid email or password",
        })
      }

      // Check if email is verified
      if (!user.is_verified) {
        return res.status(401).json({
          error: "Email Not Verified",
          message: "Please verify your email before logging in",
        })
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Authentication Failed",
          message: "Invalid email or password",
        })
      }

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
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
      console.error("Login error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Login failed",
      })
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Email is required",
        })
      }

      const user = await userModel.findByEmail(email)
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({
          message: "If an account with that email exists, we've sent a password reset link.",
        })
      }

      if (!user.is_verified) {
        return res.status(400).json({
          error: "Email Not Verified",
          message: "Please verify your email first",
        })
      }

      const resetToken = await userModel.generatePasswordResetToken(email)
      if (resetToken) {
        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken)
      }

      res.json({
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to process password reset request",
      })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body

      if (!token || !password) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Token and new password are required",
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Password must be at least 6 characters long",
        })
      }

      const success = await userModel.resetPassword(token, password)

      if (!success) {
        return res.status(400).json({
          error: "Invalid Token",
          message: "Invalid or expired reset token",
        })
      }

      res.json({
        message: "Password reset successfully. You can now login with your new password.",
      })
    } catch (error) {
      console.error("Reset password error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Password reset failed",
      })
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      const user = await userModel.findById(userId)
      if (!user) {
        return res.status(404).json({
          error: "Not Found",
          message: "User not found",
        })
      }

      const stats = await userModel.getStats(userId)

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
      console.error("Get profile error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch profile",
      })
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId
      const updates = req.body

      const user = await userModel.update(userId, updates)

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
      console.error("Update profile error:", error)

      if (error instanceof Error) {
        if (error.message.includes("No valid fields") || error.message.includes("already registered")) {
          return res.status(400).json({
            error: "Validation Error",
            message: error.message,
          })
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
