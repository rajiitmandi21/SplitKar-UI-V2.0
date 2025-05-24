#!/bin/bash

# SplitKar Vercel Deployment Script
echo "🚀 Starting SplitKar Vercel Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Vercel CLI found: $(vercel --version)"

# Login to Vercel
print_status "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_status "Please login to Vercel..."
    vercel login
fi

print_success "Logged in to Vercel as: $(vercel whoami)"

# Deploy Backend
print_status "Deploying backend to Vercel..."
cd backend

# Build backend
print_status "Building backend..."
npm run build

# Deploy backend
print_status "Deploying backend..."
vercel --prod

# Get backend URL
BACKEND_URL=$(vercel ls | grep backend | head -1 | awk '{print $2}')
print_success "Backend deployed to: https://$BACKEND_URL"

# Deploy Frontend
print_status "Deploying frontend to Vercel..."
cd ../frontend

# Update environment variables with backend URL
print_status "Updating frontend environment variables..."
vercel env add NEXT_PUBLIC_API_URL production
echo "Please enter the backend URL: https://$BACKEND_URL"

# Deploy frontend
print_status "Deploying frontend..."
vercel --prod

# Get frontend URL
FRONTEND_URL=$(vercel ls | grep frontend | head -1 | awk '{print $2}')
print_success "Frontend deployed to: https://$FRONTEND_URL"

# Update backend environment with frontend URL
print_status "Updating backend environment variables..."
cd ../backend
vercel env add FRONTEND_URL production
echo "Please enter the frontend URL: https://$FRONTEND_URL"

# Redeploy backend with updated environment
print_status "Redeploying backend with updated environment..."
vercel --prod

print_success "🎉 SplitKar successfully deployed to Vercel!"
echo ""
echo "🌐 Frontend: https://$FRONTEND_URL"
echo "📊 Backend: https://$BACKEND_URL"
echo "📋 API Health: https://$BACKEND_URL/health"
echo "🎭 Demo Page: https://$FRONTEND_URL/demo"
echo ""
echo "Next steps:"
echo "1. Set up your production database (Neon, Supabase, etc.)"
echo "2. Update DATABASE_URL in backend environment variables"
echo "3. Run database migrations on production"
echo "4. Test the deployment with demo accounts"
