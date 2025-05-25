import { Router } from "express"
import { emailService } from "../config/email"
import { logger } from "../utils/logger"

const router = Router()

// Test email endpoint
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // Test the email service
    const testToken = "test-token-" + Date.now()
    await emailService.sendVerificationEmail(email, "Test User", testToken)

    res.json({
      success: true,
      message: "Test email sent successfully! Check your inbox.",
      verificationUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify?token=${testToken}`,
    })
  } catch (error) {
    logger.error("Test email failed:", error)
    res.status(500).json({
      success: false,
      error: "Failed to send test email",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// Health check for email service
router.get("/email-health", async (req, res) => {
  try {
    const isHealthy = await emailService.testConnection()
    res.json({
      success: true,
      emailServiceHealthy: isHealthy,
      environment: process.env.NODE_ENV,
      hasOAuth2Credentials: !!(
        process.env.GMAIL_USER &&
        process.env.GMAIL_CLIENT_ID &&
        process.env.GMAIL_CLIENT_SECRET &&
        process.env.GMAIL_REFRESH_TOKEN
      ),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Email service health check failed",
    })
  }
})

export default router
