"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Group {
  id: string
  name: string
  description: string
  member_count: number
  total_expenses: number
  user_balance: number
  created_at: string
}

export default function Dashboard() {
  const { user, stats, logout } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadGroups()
    }
  }, [user])

  const loadGroups = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getUserGroups()
      setGroups(response.groups || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to continue</h2>
          <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Here's your expense overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/profile")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Active Groups</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats?.total_groups || 0}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Friends</p>
                  <p className="text-2xl font-bold text-blue-900">{stats?.total_friends || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-orange-900">{stats?.total_expenses || 0}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-200 bg-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-50`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-600`}>
                    Net Balance
                  </p>
                  <p className={`text-2xl font-bold text-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-900`}>
                    ₹{Math.abs(stats?.net_balance || 0).toFixed(2)}
                  </p>
                </div>
                <div className={`p-3 bg-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-100 rounded-full`}>
                  {(stats?.net_balance || 0) >= 0 ? (
                    <TrendingUp className={`w-6 h-6 text-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-600`} />
                  ) : (
                    <TrendingDown className={`w-6 h-6 text-${(stats?.net_balance || 0) >= 0 ? "green" : "red"}-600`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadGroups} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Groups</h2>
              <Button onClick={() => router.push("/groups/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/groups/${group.id}`)}
                >
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
                        <span className="text-gray-600">Total expenses:</span>
                        <span className="font-medium">₹{Number(group.total_expenses).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Your balance:</span>
                        <span className={`font-medium ${group.user_balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ₹{Math.abs(group.user_balance).toFixed(2)}
                          {group.user_balance >= 0 ? " (owed to you)" : " (you owe)"}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {groups.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
                  <p className="text-gray-600 mb-4">Create your first group to start splitting expenses</p>
                  <Button onClick={() => router.push("/groups/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest expense activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No expenses yet. Add your first expense to get started!</p>
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
                  <ArrowUpRight className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
