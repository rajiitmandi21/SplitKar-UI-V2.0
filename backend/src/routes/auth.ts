import { Router } from "express"
import { authController } from "../controllers/authController"
import { authenticate } from "../middleware/auth"

const router = Router()

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// Protected routes
router.get("/profile", authenticate, authController.getProfile)
router.put("/profile", authenticate, authController.updateProfile)

export default router
