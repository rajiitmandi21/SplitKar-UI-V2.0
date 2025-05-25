# SplitKar Deployment Guide

## 🚀 Production Deployment Checklist

This guide provides step-by-step instructions for deploying SplitKar to production using Vercel.

## ✅ Pre-Deployment Checklist

### Environment Variables Configured ✓
All required environment variables have been set up in the Vercel project:

#### Backend Environment Variables
- `DATABASE_URL` - PostgreSQL connection string ✓
- `JWT_SECRET` - JWT signing secret ✓
- `JWT_EXPIRES_IN` - Token expiration time ✓
- `FRONTEND_URL` - Frontend application URL ✓
- `PORT` - Server port configuration ✓
- `REDIS_URL` - Redis cache connection string ✓
- `CUSTOM_KEY` - Custom configuration key ✓

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API endpoint ✓
- `NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND` - Mock data toggle ✓

#### Email Configuration
- `GMAIL_USER` - Email service user ✓
- `GMAIL_APP_PASSWORD` - Email service password ✓
- `GMAIL_CLIENT_ID` - OAuth client ID ✓
- `GMAIL_CLIENT_SECRET` - OAuth client secret ✓
- `GMAIL_REFRESH_TOKEN` - OAuth refresh token ✓

#### Security & API Configuration
- `ALLOWED_API_KEYS` - Authorized API keys ✓
- `API_RATE_LIMIT_WINDOW` - Rate limiting window ✓
- `API_RATE_LIMIT_MAX` - Rate limiting maximum ✓
- `API_KEY` - General API key ✓

#### Logging Configuration
- `LOG_LEVEL` - Application log level ✓
- `LOG_FORMAT` - Log output format ✓
- `LOG_FILE_ENABLED` - File logging toggle ✓
- `NEXT_PUBLIC_LOG_LEVEL` - Frontend log level ✓

## 🏗️ Infrastructure Setup

### Database Setup
\`\`\`sql
-- Production database initialization
-- Run these commands on your PostgreSQL instance

-- Create database
CREATE DATABASE splitkar_prod;

-- Create user with appropriate permissions
CREATE USER splitkar_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE splitkar_prod TO splitkar_user;

-- Connect to the database and run migrations
\c splitkar_prod;

-- Run migration files in order
-- (These will be handled automatically by the migration runner)
\`\`\`

### Redis Cache Setup
\`\`\`bash
# Redis configuration for caching
# Ensure Redis instance is accessible via REDIS_URL

# Test Redis connection
redis-cli -u $REDIS_URL ping
# Should return: PONG
\`\`\`

## 🔧 Deployment Configuration

### Vercel Configuration
\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
\`\`\`

### Build Scripts
\`\`\`json
{
  "scripts": {
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start": "npm run start:backend",
    "start:backend": "cd backend && npm start",
    "deploy": "vercel --prod",
    "migrate": "cd backend && npm run migrate"
  }
}
\`\`\`

## 📊 Performance Optimization

### Backend Optimizations
\`\`\`typescript
// Redis caching implementation
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache frequently accessed data
export async function getCachedGroups(userId: number) {
  const cacheKey = `user:${userId}:groups`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const groups = await GroupService.findByUserId(userId);
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(groups));
  
  return groups;
}

// Database connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

### Frontend Optimizations
\`\`\`typescript
// Next.js configuration for production
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['splitkar-assets.vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
\`\`\`

## 🔒 Security Configuration

### SSL/TLS Setup
\`\`\`bash
# Vercel automatically provides SSL certificates
# Ensure HTTPS redirect is enabled

# Custom domain configuration
vercel domains add splitkar.com
vercel domains add www.splitkar.com
\`\`\`

### Security Headers
\`\`\`typescript
// Security middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
\`\`\`

## 📈 Monitoring Setup

### Error Tracking
\`\`\`typescript
// Sentry configuration for error tracking
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
\`\`\`

### Health Checks
\`\`\`typescript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        cache: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
\`\`\`

## 🚀 Deployment Steps

### 1. Pre-deployment Testing
\`\`\`bash
# Run full test suite
npm run test:all

# Run security audit
npm audit

# Check build process
npm run build

# Verify environment variables
npm run verify-env
\`\`\`

### 2. Database Migration
\`\`\`bash
# Run database migrations
npm run migrate:prod

# Verify migration success
npm run migrate:status
\`\`\`

### 3. Deploy to Vercel
\`\`\`bash
# Deploy to production
vercel --prod

# Verify deployment
curl -f https://splitkar.vercel.app/api/health
\`\`\`

### 4. Post-deployment Verification
\`\`\`bash
# Test critical user flows
npm run test:e2e:prod

# Monitor error rates
# Check application logs
# Verify performance metrics
\`\`\`

## 📊 Performance Benchmarks

### Target Metrics
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms (95th percentile)
- **Database Query Time**: < 100ms (average)
- **Cache Hit Rate**: > 80%
- **Uptime**: 99.9%

### Monitoring Commands
\`\`\`bash
# Check API performance
curl -w "@curl-format.txt" -o /dev/null -s https://splitkar.vercel.app/api/groups

# Monitor database performance
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Check Redis performance
redis-cli -u $REDIS_URL --latency-history
\`\`\`

## 🔄 Rollback Procedures

### Quick Rollback
\`\`\`bash
# Rollback to previous deployment
vercel rollback

# Verify rollback success
curl -f https://splitkar.vercel.app/api/health
\`\`\`

### Database Rollback
\`\`\`bash
# Rollback database migration (if needed)
npm run migrate:rollback

# Restore from backup (if needed)
pg_restore -d $DATABASE_URL backup.sql
\`\`\`

## 📞 Support & Maintenance

### Monitoring Alerts
- **Error Rate**: > 1% triggers alert
- **Response Time**: > 500ms triggers warning
- **Database Connections**: > 80% triggers alert
- **Memory Usage**: > 90% triggers alert

### Maintenance Schedule
- **Daily**: Automated backups and health checks
- **Weekly**: Performance review and optimization
- **Monthly**: Security updates and dependency updates
- **Quarterly**: Full system audit and capacity planning

## 🎯 Success Criteria

### Deployment Success Indicators
- ✅ All health checks passing
- ✅ Error rate < 0.1%
- ✅ Response times within targets
- ✅ All critical user flows working
- ✅ Monitoring and alerts active

### Post-Deployment Monitoring
- Monitor user registration and login flows
- Track expense creation and settlement processes
- Verify email notifications are working
- Check group creation and member invitation flows
- Monitor API rate limiting and security measures

---

## 🎉 Deployment Complete!

Your SplitKar application is now ready for production use with:

- ✅ Comprehensive backend API with PostgreSQL database
- ✅ Modern Next.js frontend with responsive design
- ✅ Redis caching for optimal performance
- ✅ Complete authentication and security system
- ✅ Email notifications and user management
- ✅ Monitoring and error tracking
- ✅ Scalable architecture on Vercel platform

The application is fully documented, tested, and ready to handle real users and their expense splitting needs!
