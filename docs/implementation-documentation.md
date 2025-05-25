# SplitKar Implementation Documentation

## 🏗️ Implementation Strategy

This document outlines the technical implementation approach, development guidelines, architecture decisions, and best practices for building the SplitKar expense splitting application.

## 📋 Development Methodology

### Agile Development Process
- **Sprint Duration**: 2-week sprints
- **Team Structure**: Full-stack developers, UI/UX designer, QA engineer, DevOps engineer
- **Planning**: Sprint planning, daily standups, sprint reviews, retrospectives
- **Version Control**: Git with feature branch workflow
- **Code Review**: Mandatory peer review for all pull requests

### Development Phases

#### Phase 1: Foundation (Weeks 1-4)
**Objectives**: Establish core infrastructure and basic functionality
- Set up development environment and CI/CD pipeline
- Implement user authentication and authorization
- Create basic UI components and design system
- Set up database schema and API endpoints
- Implement core expense and group management

**Deliverables**:
- User registration and login functionality
- Basic group creation and member management
- Simple expense creation and splitting
- Responsive UI framework
- API documentation

#### Phase 2: Core Features (Weeks 5-8)
**Objectives**: Implement primary user workflows
- Advanced expense splitting methods
- Settlement and payment tracking
- Notification system
- Friend management
- Mobile responsiveness optimization

**Deliverables**:
- Complete expense management system
- Settlement workflow
- Real-time notifications
- Friend invitation system
- Mobile-optimized interface

#### Phase 3: Enhancement (Weeks 9-12)
**Objectives**: Add advanced features and optimizations
- Analytics and reporting
- Advanced security features
- Performance optimizations
- Integration testing
- User acceptance testing

**Deliverables**:
- Expense analytics dashboard
- Security audit completion
- Performance benchmarks met
- Comprehensive test coverage
- Production deployment

## 🛠️ Technology Stack Implementation

### Backend Implementation

#### Node.js + Express.js Setup
\`\`\`typescript
// Project Structure
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation
│   └── tests/           # Test files
├── db/
│   ├── migrations/      # Database migrations
│   ├── seeds/           # Test data
│   └── schema.sql       # Database schema
└── scripts/             # Deployment scripts

// Application Bootstrap
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settlements', settlementRoutes);

// Error handling
app.use(errorHandler);

export default app;
\`\`\`

#### Database Implementation Strategy
\`\`\`sql
-- Migration Strategy
-- Use sequential migrations for schema changes
-- Each migration should be reversible
-- Include data migrations when necessary

-- Example Migration: 001_create_users_table.sql
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

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);

-- Example Migration: 002_create_groups_table.sql
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_groups_created_by ON groups(created_by);
\`\`\`

#### API Design Implementation
\`\`\`typescript
// RESTful API Design Principles
// 1. Use HTTP methods appropriately (GET, POST, PUT, DELETE)
// 2. Use meaningful HTTP status codes
// 3. Implement consistent response format
// 4. Include proper error handling
// 5. Use pagination for list endpoints

// Response Format Standard
interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Controller Implementation Pattern
export class ExpenseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      // 2. Extract data
      const { group_id, title, amount, description, splits } = req.body;
      const userId = req.user.id;

      // 3. Business logic validation
      await this.validateExpenseCreation(group_id, userId, splits, amount);

      // 4. Create expense
      const expense = await ExpenseService.create({
        group_id,
        created_by: userId,
        title,
        amount,
        description,
        splits,
      });

      // 5. Send response
      res.status(201).json({
        success: true,
        data: expense,
        message: 'Expense created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private async validateExpenseCreation(
    groupId: number,
    userId: number,
    splits: ExpenseSplit[],
    amount: number
  ) {
    // Check if user is group member
    const isMember = await GroupService.isMember(groupId, userId);
    if (!isMember) {
      throw new ForbiddenError('User is not a member of this group');
    }

    // Validate splits sum to total amount
    const totalSplits = splits.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(totalSplits - amount) > 0.01) {
      throw new ValidationError('Splits do not sum to total amount');
    }

    // Validate all split users are group members
    const splitUserIds = splits.map(split => split.user_id);
    const validMembers = await GroupService.validateMembers(groupId, splitUserIds);
    if (!validMembers) {
      throw new ValidationError('Some split users are not group members');
    }
  }
}
\`\`\`

### Frontend Implementation

#### Next.js App Router Setup
\`\`\`typescript
// Project Structure
frontend/src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Route groups
│   ├── dashboard/      # Dashboard pages
│   ├── groups/         # Group management
│   ├── expenses/       # Expense management
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/               # Utilities
├── types/             # TypeScript types
└── styles/            # Global styles

// Root Layout Implementation
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

// Providers Setup
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
\`\`\`

#### Component Architecture Implementation
\`\`\`typescript
// Component Design Principles
// 1. Single Responsibility Principle
// 2. Composition over inheritance
// 3. Props interface for type safety
// 4. Error boundaries for error handling
// 5. Accessibility considerations

// Base Component Pattern
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Component Implementation
interface ExpenseFormProps {
  groupId: string;
  onSuccess?: (expense: Expense) => void;
  onCancel?: () => void;
  initialData?: Partial<Expense>;
}

export function ExpenseForm({ 
  groupId, 
  onSuccess, 
  onCancel, 
  initialData 
}: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      category: initialData?.category || 'general',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      splits: initialData?.splits || [],
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    try {
      const expense = await apiClient.expenses.create({
        ...data,
        group_id: groupId,
      });
      
      toast.success('Expense created successfully');
      onSuccess?.(expense);
    } catch (error) {
      toast.error('Failed to create expense');
      console.error('Expense creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter expense title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ExpenseSplitSection 
          groupId={groupId}
          totalAmount={form.watch('amount')}
          splits={form.watch('splits')}
          onSplitsChange={(splits) => form.setValue('splits', splits)}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Expense'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
\`\`\`

#### State Management Implementation
\`\`\`typescript
// Context-based State Management
// Use React Context for global state
// Use local state for component-specific state
// Use React Query for server state

// Auth Context Implementation
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await apiClient.auth.getProfile();
      setUser(userData);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.auth.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    // Redirect to login page
    window.location.href = '/auth/login';
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await apiClient.auth.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for Auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
\`\`\`

## 🧪 Testing Implementation Strategy

### Backend Testing
\`\`\`typescript
// Test Structure
backend/src/tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
├── fixtures/          # Test data
└── helpers/           # Test utilities

// Unit Test Example
describe('ExpenseService', () => {
  describe('create', () => {
    it('should create expense with valid data', async () => {
      // Arrange
      const expenseData = {
        group_id: 1,
        created_by: 1,
        title: 'Test Expense',
        amount: 100,
        splits: [
          { user_id: 1, amount: 50 },
          { user_id: 2, amount: 50 },
        ],
      };

      // Mock dependencies
      jest.spyOn(GroupService, 'isMember').mockResolvedValue(true);
      jest.spyOn(GroupService, 'validateMembers').mockResolvedValue(true);

      // Act
      const expense = await ExpenseService.create(expenseData);

      // Assert
      expect(expense).toBeDefined();
      expect(expense.title).toBe('Test Expense');
      expect(expense.amount).toBe(100);
    });

    it('should throw error if splits do not sum to total', async () => {
      // Arrange
      const expenseData = {
        group_id: 1,
        created_by: 1,
        title: 'Test Expense',
        amount: 100,
        splits: [
          { user_id: 1, amount: 30 },
          { user_id: 2, amount: 50 },
        ],
      };

      // Act & Assert
      await expect(ExpenseService.create(expenseData))
        .rejects
        .toThrow('Splits do not sum to total amount');
    });
  });
});

// Integration Test Example
describe('Expense API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    authToken = await getTestAuthToken();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/expenses', () => {
    it('should create expense successfully', async () => {
      const expenseData = {
        group_id: 1,
        title: 'Test Expense',
        amount: 100,
        splits: [
          { user_id: 1, amount: 50 },
          { user_id: 2, amount: 50 },
        ],
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Expense');
    });
  });
});
\`\`\`

### Frontend Testing
\`\`\`typescript
// Test Structure
frontend/src/tests/
├── components/        # Component tests
├── hooks/            # Hook tests
├── pages/            # Page tests
├── utils/            # Utility tests
└── __mocks__/        # Mock files

// Component Test Example
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from '../components/ExpenseForm';
import { AuthProvider } from '../contexts/AuthContext';

// Mock API client
jest.mock('../lib/api-client', () => ({
  apiClient: {
    expenses: {
      create: jest.fn(),
    },
  },
}));

describe('ExpenseForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(
      <AuthProvider>
        <ExpenseForm 
          groupId="1" 
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/expense title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create expense/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const mockExpense = {
      id: 1,
      title: 'Test Expense',
      amount: 100,
    };

    (apiClient.expenses.create as jest.Mock).mockResolvedValue(mockExpense);

    render(
      <AuthProvider>
        <ExpenseForm 
          groupId="1" 
          onSuccess={mockOnSuccess}
        />
      </AuthProvider>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/expense title/i), {
      target: { value: 'Test Expense' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create expense/i }));

    await waitFor(() => {
      expect(apiClient.expenses.create).toHaveBeenCalledWith({
        group_id: '1',
        title: 'Test Expense',
        amount: 100,
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockExpense);
    });
  });
});

// Hook Test Example
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../contexts/AuthContext';

describe('useAuth', () => {
  it('should login user successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
\`\`\`

## 🚀 Deployment Implementation

### CI/CD Pipeline
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: splitkar_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install backend dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/splitkar_test
        JWT_SECRET: test-secret
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend
\`\`\`

### Environment Configuration
\`\`\`bash
# Production Environment Variables

# Backend (.env)
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://user:pass@prod-db:5432/splitkar_prod
JWT_SECRET=super-secure-production-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://splitkar.vercel.app

# Email Configuration
GMAIL_USER=noreply@splitkar.com
GMAIL_APP_PASSWORD=app-specific-password

# Security
API_RATE_LIMIT_WINDOW=900000
API_RATE_LIMIT_MAX=100
ALLOWED_API_KEYS=key1,key2,key3

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE_ENABLED=true

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.splitkar.com
NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=false
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
\`\`\`

### Database Migration Strategy
\`\`\`typescript
// Migration Runner
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

class MigrationRunner {
  private pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl });
  }

  async runMigrations() {
    // Create migrations table if it doesn't exist
    await this.createMigrationsTable();

    // Get list of migration files
    const migrationFiles = this.getMigrationFiles();

    // Get applied migrations
    const appliedMigrations = await this.getAppliedMigrations();

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        await this.runMigration(file);
      }
    }
  }

  private async createMigrationsTable() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private getMigrationFiles(): string[] {
    const migrationsDir = path.join(__dirname, '../db/migrations');
    return fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const result = await this.pool.query('SELECT filename FROM migrations');
    return result.rows.map(row => row.filename);
  }

  private async runMigration(filename: string) {
    const migrationPath = path.join(__dirname, '../db/migrations', filename);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [filename]
      );
      await client.query('COMMIT');
      console.log(`Migration ${filename} applied successfully`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

// Usage in deployment script
async function deploy() {
  const migrationRunner = new MigrationRunner(process.env.DATABASE_URL!);
  await migrationRunner.runMigrations();
  console.log('Database migrations completed');
}
\`\`\`

## 📊 Performance Implementation

### Backend Performance
\`\`\`typescript
// Database Query Optimization
class ExpenseRepository {
  // Use indexes for frequently queried columns
  async findByGroupId(groupId: number, limit = 20, offset = 0) {
    return this.pool.query(`
      SELECT 
        e.*,
        u.name as created_by_name,
        COUNT(*) OVER() as total_count
      FROM expenses e
      JOIN users u ON e.created_by = u.id
      WHERE e.group_id = $1
      ORDER BY e.created_at DESC
      LIMIT $2 OFFSET $3
    `, [groupId, limit, offset]);
  }

  // Use prepared statements for repeated queries
  private findByIdStatement = this.pool.prepare(`
    SELECT * FROM expenses WHERE id = $1
  `);

  async findById(id: number) {
    return this.findByIdStatement.execute([id]);
  }
}

// Caching Implementation
import Redis from 'ioredis';

class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl = 3600) {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in controllers
export class GroupController {
  private cache = new CacheService();

  async getGroups(req: Request, res: Response) {
    const userId = req.user.id;
    const cacheKey = `user:${userId}:groups`;

    // Try cache first
    let groups = await this.cache.get(cacheKey);
    
    if (!groups) {
      groups = await GroupService.findByUserId(userId);
      await this.cache.set(cacheKey, groups, 300); // 5 minutes
    }

    res.json({ success: true, data: groups });
  }
}
\`\`\`

### Frontend Performance
\`\`\`typescript
// Code Splitting Implementation
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const ExpenseAnalytics = lazy(() => import('../components/ExpenseAnalytics'));
const GroupSettings = lazy(() => import('../components/GroupSettings'));

function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <Suspense fallback={<AnalyticsLoading />}>
        <ExpenseAnalytics />
      </Suspense>
      <Suspense fallback={<SettingsLoading />}>
        <GroupSettings />
      </Suspense>
    </div>
  );
}

// Image Optimization
import Image from 'next/image';

function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatar || '/default-avatar.png'}
      alt={user.name}
      width={40}
      height={40}
      className="rounded-full"
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rq5lVooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
