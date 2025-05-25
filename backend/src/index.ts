import express from "express"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    port: PORT,
  })
})

// Auth routes
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, upi_id } = req.body

  console.log("📧 Registration Email (Development Mode):")
  console.log("To:", email)
  console.log("Subject: Verify your SplitKar account")
  console.log("Content:")
  console.log(`Hi ${name},`)
  console.log("Welcome to SplitKar! Please verify your account.")
  console.log("Verification link: http://localhost:3000/auth/verify?token=mock-token")
  console.log("---")

  res.json({
    success: true,
    message: "Registration successful! Check your email for verification.",
    user: {
      id: "mock-user-id",
      name,
      email,
      verified: false,
    },
  })
})

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  console.log("🔐 Login request received:", {
    email,
    password: password ? "[PROVIDED]" : "[MISSING]",
    headers: req.headers,
    origin: req.headers.origin
  })

  res.json({
    success: true,
    message: "Login successful!",
    token: "mock-jwt-token",
    user: {
      id: "mock-user-id",
      name: "Test User",
      email,
      verified: true,
    },
  })
})

app.post("/api/auth/verify-email", (req, res) => {
  const { token } = req.body

  console.log("📧 Email Verification (Development Mode):")
  console.log("Token:", token)
  console.log("Verification successful!")
  console.log("---")

  res.json({
    success: true,
    message: "Email verified successfully!",
    user: {
      id: "mock-user-id",
      verified: true,
    },
  })
})

app.get("/api/auth/profile", (req, res) => {
  res.json({
    success: true,
    user: {
      id: "mock-user-id",
      name: "Test User",
      email: "test@example.com",
      phone: "+91 9876543210",
      avatar_url: "/placeholder.svg",
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
      upi_id: "test@upi"
    },
    stats: {
      total_groups: 3,
      total_friends: 8,
      total_expenses: 15,
      net_balance: 250.50
    }
  })
})

app.put("/api/auth/profile", (req, res) => {
  const updates = req.body
  
  console.log("📝 Profile Update (Development Mode):")
  console.log("Updates:", updates)
  console.log("---")

  res.json({
    success: true,
    message: "Profile updated successfully!",
    user: {
      id: "mock-user-id",
      name: updates.name || "Test User",
      email: updates.email || "test@example.com",
      phone: updates.phone || "+91 9876543210",
      avatar_url: updates.avatar_url || "/placeholder.svg",
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
      upi_id: updates.upi_id || "test@upi"
    }
  })
})

// Test email endpoint
app.post("/api/test/email", (req, res) => {
  const { email } = req.body

  console.log("📧 Test Email (Development Mode):")
  console.log("To:", email)
  console.log("Subject: Test Email from SplitKar")
  console.log("Content: This is a test email to verify the email service is working.")
  console.log("---")

  res.json({
    success: true,
    message: "Test email sent! Check your backend console for the email content.",
    verificationUrl: "http://localhost:3000/auth/verify?token=test-token",
  })
})

// Start server
app.listen(PORT, () => {
  console.log("🚀 Server started successfully")
  console.log(`Port: ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log("📧 Email service running in development mode (console logging)")
})
