# 🔧 Environment Variables Guide

## 📋 Complete Environment Variables List

### 🗄️ **Database**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |

### 🔐 **Authentication**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | ✅ | Secret key for JWT tokens | `your-super-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | ✅ | JWT token expiration | `7d` |

### 🌐 **Server Configuration**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ | Backend server port | `5000` |
| `NODE_ENV` | ✅ | Environment mode | `development` / `production` |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS | `http://localhost:3000` |

### 📧 **Google Service Account (Gmail)**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PROJECT_ID` | ✅ | Google Cloud Project ID | `my-project-123456` |
| `CLIENT_ID` | ✅ | Service account client ID | `123456789012345678901` |
| `CLIENT_EMAIL` | ✅ | Service account email | `service@project.iam.gserviceaccount.com` |
| `PRIVATE_KEY_ID` | ✅ | Private key ID | `abcd1234...` |
| `PRIVATE_KEY` | ✅ | Private key (with \n) | `-----BEGIN PRIVATE KEY-----\n...` |
| `CLIENT_X509_CERT_URL` | ✅ | Certificate URL | `https://www.googleapis.com/robot/v1/...` |
| `AUTH_URI` | ✅ | Auth URI | `https://accounts.google.com/o/oauth2/auth` |
| `TOKEN_URI` | ✅ | Token URI | `https://oauth2.googleapis.com/token` |
| `AUTH_PROVIDER_X509_CERT_URL` | ✅ | Provider cert URL | `https://www.googleapis.com/oauth2/v1/certs` |
| `UNIVERSE_DOMAIN` | ✅ | Universe domain | `googleapis.com` |

### 📨 **Email (Fallback)**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GMAIL_APP_PASSWORD` | ⚠️ | Gmail app password | `abcd efgh ijkl mnop` |

### 🎨 **Frontend**
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND` | ✅ | Use mock data | `false` / `true` |

## 📁 File Structure

\`\`\`
splitkar/
├── .env                          # 🌟 MAIN - All variables (for Docker)
├── .env.example                  # Template for main .env
├── backend/
│   ├── .env                      # Backend-specific overrides
│   └── .env.example              # Backend template
├── frontend/
│   ├── .env.local                # Frontend-specific variables
│   └── .env.local.example        # Frontend template
└── docker-compose.yml            # Uses main .env file
\`\`\`

## 🚀 Setup Instructions

### 1. **Quick Setup**
\`\`\`bash
# Run the setup script
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
\`\`\`

### 2. **Manual Setup**
\`\`\`bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit with your values
nano .env
\`\`\`

### 3. **Docker Setup**
\`\`\`bash
# Uses centralized .env file
docker compose up -d
\`\`\`

### 4. **Local Development**
\`\`\`bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
\`\`\`

## 🔒 Security Notes

1. **Never commit .env files** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable SSL** for production databases
4. **Rotate credentials** regularly
5. **Use environment-specific values** for different deployments

## 🌍 Environment-Specific Configurations

### **Development**
- `NODE_ENV=development`
- `NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=true` (for testing)
- Local database URLs

### **Production**
- `NODE_ENV=production`
- `NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=false`
- Production database URLs with SSL
- Strong JWT secrets
- Production domain URLs
