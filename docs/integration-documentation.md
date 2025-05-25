# SplitKar Frontend-Backend Integration Documentation

## 🔗 System Integration Overview

This document describes how the SplitKar frontend and backend modules communicate, share data, and maintain consistency across the entire application ecosystem.

## 🏗️ Architecture Diagram

\`\`\`
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│                 │    Requests       │                 │
│   Frontend      │◄─────────────────►│    Backend      │
│   (Next.js)     │    JSON/JWT       │   (Express.js)  │
│                 │                   │                 │
└─────────────────┘                   └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                   ┌─────────────────┐
│   Browser       │                   │   PostgreSQL    │
│   Storage       │                   │   Database      │
│   (Cookies/LS)  │                   │                 │
└─────────────────┘                   └─────────────────┘
\`\`\`

## 🌐 Communication Protocol

### Base Configuration
\`\`\`typescript
// Frontend API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Backend CORS Configuration
const CORS_CONFIG = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
\`\`\`

### Request/Response Flow
\`\`\`mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    F->>B: HTTP Request + JWT Token
    B->>B: Validate JWT Token
    B->>B: Validate Request Data
    B->>DB: Execute Database Query
    DB->>B: Return Data
    B->>B: Format Response
    B->>F: JSON Response
    F->>F: Update UI State
\`\`\`

## 🔐 Authentication Flow

### Registration Process
\`\`\`typescript
// Frontend Registration
async function register(userData: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
}

// Backend Registration Handler
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, upi_id } = req.body;
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      name,
      phone,
      upi_id,
    });
    
    // Generate verification token
    const verificationToken = generateVerificationToken();
    await User.updateVerificationToken(user.id, verificationToken);
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_verified: false,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
\`\`\`

### Login Process
\`\`\`typescript
// Frontend Login
async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    // Store token
    localStorage.setItem('auth_token', data.token);
    
    // Update auth context
    setUser(data.user);
    setIsAuthenticated(true);
  }
  
  return data;
}

// Backend Login Handler
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
\`\`\`

## 📊 Data Synchronization

### Real-time Updates
\`\`\`typescript
// Frontend: Optimistic Updates
async function createExpense(expenseData: CreateExpenseData) {
  // Optimistic update
  const tempExpense = {
    id: `temp-${Date.now()}`,
    ...expenseData,
    created_at: new Date().toISOString(),
  };
  
  setExpenses(prev => [tempExpense, ...prev]);
  
  try {
    // Send to backend
    const response = await apiClient.expenses.create(expenseData);
    
    // Replace temp expense with real data
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === tempExpense.id ? response : exp
      )
    );
    
    toast.success('Expense created successfully');
  } catch (error) {
    // Revert optimistic update
    setExpenses(prev => 
      prev.filter(exp => exp.id !== tempExpense.id)
    );
    
    toast.error('Failed to create expense');
    throw error;
  }
}

// Backend: Broadcast Updates (WebSocket implementation)
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// When expense is created
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    
    // Broadcast to group members
    const groupMembers = await GroupMember.findByGroupId(expense.group_id);
    groupMembers.forEach(member => {
      io.to(`user-${member.user_id}`).emit('expense-created', expense);
    });
    
    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create expense' });
  }
});
\`\`\`

### State Management Integration
\`\`\`typescript
// Frontend: Context + API Integration
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch expenses from backend
  const fetchExpenses = useCallback(async (filters?: ExpenseFilters) => {
    setLoading(true);
    try {
      const data = await apiClient.expenses.list(filters);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create expense
  const createExpense = useCallback(async (data: CreateExpenseData) => {
    const expense = await apiClient.expenses.create(data);
    setExpenses(prev => [expense, ...prev]);
    return expense;
  }, []);
  
  // Update expense
  const updateExpense = useCallback(async (id: string, data: UpdateExpenseData) => {
    const expense = await apiClient.expenses.update(id, data);
    setExpenses(prev => 
      prev.map(exp => exp.id === id ? expense : exp)
    );
    return expense;
  }, []);
  
  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    await apiClient.expenses.delete(id);
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);
  
  return (
    <ExpenseContext.Provider value={{
      expenses,
      loading,
      fetchExpenses,
      createExpense,
      updateExpense,
      deleteExpense,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}
\`\`\`

## 🔄 API Request/Response Patterns

### Standard Response Format
\`\`\`typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Error Response
interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  code?: string;
}

// Backend Response Helper
function sendSuccess<T>(res: Response, data?: T, message?: string, meta?: any) {
  res.json({
    success: true,
    data,
    message,
    meta,
  });
}

function sendError(res: Response, status: number, message: string, errors?: any) {
  res.status(status).json({
    success: false,
    message,
    errors,
  });
}
\`\`\`

### Request Interceptors
\`\`\`typescript
// Frontend: Request Interceptor
class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
      throw new Error('Authentication required');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(data.message, response.status, data.errors);
    }
    
    return data;
  }
}

// Backend: Authentication Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}
\`\`\`

## 🔒 Security Integration

### CSRF Protection
\`\`\`typescript
// Backend: CSRF Token Generation
app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
}));

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Frontend: CSRF Token Usage
const CSRFProvider = ({ children }: { children: React.ReactNode }) => {
  const [csrfToken, setCsrfToken] = useState<string>('');
  
  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);
  
  return (
    <CSRFContext.Provider value={csrfToken}>
      {children}
    </CSRFContext.Provider>
  );
};
\`\`\`

### Rate Limiting Integration
\`\`\`typescript
// Backend: Rate Limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// Frontend: Rate Limit Handling
async function handleRateLimitError(error: APIError) {
  if (error.status === 429) {
    const retryAfter = error.headers?.['retry-after'];
    if (retryAfter) {
      toast.error(`Too many requests. Please try again in ${retryAfter} seconds.`);
    } else {
      toast.error('Too many requests. Please try again later.');
    }
  }
}
\`\`\`

## 📱 Mobile Integration

### Progressive Web App (PWA)
\`\`\`typescript
// Frontend: Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Offline Support
const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync pending actions
      syncPendingActions();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, pendingActions };
};
\`\`\`

## 🧪 Testing Integration

### End-to-End Testing
\`\`\`typescript
// E2E Test: Complete User Flow
describe('Expense Creation Flow', () => {
  it('should create expense from frontend to backend', async () => {
    // Start backend server
    const server = await startTestServer();
    
    // Start frontend
    const { page } = await startBrowser();
    
    try {
      // Login
      await page.goto('/auth/login');
      await page.fill('[data-testid="email"]', 'test@example.com');
      await page.fill('[data-testid="password"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      // Navigate to expenses
      await page.click('[data-testid="expenses-nav"]');
      
      // Create expense
      await page.click('[data-testid="add-expense"]');
      await page.fill('[data-testid="expense-title"]', 'Test Expense');
      await page.fill('[data-testid="expense-amount"]', '100');
      await page.click('[data-testid="save-expense"]');
      
      // Verify expense appears
      await expect(page.locator('[data-testid="expense-list"]')).toContainText('Test Expense');
      
      // Verify in database
      const expense = await db.query('SELECT * FROM expenses WHERE title = $1', ['Test Expense']);
      expect(expense.rows).toHaveLength(1);
      
    } finally {
      await page.close();
      await server.close();
    }
  });
});
\`\`\`

### API Contract Testing
\`\`\`typescript
// Contract Test: API Response Validation
describe('API Contract Tests', () => {
  it('should match expected response schema', async () => {
    const response = await request(app)
      .get('/api/groups')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);
    
    // Validate response structure
    expect(response.body).toMatchSchema({
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              created_by: { type: 'number' },
              member_count: { type: 'number' },
            },
            required: ['id', 'name', 'created_by'],
          },
        },
      },
      required: ['success', 'data'],
    });
  });
});
\`\`\`

## 🚀 Deployment Integration

### Environment Configuration
\`\`\`bash
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://api.splitkar.com
NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=false
NEXT_PUBLIC_ENVIRONMENT=production

# Backend Environment Variables
DATABASE_URL=postgresql://user:pass@db.splitkar.com:5432/splitkar_prod
JWT_SECRET=super-secret-production-key
FRONTEND_URL=https://splitkar.com
NODE_ENV=production
\`\`\`

### Health Checks
\`\`\`typescript
// Backend: Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');
    
    // Check external services
    const checks = {
      database: 'healthy',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    
    res.json({
      status: 'healthy',
      checks,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Frontend: Health Check Integration
const useHealthCheck = () => {
  const [status, setStatus] = useState<'healthy' | 'unhealthy' | 'unknown'>('unknown');
  
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        setStatus('unhealthy');
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return status;
};
\`\`\`

## 📊 Monitoring & Analytics

### Error Tracking Integration
\`\`\`typescript
// Frontend: Error Boundary with Backend Reporting
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to backend
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }
}

// Backend: Error Logging
app.post('/api/errors', (req, res) => {
  const { error, stack, componentStack, url, userAgent, timestamp } = req.body;
  
  logger.error('Frontend Error', {
    error,
    stack,
    componentStack,
    url,
    userAgent,
    timestamp,
    userId: req.user?.userId,
  });
  
  res.status(200).json({ received: true });
});
\`\`\`

This integration documentation provides a comprehensive overview of how the frontend and backend modules work together to create a cohesive SplitKar application experience.
