#!/bin/bash

# SplitKar Local Deployment Script
echo "🚀 Starting SplitKar Local Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed locally. Using Docker instead..."
    USE_DOCKER=true
else
    print_success "PostgreSQL found: $(psql --version)"
    USE_DOCKER=false
fi

# Setup Backend
print_status "Setting up backend..."
cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Setup environment variables
if [ ! -f .env ]; then
    print_status "Creating backend .env file..."
    cp .env.example .env
    print_warning "Please edit backend/.env with your database credentials"
fi

# Setup database
if [ "$USE_DOCKER" = true ]; then
    print_status "Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Setup database schema
    print_status "Setting up database schema..."
    docker-compose exec postgres psql -U splitkar_user -d splitkar_db -f /docker-entrypoint-initdb.d/schema.sql
else
    print_status "Setting up local PostgreSQL database..."
    
    # Create database if it doesn't exist
    createdb splitkar_db 2>/dev/null || print_warning "Database already exists"
    
    # Run schema
    psql splitkar_db -f db/schema.sql
fi

# Setup mock data
print_status "Setting up mock data..."
npm run setup-mock

# Build backend
print_status "Building backend..."
npm run build

print_success "Backend setup complete!"

# Setup Frontend
print_status "Setting up frontend..."
cd ../frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Setup environment variables
if [ ! -f .env.local ]; then
    print_status "Creating frontend .env.local file..."
    cp .env.local.example .env.local
    print_warning "Please edit frontend/.env.local with your API URL"
fi

# Build frontend
print_status "Building frontend..."
npm run build

print_success "Frontend setup complete!"

# Start services
print_status "Starting services..."

# Start backend
cd ../backend
print_status "Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend
print_status "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

print_success "🎉 SplitKar is now running!"
echo ""
echo "📊 Backend API: http://localhost:5000"
echo "🌐 Frontend App: http://localhost:3000"
echo "📋 API Health: http://localhost:5000/health"
echo "🎭 Demo Page: http://localhost:3000/demo"
echo ""
echo "Demo Accounts:"
echo "  👨‍💼 john.doe@example.com / password123"
echo "  👩‍💼 jane.smith@example.com / password123"
echo "  👑 sarah.johnson@example.com / admin123"
echo "  🆕 mike.wilson@example.com / password123"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    print_status "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    if [ "$USE_DOCKER" = true ]; then
        cd backend && docker-compose down
    fi
    print_success "All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
