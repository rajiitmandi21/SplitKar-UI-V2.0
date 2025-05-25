# SplitKar Deployment Guide

This guide covers deploying SplitKar both locally and to Vercel, with separate frontend and backend deployments.

## 🏠 Local Development Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Git

### Quick Start (Automated)
\`\`\`bash
# Make script executable
chmod +x scripts/deploy-local.sh

# Run deployment script
./scripts/deploy-local.sh
\`\`\`

### Manual Setup

#### Backend Setup
\`\`\`bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database (PostgreSQL)
createdb splitkar_db
npm run setup-db

# Setup mock data
npm run setup-mock

# Start development server
npm run dev
\`\`\`

#### Frontend Setup
\`\`\`bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with API URL (http://localhost:5000)

# Start development server
npm run dev
\`\`\`

### Using Docker (Alternative)
\`\`\`bash
cd backend

# Start with Docker Compose
docker compose up -d

# This will start:
# - PostgreSQL database on port 5432
# - Backend API on port 5000
\`\`\`

## ☁️ Vercel Production Deployment

### Prerequisites
- Vercel account
- Vercel CLI installed (`npm install -g vercel`)
- Production database (Neon, Supabase, Railway, etc.)

### Quick Start (Automated)
\`\`\`bash
# Make script executable
chmod +x scripts/deploy-vercel.sh

# Run deployment script
./scripts/deploy-vercel.sh
\`\`\`

### Manual Deployment

#### 1. Deploy Backend
\`\`\`bash
cd backend

# Login to Vercel
vercel login

# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add FRONTEND_URL production

# Redeploy with environment variables
vercel --prod
\`\`\`

#### 2. Deploy Frontend
\`\`\`bash
cd frontend

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND production

# Redeploy with environment variables
vercel --prod
\`\`\`

## 🗄️ Database Setup

### Local Development
\`\`\`bash
# PostgreSQL
createdb splitkar_db
psql splitkar_db -f backend/db/schema.sql

# Or with Docker
docker compose up -d postgres
\`\`\`

### Production Options

#### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new database
3. Copy connection string
4. Add to Vercel environment variables

#### Option 2: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

#### Option 3: Railway
1. Create account at [railway.app](https://railway.app)
2. Deploy PostgreSQL service
3. Copy connection string
4. Add to Vercel environment variables

## 🔧 Environment Variables

### Backend (.env)
\`\`\`env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/splitkar_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PORT=5000
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=false
\`\`\`

### Production Environment Variables

#### Backend (Vercel)
- `DATABASE_URL` - Production database connection string
- `JWT_SECRET` - Strong, unique secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time (e.g., "7d")
- `FRONTEND_URL` - Production frontend URL
- `NODE_ENV` - Set to "production"

#### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` - Production backend URL
- `NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND` - Set to "false" for production

## 🧪 Testing Deployment

### Local Testing
\`\`\`bash
# Test backend health
curl http://localhost:5000/health

# Test frontend
open http://localhost:3000

# Test demo accounts
open http://localhost:3000/demo
\`\`\`

### Production Testing
\`\`\`bash
# Test backend health
curl https://your-backend.vercel.app/health

# Test frontend
open https://your-frontend.vercel.app

# Test demo accounts
open https://your-frontend.vercel.app/demo
\`\`\`

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] Mock data created (for testing)
- [ ] Tests passing
- [ ] Build successful

### Post-deployment
- [ ] Health check endpoints responding
- [ ] Authentication working
- [ ] Database connections successful
- [ ] Demo accounts accessible
- [ ] CORS configured correctly

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues
- **Database connection failed**: Check DATABASE_URL format
- **JWT errors**: Ensure JWT_SECRET is set and consistent
- **CORS errors**: Verify FRONTEND_URL is correct

#### Frontend Issues
- **API calls failing**: Check NEXT_PUBLIC_API_URL
- **Mock data not loading**: Verify NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND setting
- **Build errors**: Ensure all dependencies installed

#### Vercel Issues
- **Environment variables not working**: Redeploy after setting variables
- **Function timeout**: Optimize database queries
- **Build failures**: Check Node.js version compatibility

### Logs and Debugging
\`\`\`bash
# Vercel function logs
vercel logs

# Local backend logs
npm run dev (in backend directory)

# Local frontend logs
npm run dev (in frontend directory)
\`\`\`

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Database: Connection status in health endpoint
- Frontend: Page load and API connectivity

### Performance
- Monitor API response times
- Check database query performance
- Monitor Vercel function execution times

## 🔄 Updates and Maintenance

### Updating Code
\`\`\`bash
# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Redeploy
vercel --prod
\`\`\`

### Database Migrations
\`\`\`bash
# Run migrations locally first
npm run migrate

# Apply to production database
# (Connect to production DB and run migrations)
\`\`\`

This deployment guide ensures you can run SplitKar both locally for development and in production on Vercel with proper separation of frontend and backend services.
