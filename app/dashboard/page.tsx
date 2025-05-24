"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadDashboardData} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your expense overview.</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Total Paid</p>
                  <p className="text-2xl font-bold text-emerald-900">₹{totalPaid.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Owed</p>
                  <p className="text-2xl font-bold text-orange-900">₹{totalOwed.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <ArrowDownRight className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-${netBalance >= 0 ? "green" : "red"}-200 bg-${netBalance >= 0 ? "green" : "red"}-50`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${netBalance >= 0 ? "green" : "red"}-600`}>Net Balance</p>
                  <p className={`text-2xl font-bold text-${netBalance >= 0 ? "green" : "red"}-900`}>
                    ₹{Math.abs(netBalance).toFixed(2)}
                  </p>
                </div>
                <div className={`p-3 bg-${netBalance >= 0 ? "green" : "red"}-100 rounded-full`}>
                  {netBalance >= 0 ? (
                    <TrendingUp className={`w-6 h-6 text-${netBalance >= 0 ? "green" : "red"}-600`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 text-${netBalance >= 0 ? "green" : "red"}-600`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Groups</p>
                  <p className="text-2xl font-bold text-blue-900">{groups.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="secondary">{group.member_count} members</Badge>
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">You paid:</span>
                        <span className="font-medium text-emerald-600">₹{Number(group.total_paid).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">You owe:</span>
                        <span className="font-medium text-orange-600">₹{Number(group.total_owed).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Net balance:</span>
                          <span
                            className={
                              Number(group.total_paid) - Number(group.total_owed) >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }
                          >
                            ₹{Math.abs(Number(group.total_paid) - Number(group.total_owed)).toFixed(2)}
                            {Number(group.total_paid) - Number(group.total_owed) >= 0 ? " (owed to you)" : " (you owe)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest expense activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-600">
                            {expense.group_name} • Paid by {expense.paid_by_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{Number(expense.amount).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {recentExpenses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No expenses yet. Add your first expense to get started!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settlements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Settlements</CardTitle>
                <CardDescription>Amounts you need to settle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>All settled up! No pending settlements.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
