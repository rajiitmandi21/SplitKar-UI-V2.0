#!/bin/bash

echo "🧹 Resetting backend directory..."

# Remove everything in backend except package.json if it exists
cd backend
rm -rf src/ dist/ node_modules/ tsconfig.json

echo "📁 Creating fresh backend structure..."

# Create new src directory
mkdir -p src

# Create the minimal index.ts
cat > src/index.ts << 'EOF'
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
EOF

# Create fresh package.json
cat > package.json << 'EOF'
{
  "name": "splitkar-backend",
  "version": "1.0.0",
  "description": "SplitKar Backend API",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/node": "^20.5.0",
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1"
  }
}
EOF

# Create fresh tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building TypeScript..."
npm run build

echo "✅ Backend reset complete!"
echo "To start the server, run: npm start"
