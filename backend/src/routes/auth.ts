import { Router } from "express"
import { authController } from "../controllers/authController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/verify-email", authController.verifyEmail)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile)
router.put("/profile", authenticateToken, authController.updateProfile)

// Health check route
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "auth",
  })
})

export default router
