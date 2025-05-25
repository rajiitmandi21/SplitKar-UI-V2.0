"use client"

import { useState, useEffect } from "react"
import { MaterialCard, MaterialCardContent, MaterialCardDescription, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { MaterialButton } from "@/components/ui/material-button"
import { SplitKarLogo } from "@/components/ui/splitkar-logo"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Filter,
  Search,
  Calendar,
  PieChart,
  BarChart3,
  Activity,
  Wallet,
  CreditCard,
  Settings,
  Bell,
  User
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Group {
  id: string
  name: string
  description: string
  member_count: number
  total_paid: number
  total_owed: number
  created_at: string
}

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  paid_by_name: string
  group_name: string
  splits: Array<{
    user_id: string
    amount: number
    user_name: string
  }>
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user ID - in real app, get from auth context
  const currentUserId = "user-1"

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiClient.getDashboardData(currentUserId)
      setGroups(data.groups)
      setExpenses(data.expenses)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      console.error("Dashboard data error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const totalOwed = groups.reduce((sum, group) => sum + Number(group.total_owed), 0)
  const totalPaid = groups.reduce((sum, group) => sum + Number(group.total_paid), 0)
  const netBalance = totalPaid - totalOwed
  const recentExpenses = expenses.slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-8 bg-surface-container dark:bg-surface-container-dark rounded w-48"></div>
                <div className="h-4 bg-surface-container dark:bg-surface-container-dark rounded w-64"></div>
              </div>
              <div className="h-10 bg-surface-container dark:bg-surface-container-dark rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <MaterialCard key={i} elevation={2} className="p-6 border-0">
                  <div className="h-20 bg-surface-container dark:bg-surface-container-dark rounded"></div>
                </MaterialCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark p-6">
        <div className="max-w-7xl mx-auto">
          <MaterialCard elevation={3} className="border-0 bg-error-container dark:bg-error-container-dark">
            <MaterialCardContent className="p-8">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-error dark:text-error-dark mx-auto" />
                <h2 className="text-xl font-semibold text-on-error-container dark:text-on-error-container-dark">Error Loading Dashboard</h2>
                <p className="text-on-error-container dark:text-on-error-container-dark">{error}</p>
                <MaterialButton onClick={loadDashboardData} variant="outlined" className="border-error dark:border-error-dark text-error dark:text-error-dark">
                  Try Again
                </MaterialButton>
              </div>
            </MaterialCardContent>
          </MaterialCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Enhanced Header */}
      <header className="bg-surface-container dark:bg-surface-container-dark border-b border-outline-variant dark:border-outline-variant-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-on-surface dark:text-on-surface-dark font-poppins">Dashboard</h1>
                <Badge className="bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark border-0">
                  Welcome back!
                </Badge>
              </div>
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
                Here's your expense overview and recent activity
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <MaterialButton variant="outlined" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </MaterialButton>
              <MaterialButton variant="outlined" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                This Month
              </MaterialButton>
              <ThemeToggle />
              <MaterialButton variant="text" size="sm">
                <Bell className="w-5 h-5" />
              </MaterialButton>
              <MaterialButton variant="text" size="sm">
                <User className="w-5 h-5" />
              </MaterialButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/expenses/add">
            <MaterialButton variant="filled" size="md" elevation={2}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </MaterialButton>
          </Link>
          <Link href="/groups/create">
            <MaterialButton variant="outlined" size="md">
              <Users className="w-4 h-4 mr-2" />
              Create Group
            </MaterialButton>
          </Link>
          <MaterialButton variant="tonal" size="md">
            <PieChart className="w-4 h-4 mr-2" />
            Analytics
          </MaterialButton>
          <MaterialButton variant="text" size="md">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </MaterialButton>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MaterialCard elevation={3} className="border-0 bg-gradient-to-br from-success-500/10 to-success-600/5 dark:from-success-500/20 dark:to-success-600/10">
            <MaterialCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-success-700 dark:text-success-400">Total Paid</p>
                  <p className="text-3xl font-bold text-success-900 dark:text-success-300">₹{totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-success-600 dark:text-success-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-500/20 dark:bg-success-500/30 rounded-2xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
              </div>
            </MaterialCardContent>
          </MaterialCard>

          <MaterialCard elevation={3} className="border-0 bg-gradient-to-br from-warning-500/10 to-warning-600/5 dark:from-warning-500/20 dark:to-warning-600/10">
            <MaterialCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-warning-700 dark:text-warning-400">Total Owed</p>
                  <p className="text-3xl font-bold text-warning-900 dark:text-warning-300">₹{totalOwed.toFixed(2)}</p>
                  <p className="text-xs text-warning-600 dark:text-warning-500 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-500/20 dark:bg-warning-500/30 rounded-2xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                </div>
              </div>
            </MaterialCardContent>
          </MaterialCard>

          <MaterialCard elevation={3} className={cn(
            "border-0",
            netBalance >= 0 
              ? "bg-gradient-to-br from-primary-container-light/50 to-primary-container-light/20 dark:from-primary-container-dark/50 dark:to-primary-container-dark/20"
              : "bg-gradient-to-br from-error-container/50 to-error-container/20 dark:from-error-container-dark/50 dark:to-error-container-dark/20"
          )}>
            <MaterialCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className={cn(
                    "text-sm font-medium",
                    netBalance >= 0 
                      ? "text-primary-light dark:text-primary-dark" 
                      : "text-error dark:text-error-dark"
                  )}>
                    Net Balance
                  </p>
                  <p className={cn(
                    "text-3xl font-bold",
                    netBalance >= 0 
                      ? "text-primary-light dark:text-primary-dark" 
                      : "text-error dark:text-error-dark"
                  )}>
                    {netBalance >= 0 ? "+" : "-"}₹{Math.abs(netBalance).toFixed(2)}
                  </p>
                  <p className={cn(
                    "text-xs flex items-center",
                    netBalance >= 0 
                      ? "text-primary-light/70 dark:text-primary-dark/70" 
                      : "text-error/70 dark:text-error-dark/70"
                  )}>
                    {netBalance >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        You're owed money
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 mr-1" />
                        You owe money
                      </>
                    )}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  netBalance >= 0 
                    ? "bg-primary-light/20 dark:bg-primary-dark/30" 
                    : "bg-error/20 dark:bg-error-dark/30"
                )}>
                  {netBalance >= 0 ? (
                    <Wallet className={cn("w-6 h-6", "text-primary-light dark:text-primary-dark")} />
                  ) : (
                    <CreditCard className={cn("w-6 h-6", "text-error dark:text-error-dark")} />
                  )}
                </div>
              </div>
            </MaterialCardContent>
          </MaterialCard>

          <MaterialCard elevation={3} className="border-0 bg-gradient-to-br from-secondary-container/50 to-secondary-container/20 dark:from-secondary-container-dark/50 dark:to-secondary-container-dark/20">
            <MaterialCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-secondary-light dark:text-secondary">Active Groups</p>
                  <p className="text-3xl font-bold text-secondary-light dark:text-secondary">{groups.length}</p>
                  <p className="text-xs text-secondary-light/70 dark:text-secondary/70 flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    {groups.filter(g => g.member_count > 1).length} with activity
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-light/20 dark:bg-secondary/30 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-light dark:text-secondary" />
                </div>
              </div>
            </MaterialCardContent>
          </MaterialCard>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-surface-container dark:bg-surface-container-dark p-1.5 rounded-2xl h-14">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="expenses"
              className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="groups"
              className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Expenses */}
              <div className="lg:col-span-2">
                <MaterialCard elevation={3} className="border-0">
                  <MaterialCardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <MaterialCardTitle className="text-xl text-on-surface dark:text-on-surface-dark">Recent Expenses</MaterialCardTitle>
                        <MaterialCardDescription>Your latest transactions and splits</MaterialCardDescription>
                      </div>
                      <MaterialButton variant="text" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </MaterialButton>
                    </div>
                  </MaterialCardHeader>
                  <MaterialCardContent className="space-y-4">
                    {recentExpenses.length > 0 ? (
                      recentExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-4 bg-surface-container-highest dark:bg-surface-container-highest-dark rounded-xl hover:bg-surface-container dark:hover:bg-surface-container-dark transition-colors duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-container-light dark:bg-primary-container-dark rounded-2xl flex items-center justify-center">
                              <IndianRupee className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface dark:text-on-surface-dark">{expense.description}</p>
                              <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                                {expense.group_name} • Paid by {expense.paid_by_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-on-surface dark:text-on-surface-dark">₹{expense.amount.toFixed(2)}</p>
                            <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <IndianRupee className="w-12 h-12 text-on-surface-variant dark:text-on-surface-variant-dark mx-auto mb-4" />
                        <p className="text-on-surface-variant dark:text-on-surface-variant-dark">No expenses yet</p>
                        <MaterialButton variant="text" className="mt-2">
                          Add your first expense
                        </MaterialButton>
                      </div>
                    )}
                  </MaterialCardContent>
                </MaterialCard>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <MaterialCard elevation={3} className="border-0">
                  <MaterialCardHeader>
                    <MaterialCardTitle className="text-lg text-on-surface dark:text-on-surface-dark">Quick Stats</MaterialCardTitle>
                  </MaterialCardHeader>
                  <MaterialCardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant dark:text-on-surface-variant-dark">This Month</span>
                      <span className="font-semibold text-on-surface dark:text-on-surface-dark">₹{(totalPaid + totalOwed).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant dark:text-on-surface-variant-dark">Avg per expense</span>
                      <span className="font-semibold text-on-surface dark:text-on-surface-dark">
                        ₹{expenses.length > 0 ? (expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant dark:text-on-surface-variant-dark">Total transactions</span>
                      <span className="font-semibold text-on-surface dark:text-on-surface-dark">{expenses.length}</span>
                    </div>
                  </MaterialCardContent>
                </MaterialCard>

                <MaterialCard elevation={3} className="border-0 bg-gradient-to-br from-tertiary-container to-tertiary-container/50 dark:from-tertiary-container-dark dark:to-tertiary-container-dark/50">
                  <MaterialCardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-tertiary dark:text-tertiary-dark mx-auto mb-4" />
                    <h3 className="font-semibold text-on-tertiary-container dark:text-on-tertiary-container-dark mb-2">
                      Spending Insights
                    </h3>
                    <p className="text-sm text-on-tertiary-container dark:text-on-tertiary-container-dark mb-4">
                      Get detailed analytics of your spending patterns
                    </p>
                    <MaterialButton variant="filled" size="sm" className="bg-tertiary dark:bg-tertiary-dark text-on-tertiary dark:text-on-tertiary-dark">
                      View Analytics
                    </MaterialButton>
                  </MaterialCardContent>
                </MaterialCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6 mt-8">
            <MaterialCard elevation={3} className="border-0">
              <MaterialCardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <MaterialCardTitle className="text-xl text-on-surface dark:text-on-surface-dark">All Expenses</MaterialCardTitle>
                    <MaterialCardDescription>Complete list of your expenses and splits</MaterialCardDescription>
                  </div>
                  <MaterialButton variant="outlined">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </MaterialButton>
                </div>
              </MaterialCardHeader>
              <MaterialCardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-surface-container-highest dark:bg-surface-container-highest-dark rounded-xl hover:bg-surface-container dark:hover:bg-surface-container-dark transition-colors duration-200 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-container-light dark:bg-primary-container-dark rounded-2xl flex items-center justify-center">
                          <IndianRupee className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface dark:text-on-surface-dark">{expense.description}</p>
                          <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                            {expense.group_name} • {expense.category}
                          </p>
                          <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">
                            Paid by {expense.paid_by_name} on {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-on-surface dark:text-on-surface-dark">₹{expense.amount.toFixed(2)}</p>
                        <Badge className="bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark border-0">
                          {expense.splits.length} splits
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </MaterialCardContent>
            </MaterialCard>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <MaterialCard key={group.id} elevation={3} className="border-0 hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <MaterialCardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-on-surface dark:text-on-surface-dark">{group.name}</h3>
                        <Badge className="bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark border-0">
                          {group.member_count} members
                        </Badge>
                      </div>
                      <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">{group.description}</p>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">You paid</p>
                          <p className="font-semibold text-success-600 dark:text-success-400">₹{group.total_paid.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">You owe</p>
                          <p className="font-semibold text-warning-600 dark:text-warning-400">₹{group.total_owed.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </MaterialCardContent>
                </MaterialCard>
              ))}
              
              {/* Add Group Card */}
              <MaterialCard elevation={2} className="border-2 border-dashed border-outline dark:border-outline-dark bg-surface-container dark:bg-surface-container-dark hover:bg-surface-container-high dark:hover:bg-surface-container-high-dark transition-colors duration-200 cursor-pointer">
                <MaterialCardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary-container-light dark:bg-primary-container-dark rounded-2xl mx-auto flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface dark:text-on-surface-dark mb-2">Create New Group</h3>
                      <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">Start splitting expenses with friends</p>
                    </div>
                  </div>
                </MaterialCardContent>
              </MaterialCard>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <MaterialCard elevation={3} className="border-0">
                <MaterialCardHeader>
                  <MaterialCardTitle className="text-xl text-on-surface dark:text-on-surface-dark">Spending by Category</MaterialCardTitle>
                  <MaterialCardDescription>Your expense breakdown this month</MaterialCardDescription>
                </MaterialCardHeader>
                <MaterialCardContent className="text-center py-12">
                  <PieChart className="w-16 h-16 text-on-surface-variant dark:text-on-surface-variant-dark mx-auto mb-4" />
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark">Analytics coming soon</p>
                </MaterialCardContent>
              </MaterialCard>

              <MaterialCard elevation={3} className="border-0">
                <MaterialCardHeader>
                  <MaterialCardTitle className="text-xl text-on-surface dark:text-on-surface-dark">Monthly Trends</MaterialCardTitle>
                  <MaterialCardDescription>Your spending patterns over time</MaterialCardDescription>
                </MaterialCardHeader>
                <MaterialCardContent className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-on-surface-variant dark:text-on-surface-variant-dark mx-auto mb-4" />
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark">Charts coming soon</p>
                </MaterialCardContent>
              </MaterialCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
