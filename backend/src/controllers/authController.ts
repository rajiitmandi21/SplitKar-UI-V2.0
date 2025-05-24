import type { Request, Response } from "express"
import { userModel } from "../models/User"
import { authService } from "../config/auth"

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, name, password, phone } = req.body

      // Validation
      if (!email || !name || !password) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Email, name, and password are required",
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Password must be at least 6 characters long",
        })
      }

      // Create user
      const user = await userModel.create({ email, name, password, phone })

      // Generate token
      const token = authService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)

      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({
          error: "Conflict",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Registration failed",
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
          role: user.role,
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
          avatar_url: user.avatar_url,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Update profile error:", error)

      if (error instanceof Error && error.message.includes("No valid fields")) {
        return res.status(400).json({
          error: "Validation Error",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update profile",
      })
    }
  }
}

export const authController = new AuthController()
