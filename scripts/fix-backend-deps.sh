#!/bin/bash

echo "🔧 Fixing backend dependencies..."

# Navigate to backend directory
cd backend || { echo "❌ Backend directory not found"; exit 1; }

# Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install --save bcryptjs googleapis winston-daily-rotate-file

# Install types
echo "📦 Installing TypeScript type definitions..."
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/nodemailer

echo "✅ Dependencies fixed successfully!"
echo "🚀 Now run: cd backend && npm run build && npm start"
