# SplitKar Frontend Documentation

## 🏗️ Architecture Overview

The SplitKar frontend is built using Next.js 14 with the App Router, React 18, TypeScript, and Tailwind CSS. It follows modern React patterns with server and client components, providing a responsive and intuitive user experience.

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Hooks
- **HTTP Client**: Fetch API with custom wrapper
- **Authentication**: JWT with Context Provider
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## 📁 Project Structure

\`\`\`
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── groups/            # Group management
│   ├── expenses/          # Expense tracking
│   ├── friends/           # Friend management
│   ├── profile/           # User profile
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── lib/                  # Utilities and configurations
├── data/                 # Mock data for development
└── types/                # TypeScript type definitions
\`\`\`

## 🎨 Design System

### Color Palette
\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}
\`\`\`

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: font-semibold to font-bold
- **Body**: font-normal
- **Captions**: font-medium, text-sm

### Component Library (shadcn/ui)
- **Button**: Primary, secondary, destructive, ghost variants
- **Card**: Container with header, content, footer
- **Input**: Text, email, password, number inputs
- **Select**: Dropdown selection component
- **Dialog**: Modal dialogs and confirmations
- **Alert**: Success, error, warning, info alerts
- **Badge**: Status indicators and tags
- **Avatar**: User profile images with fallbacks

## 🧭 Routing & Navigation

### App Router Structure
\`\`\`
/                          # Landing page
/auth                      # Authentication hub
  /login                   # User login
  /register                # User registration
  /verify                  # Email verification
  /forgot-password         # Password reset
/dashboard                 # Main dashboard
/groups                    # Group listing
  /create                  # Create new group
  /[id]                    # Group details
/expenses                  # Expense management
  /add                     # Add new expense
  /[id]                    # Expense details
/friends                   # Friend management
  /add                     # Add friends
/profile                   # User profile & settings
/settle                    # Settlement management
/notifications             # Notification center
/analytics                 # Expense analytics
\`\`\`

### Navigation Components
\`\`\`typescript
// Main navigation structure
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  badge?: number;
  requiresAuth: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, requiresAuth: true },
  { name: 'Groups', href: '/groups', icon: UsersIcon, requiresAuth: true },
  { name: 'Expenses', href: '/expenses', icon: CreditCardIcon, requiresAuth: true },
  { name: 'Friends', href: '/friends', icon: UserPlusIcon, requiresAuth: true },
  { name: 'Settle', href: '/settle', icon: ArrowRightLeftIcon, requiresAuth: true },
];
\`\`\`

## 🔐 Authentication System

### Auth Context
\`\`\`typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
\`\`\`

### Protected Routes
\`\`\`typescript
// Route protection middleware
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) redirect('/auth/login');
  
  return <>{children}</>;
}
\`\`\`

### Token Management
- **Storage**: HTTP-only cookies (production) / localStorage (development)
- **Refresh**: Automatic token refresh on API calls
- **Expiration**: Redirect to login on token expiry
- **Security**: CSRF protection and secure headers

## 📡 API Integration

### API Client Architecture
\`\`\`typescript
interface APIClient {
  // Authentication
  auth: {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    getProfile: () => Promise<User>;
  };
  
  // Groups
  groups: {
    list: () => Promise<Group[]>;
    create: (data: CreateGroupData) => Promise<Group>;
    get: (id: string) => Promise<GroupDetails>;
    update: (id: string, data: UpdateGroupData) => Promise<Group>;
    delete: (id: string) => Promise<void>;
  };
  
  // Expenses
  expenses: {
    list: (filters?: ExpenseFilters) => Promise<Expense[]>;
    create: (data: CreateExpenseData) => Promise<Expense>;
    get: (id: string) => Promise<ExpenseDetails>;
    update: (id: string, data: UpdateExpenseData) => Promise<Expense>;
    delete: (id: string) => Promise<void>;
  };
}
\`\`\`

### Error Handling
\`\`\`typescript
interface APIError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Global error handler
function handleAPIError(error: APIError) {
  switch (error.status) {
    case 401:
      // Redirect to login
      router.push('/auth/login');
      break;
    case 403:
      // Show permission denied
      toast.error('Permission denied');
      break;
    case 500:
      // Show generic error
      toast.error('Something went wrong. Please try again.');
      break;
    default:
      toast.error(error.message);
  }
}
\`\`\`

### Mock Data System
For development and testing, the frontend includes a comprehensive mock data system:

\`\`\`typescript
// Mock API toggle
const useMockData = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === 'true';

// Mock data structure
interface MockData {
  users: User[];
  groups: Group[];
  expenses: Expense[];
  friends: Friendship[];
  settlements: Settlement[];
}
\`\`\`

## 🎯 State Management

### Context Providers
\`\`\`typescript
// App-level providers
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
\`\`\`

### Custom Hooks
\`\`\`typescript
// useAuth - Authentication state
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// useGroups - Group management
const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.groups.list();
      setGroups(data);
    } catch (error) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { groups, loading, fetchGroups, refetch: fetchGroups };
};

// useExpenses - Expense management
const useExpenses = (groupId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addExpense = useCallback(async (data: CreateExpenseData) => {
    const newExpense = await apiClient.expenses.create(data);
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);
  
  return { expenses, loading, addExpense };
};
\`\`\`

## 🧩 Component Architecture

### Page Components
\`\`\`typescript
// Dashboard page structure
export default function DashboardPage() {
  const { user } = useAuth();
  const { groups } = useGroups();
  const { expenses } = useExpenses();
  
  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />
      <DashboardStats groups={groups} expenses={expenses} />
      <RecentActivity />
      <QuickActions />
    </div>
  );
}
\`\`\`

### Reusable Components
\`\`\`typescript
// ExpenseCard component
interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  showGroup?: boolean;
}

function ExpenseCard({ expense, onEdit, onDelete, showGroup }: ExpenseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{expense.title}</CardTitle>
          <Badge variant={expense.category}>{expense.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${expense.amount}</p>
        <p className="text-muted-foreground">{expense.description}</p>
        {showGroup && (
          <p className="text-sm text-muted-foreground">
            Group: {expense.group.name}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(expense)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(expense.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
\`\`\`

## 📱 Responsive Design

### Breakpoints
\`\`\`css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
\`\`\`

### Mobile-First Approach
\`\`\`typescript
// Responsive navigation
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {navigation.map((item) => (
          <NavigationItem key={item.href} item={item} />
        ))}
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden">
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        {isMobileMenuOpen && (
          <MobileMenu items={navigation} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </nav>
  );
}
\`\`\`

## 🔔 Notifications & Feedback

### Toast Notifications
\`\`\`typescript
// Toast system
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

const useToast = () => {
  const toast = (options: ToastOptions) => {
    // Implementation
  };
  
  return {
    toast,
    success: (message: string) => toast({ description: message, variant: 'success' }),
    error: (message: string) => toast({ description: message, variant: 'destructive' }),
    info: (message: string) => toast({ description: message }),
  };
};
\`\`\`

### Loading States
\`\`\`typescript
// Loading component variants
function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
}

// Skeleton loading
function ExpenseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}
\`\`\`

## 🧪 Testing Strategy

### Component Testing
\`\`\`typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseCard } from '../components/ExpenseCard';

describe('ExpenseCard', () => {
  const mockExpense = {
    id: '1',
    title: 'Test Expense',
    amount: 100,
    description: 'Test description',
    category: 'food',
  };
  
  it('renders expense information correctly', () => {
    render(<ExpenseCard expense={mockExpense} />);
    
    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<ExpenseCard expense={mockExpense} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockExpense);
  });
});
\`\`\`

### Integration Testing
\`\`\`typescript
// Page integration test
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import DashboardPage from '../app/dashboard/page';

describe('Dashboard Integration', () => {
  it('displays user dashboard with groups and expenses', async () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Recent Expenses')).toBeInTheDocument();
    });
  });
});
\`\`\`

## 🚀 Performance Optimization

### Code Splitting
\`\`\`typescript
// Lazy loading components
const ExpenseModal = lazy(() => import('../components/ExpenseModal'));
const AnalyticsChart = lazy(() => import('../components/AnalyticsChart'));

// Usage with Suspense
function ExpensePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ExpenseModal />
    </Suspense>
  );
}
\`\`\`

### Image Optimization
\`\`\`typescript
// Next.js Image component
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
    />
  );
}
\`\`\`

### Caching Strategy
\`\`\`typescript
// SWR for data fetching and caching
import useSWR from 'swr';

function useGroups() {
  const { data, error, mutate } = useSWR('/api/groups', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  });
  
  return {
    groups: data,
    loading: !error && !data,
    error,
    refresh: mutate,
  };
}
\`\`\`

## 🔧 Development Workflow

### Environment Setup
\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

### Code Quality
\`\`\`json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
\`\`\`

### Git Workflow
\`\`\`bash
# Feature development
git checkout -b feature/expense-splitting
git add .
git commit -m "feat: add expense splitting functionality"
git push origin feature/expense-splitting

# Create pull request
# Code review and testing
# Merge to main branch
\`\`\`

## 📦 Build & Deployment

### Build Configuration
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
\`\`\`

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Build optimization enabled
- [ ] Error tracking configured
- [ ] Analytics implemented
- [ ] SEO metadata added
- [ ] Performance monitoring enabled
- [ ] Security headers configured
