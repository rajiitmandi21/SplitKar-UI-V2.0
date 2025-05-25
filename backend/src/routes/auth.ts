import { Router } from "express"
import { authController } from "../controllers/authController"
import { authenticate } from "../middleware/auth"

const router = Router()

// Public routes
router.post("/register", authController.register.bind(authController))
router.post("/verify-email", authController.verifyEmail.bind(authController))
router.post("/login", authController.login.bind(authController))
router.post("/forgot-password", authController.forgotPassword.bind(authController))
router.post("/reset-password", authController.resetPassword.bind(authController))

// Protected routes
router.get("/profile", authenticate, authController.getProfile.bind(authController))
router.put("/profile", authenticate, authController.updateProfile.bind(authController))

export default router
