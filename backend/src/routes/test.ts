import { Router } from "express"
import { emailService } from "../config/email"
import { logger } from "../utils/logger"
import { db } from "../config/database"

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

// Test database connection
router.get("/db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as current_time, COUNT(*) as user_count FROM users")
    res.json({
      success: true,
      data: result.rows[0],
      message: "Database connection successful"
    })
  } catch (error) {
    logger.error("Database test failed", { error })
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Test user creation
router.post("/create-user", async (req, res) => {
  try {
    const { email, name, upi_id } = req.body
    
    const result = await db.query(
      `INSERT INTO users (email, name, upi_id, password_hash, role, verification_token) 
       VALUES ($1, $2, $3, 'test-hash', 'user', 'test-token') 
       RETURNING *`,
      [email, name, upi_id]
    )
    
    res.json({
      success: true,
      user: result.rows[0],
      message: "Test user created successfully"
    })
  } catch (error) {
    logger.error("Test user creation failed", { error })
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get verification links for development
router.get("/verification-links", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT email, name, verification_token, is_verified, created_at 
       FROM users 
       WHERE verification_token IS NOT NULL AND is_verified = false
       ORDER BY created_at DESC 
       LIMIT 10`
    )
    
    const links = result.rows.map(user => ({
      email: user.email,
      name: user.name,
      verificationLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify?token=${user.verification_token}`,
      created: user.created_at
    }))
    
    res.json({
      success: true,
      message: "Verification links for unverified users",
      links
    })
  } catch (error) {
    logger.error("Failed to get verification links", { error })
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get verification link for specific email
router.get("/verification-link/:email", async (req, res) => {
  try {
    const { email } = req.params
    
    const result = await db.query(
      `SELECT email, name, verification_token, is_verified 
       FROM users 
       WHERE email = $1 AND verification_token IS NOT NULL`,
      [email]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified"
      })
    }
    
    const user = result.rows[0]
    const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify?token=${user.verification_token}`
    
    res.json({
      success: true,
      email: user.email,
      name: user.name,
      isVerified: user.is_verified,
      verificationLink
    })
  } catch (error) {
    logger.error("Failed to get verification link", { error })
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

export default router
