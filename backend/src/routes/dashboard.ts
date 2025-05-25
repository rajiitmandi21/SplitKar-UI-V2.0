import { Router } from "express"
import { dashboardController } from "../controllers/dashboardController"
import { authenticate } from "../middleware/auth"

const router = Router()

// Get dashboard data (requires authentication)
router.get("/", authenticate, dashboardController.getDashboardData)

export default router 