# SplitKar - Expense Splitting Application

A comprehensive expense splitting application with separate frontend and backend modules, featuring robust authentication, authorization, and testing capabilities.

## 🏗️ Architecture

### Backend (Node.js + Express + PostgreSQL)
- **Authentication**: JWT-based with bcrypt password hashing
- **Authorization**: Role-based access control with ownership validation
- **Database**: PostgreSQL with proper indexing and relationships
- **Security**: Helmet, CORS, rate limiting, input validation
- **Testing**: Jest with supertest for API testing

### Frontend (Next.js + React + TypeScript)
- **Authentication**: Context-based auth management
- **API Integration**: Centralized API client with error handling
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: React Context and hooks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Clone and install dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

2. **Set up environment variables**
\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
\`\`\`

3. **Set up database**
\`\`\`bash
# Create database
createdb splitkar_db

# Run schema
npm run setup-db

# Set up mock data (optional)
npm run setup-mock
\`\`\`

4. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
\`\`\`bash
cd frontend
npm install
\`\`\`

2. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your API URL
\`\`\`

3. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: User/Admin role separation
- **Ownership Validation**: Users can only access their own resources
- **Token Expiration**: Configurable token lifetime

### API Security
- **Rate Limiting**: Prevents abuse and DoS attacks
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers for common vulnerabilities
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries

### Data Protection
- **Sensitive Data Filtering**: Passwords never returned in responses
- **Group Access Control**: Members-only access to group data
- **Transaction Safety**: Database transactions for data consistency

## 🧪 Testing

### Demo Accounts
The application includes pre-configured demo accounts for testing:

- **Regular User**: `user@demo.com` / `password123`
- **Admin User**: `admin@demo.com` / `password123`
- **Additional Users**: `alice@demo.com`, `bob@demo.com`, `charlie@demo.com` / `password123`

### Running Tests
\`\`\`bash
# Backend tests
cd backend
npm test

# Watch mode
npm run test:watch

# Frontend tests (if configured)
cd frontend
npm test
\`\`\`

### Mock Data Management
\`\`\`bash
# Set up mock data
npm run setup-mock

# Clear mock data
npm run clear-mock
\`\`\`

## 📊 Database Schema

### Core Tables
- **users**: User accounts and profiles
- **groups**: Expense groups
- **group_members**: Group membership with roles
- **expenses**: Individual expenses
- **expense_splits**: How expenses are split among users
- **settlements**: Payment settlements between users
- **friendships**: User friend relationships

### Security Tables
- **user_settings**: User preferences and settings
- **notifications**: System notifications
- **disputes**: Expense disputes and resolutions

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Groups
- `POST /api/groups` - Create group (protected)
- `GET /api/groups` - Get user's groups (protected)
- `GET /api/groups/:id` - Get group details (protected, members only)
- `PUT /api/groups/:id` - Update group (protected, admin only)
- `DELETE /api/groups/:id` - Delete group (protected, creator only)
- `POST /api/groups/:id/members` - Add member (protected, admin only)
- `DELETE /api/groups/:id/members/:userId` - Remove member (protected)

## 🛡️ Authorization Matrix

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| User Profile | Public (register) | Owner only | Owner only | Owner only |
| Groups | Authenticated | Members only | Admin only | Creator only |
| Group Members | Admin only | Members only | Admin only | Admin/Self only |
| Expenses | Group members | Group members | Creator only | Creator only |

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with: `npm start`

### Frontend Deployment
1. Set production API URL in environment
2. Build the application: `npm run build`
3. Deploy static files or use `npm start`

### Environment Variables
Ensure all required environment variables are set in production:
- `DATABASE_URL`
- `JWT_SECRET` (use a strong, unique secret)
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL`

## 🔧 Development

### Code Structure
\`\`\`
backend/
├── src/
│   ├── config/         # Database and auth configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication and validation
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utilities and mock data
│   └── tests/          # Test files
├── db/                 # Database schema and migrations
└── scripts/            # Setup and utility scripts

frontend/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utilities and API client
│   └── types/          # TypeScript type definitions
\`\`\`

### Adding New Features
1. **Backend**: Add routes → controllers → models
2. **Frontend**: Add API client methods → components → pages
3. **Security**: Ensure proper authentication and authorization
4. **Testing**: Add tests for new functionality

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
