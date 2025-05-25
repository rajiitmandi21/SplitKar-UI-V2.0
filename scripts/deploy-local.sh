#!/bin/bash

# SplitKar Local Deployment Script
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_success "Requirements check passed!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Created .env file. Please configure your environment variables."
    fi
    
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        print_warning "Created backend/.env file. Please configure your backend variables."
    fi
    
    if [ ! -f frontend/.env.local ]; then
        cp frontend/.env.local.example frontend/.env.local
        print_warning "Created frontend/.env.local file. Please configure your frontend variables."
    fi
    
    print_success "Environment setup complete!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Building backend..."
    npm run build
    
    print_status "Setting up database..."
    if [ -f "../docker-compose.yml" ]; then
        cd ..
        docker compose up -d postgres
        sleep 5
        cd backend
    fi
    
    print_success "Backend setup complete!"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    print_status "Installing frontend dependencies..."
    npm install
    
    print_status "Building frontend..."
    npm run build
    
    print_success "Frontend setup complete!"
    cd ..
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Services started!"
    echo ""
    echo "🚀 SplitKar is now running:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo "   Health:   http://localhost:5000/health"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop services
    trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT
    wait
}

# Main execution
main() {
    echo "🔧 SplitKar Local Deployment"
    echo "=============================="
    
    check_requirements
    setup_environment
    setup_backend
    setup_frontend
    start_services
}

# Run main function
main "$@"
