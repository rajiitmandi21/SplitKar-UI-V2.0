# SplitKar Backend Documentation

## 🏗️ Architecture Overview

The SplitKar backend is built using Node.js with Express.js framework, PostgreSQL database, and follows RESTful API principles with JWT-based authentication.

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator
- **Logging**: Custom logger utility

## 📊 Database Schema

### Core Tables

#### Users Table
\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    upi_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Groups Table
\`\`\`sql
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Group Members Table
\`\`\`sql
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);
\`\`\`

#### Expenses Table
\`\`\`sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Expense Splits Table
\`\`\`sql
CREATE TABLE expense_splits (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    is_settled BOOLEAN DEFAULT FALSE,
    settled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Settlements Table
\`\`\`sql
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    settled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Friendships Table
\`\`\`sql
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    friend_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);
\`\`\`

## 🔐 Authentication & Authorization

### JWT Token Structure
\`\`\`typescript
interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
\`\`\`

### Authentication Flow
1. **Registration**: User provides email, password, name
2. **Email Verification**: Verification token sent via email
3. **Login**: Credentials validated, JWT token issued
4. **Token Validation**: Middleware validates JWT on protected routes
5. **Token Refresh**: Automatic token refresh on valid requests

### Authorization Levels
- **Public**: Registration, login, password reset
- **Authenticated**: All logged-in users
- **Group Member**: Access to specific group data
- **Group Admin**: Manage group settings and members
- **Group Creator**: Full group control including deletion
- **System Admin**: Platform administration

## 🛣️ API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890",
  "upi_id": "john@paytm"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_verified": false
  }
}
\`\`\`

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
\`\`\`

#### GET /api/auth/profile
Get current user profile (Protected).

**Headers:**
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "upi_id": "john@paytm",
    "is_verified": true,
    "role": "user"
  }
}
\`\`\`

### Group Routes (`/api/groups`)

#### POST /api/groups
Create a new group (Protected).

**Request Body:**
\`\`\`json
{
  "name": "Weekend Trip",
  "description": "Expenses for our weekend getaway"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "group": {
    "id": 1,
    "name": "Weekend Trip",
    "description": "Expenses for our weekend getaway",
    "created_by": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

#### GET /api/groups
Get user's groups (Protected).

**Response:**
\`\`\`json
{
  "success": true,
  "groups": [
    {
      "id": 1,
      "name": "Weekend Trip",
      "description": "Expenses for our weekend getaway",
      "role": "creator",
      "member_count": 4,
      "total_expenses": 1250.50,
      "your_balance": -125.25
    }
  ]
}
\`\`\`

#### GET /api/groups/:id
Get group details (Protected, Members Only).

**Response:**
\`\`\`json
{
  "success": true,
  "group": {
    "id": 1,
    "name": "Weekend Trip",
    "description": "Expenses for our weekend getaway",
    "created_by": 1,
    "members": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "creator",
        "balance": -125.25
      }
    ],
    "recent_expenses": [
      {
        "id": 1,
        "title": "Hotel Booking",
        "amount": 500.00,
        "created_by": "John Doe",
        "date": "2024-01-15"
      }
    ]
  }
}
\`\`\`

### Expense Routes (`/api/expenses`)

#### POST /api/expenses
Create a new expense (Protected).

**Request Body:**
\`\`\`json
{
  "group_id": 1,
  "title": "Dinner at Restaurant",
  "description": "Group dinner on Saturday",
  "amount": 120.50,
  "category": "food",
  "date": "2024-01-15",
  "splits": [
    {
      "user_id": 1,
      "amount": 30.125
    },
    {
      "user_id": 2,
      "amount": 30.125
    }
  ]
}
\`\`\`

#### GET /api/expenses
Get user's expenses (Protected).

**Query Parameters:**
- `group_id`: Filter by group
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset

### Settlement Routes (`/api/settlements`)

#### POST /api/settlements
Create a settlement (Protected).

**Request Body:**
\`\`\`json
{
  "to_user_id": 2,
  "group_id": 1,
  "amount": 50.00,
  "transaction_id": "UPI123456789"
}
\`\`\`

#### PUT /api/settlements/:id/confirm
Confirm a settlement (Protected).

## 🔒 Security Features

### Input Validation
- **Email Validation**: RFC 5322 compliant
- **Password Strength**: Minimum 8 characters, mixed case, numbers
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based validation

### Rate Limiting
- **Authentication**: 5 attempts per 15 minutes
- **API Calls**: 100 requests per 15 minutes per IP
- **Password Reset**: 3 attempts per hour

### Data Protection
- **Password Hashing**: bcrypt with 12 salt rounds
- **Sensitive Data**: Never returned in API responses
- **Database Encryption**: Connection encryption enforced
- **Token Security**: Short-lived JWTs with secure signing

## 🧪 Testing

### Test Structure
\`\`\`
backend/src/tests/
├── auth.test.ts          # Authentication tests
├── groups.test.ts        # Group management tests
├── expenses.test.ts      # Expense handling tests
├── settlements.test.ts   # Settlement tests
└── integration.test.ts   # End-to-end tests
\`\`\`

### Running Tests
\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.ts

# Watch mode
npm run test:watch
\`\`\`

### Test Coverage Requirements
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: All API endpoints
- **Security Tests**: Authentication and authorization
- **Performance Tests**: Response time < 200ms

## 📝 Logging

### Log Levels
- **ERROR**: System errors, exceptions
- **WARN**: Deprecated features, unusual behavior
- **INFO**: General application flow
- **DEBUG**: Detailed debugging information

### Log Format
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "message": "User login successful",
  "userId": 1,
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req-123456"
}
\`\`\`

## 🚀 Deployment

### Environment Variables
\`\`\`bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/splitkar_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://splitkar.vercel.app

# Email (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Security
API_RATE_LIMIT_WINDOW=900000
API_RATE_LIMIT_MAX=100
\`\`\`

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## 🔧 Development

### Setup
\`\`\`bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize database
npm run setup-db

# Start development server
npm run dev
\`\`\`

### Code Style
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Husky**: Pre-commit hooks

### API Design Principles
- **RESTful**: Standard HTTP methods and status codes
- **Consistent**: Uniform response structure
- **Versioned**: API versioning strategy
- **Documented**: OpenAPI/Swagger documentation
- **Secure**: Authentication and authorization on all endpoints
