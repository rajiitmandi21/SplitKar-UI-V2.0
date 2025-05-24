#!/bin/bash

# SplitKar Environment Setup Script
echo "🔧 Setting up SplitKar environment variables..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Create main .env file
if [ ! -f .env ]; then
    print_status "Creating main .env file..."
    cp .env.example .env
    print_warning "Please edit .env with your actual values"
else
    print_success "Main .env file already exists"
fi

# Create backend .env file
if [ ! -f backend/.env ]; then
    print_status "Creating backend .env file..."
    cp backend/.env.example backend/.env
    print_warning "Please edit backend/.env with your actual values"
else
    print_success "Backend .env file already exists"
fi

# Create frontend .env.local file
if [ ! -f frontend/.env.local ]; then
    print_status "Creating frontend .env.local file..."
    cp frontend/.env.local.example frontend/.env.local
    print_warning "Please edit frontend/.env.local with your actual values"
else
    print_success "Frontend .env.local file already exists"
fi

print_success "Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your database and Google Service Account credentials"
echo "2. Edit backend/.env if you need backend-specific overrides"
echo "3. Edit frontend/.env.local if you need frontend-specific overrides"
echo "4. Run 'docker-compose up' to start all services"
echo ""
echo "🔑 Required credentials:"
echo "- PostgreSQL database URL"
echo "- Google Service Account JSON credentials"
echo "- Gmail app password (optional fallback)"
