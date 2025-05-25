"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import {
  User,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Crown,
  Shield,
  UserCheck,
  UserX,
  LogIn,
  TestTube,
  Eye,
} from "lucide-react"

import mockUsers from "@/data/mock-users.json"
import mockGroups from "@/data/mock-groups.json"
import mockExpenses from "@/data/mock-expenses.json"
import mockFriends from "@/data/mock-friends.json"

export default function DemoAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [isLogging, setIsLogging] = useState<string | null>(null)
  const { login, user } = useAuth()
  const router = useRouter()

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  if (!isMockMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Demo Mode Disabled</h2>
            <p className="text-gray-600 mb-4">This page is only available when mock data is enabled.</p>
            <p className="text-sm text-gray-500">
              Set NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=true to access demo accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDemoLogin = async (email: string, password: string, userId: string) => {
    setIsLogging(userId)
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Demo login failed:", error)
    } finally {
      setIsLogging(null)
    }
  }

  const getUserGroups = (userId: string) => {
    return mockGroups.groups.filter((group) => group.members.some((member) => member.user_id === userId))
  }

  const getUserExpenses = (userId: string) => {
    const userGroups = getUserGroups(userId)
    const groupIds = userGroups.map((g) => g.id)
    return mockExpenses.expenses.filter((expense) => groupIds.includes(expense.group_id))
  }

  const getUserFriends = (userId: string) => {
    return mockFriends.friends.filter((friend) => friend.user_id === userId)
  }

  const getAccountScenario = (user: any) => {
    const groups = getUserGroups(user.id)
    const expenses = getUserExpenses(user.id)
    const friends = getUserFriends(user.id)

    let scenario = ""
    if (user.role === "admin") {
      scenario = "Power User - Admin with multiple groups and high activity"
    } else if (user.stats.net_balance > 100) {
      scenario = "Creditor - Others owe money to this user"
    } else if (user.stats.net_balance < 0) {
      scenario = "Debtor - This user owes money to others"
    } else if (!user.is_verified) {
      scenario = "New User - Recently joined, limited activity"
    } else {
      scenario = "Regular User - Moderate activity and balanced expenses"
    }

    return {
      scenario,
      groups,
      expenses,
      friends,
      groupCount: groups.length,
      expenseCount: expenses.length,
      friendCount: friends.length,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <TestTube className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Demo Account Testing</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore different user scenarios with pre-configured demo accounts. Each account represents a different use
            case with unique data patterns, balances, and group memberships.
          </p>
          {user && (
            <Alert className="max-w-md mx-auto">
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                Currently logged in as <strong>{user.name}</strong>.
                <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockUsers.users.map((demoUser, index) => {
            const credentials = mockUsers.credentials[index]
            const accountData = getAccountScenario(demoUser)
            const isSelected = selectedAccount === demoUser.id
            const isCurrentUser = user?.id === demoUser.id

            return (
              <Card
                key={demoUser.id}
                className={`transition-all duration-200 ${
                  isSelected ? "ring-2 ring-purple-500 shadow-lg" : "hover:shadow-md"
                } ${isCurrentUser ? "bg-green-50 border-green-200" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={demoUser.avatar_url || "/placeholder.svg"}
                        alt={demoUser.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {demoUser.name}
                          {demoUser.role === "admin" && <Crown className="w-4 h-4 text-yellow-500" />}
                          {!demoUser.is_verified && <UserX className="w-4 h-4 text-red-500" />}
                          {isCurrentUser && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{demoUser.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={demoUser.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {demoUser.role}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Scenario Description */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Scenario:</p>
                    <p className="text-sm text-gray-600">{accountData.scenario}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{accountData.groupCount}</div>
                      <div className="text-xs text-gray-600">Groups</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <div className="text-sm font-medium">{accountData.expenseCount}</div>
                      <div className="text-xs text-gray-600">Expenses</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <User className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                      <div className="text-sm font-medium">{accountData.friendCount}</div>
                      <div className="text-xs text-gray-600">Friends</div>
                    </div>
                    <div
                      className={`text-center p-2 rounded ${
                        demoUser.stats.net_balance >= 0 ? "bg-emerald-50" : "bg-red-50"
                      }`}
                    >
                      {demoUser.stats.net_balance >= 0 ? (
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mx-auto mb-1 text-red-600" />
                      )}
                      <div className="text-sm font-medium">₹{Math.abs(demoUser.stats.net_balance).toFixed(2)}</div>
                      <div className="text-xs text-gray-600">{demoUser.stats.net_balance >= 0 ? "Owed" : "Owes"}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={isSelected ? "secondary" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedAccount(isSelected ? null : demoUser.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isSelected ? "Hide Details" : "View Details"}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDemoLogin(credentials.email, credentials.password, demoUser.id)}
                      disabled={isLogging === demoUser.id || isCurrentUser}
                    >
                      {isLogging === demoUser.id ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                          Logging in...
                        </>
                      ) : isCurrentUser ? (
                        "Current User"
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-1" />
                          Login as {demoUser.name.split(" ")[0]}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Detailed View */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t">
                      <Tabs defaultValue="groups" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="groups">Groups</TabsTrigger>
                          <TabsTrigger value="expenses">Expenses</TabsTrigger>
                          <TabsTrigger value="friends">Friends</TabsTrigger>
                        </TabsList>

                        <TabsContent value="groups" className="space-y-2">
                          {accountData.groups.length > 0 ? (
                            accountData.groups.map((group) => (
                              <div key={group.id} className="p-2 bg-white rounded border text-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{group.name}</div>
                                    <div className="text-xs text-gray-500">{group.member_count} members</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500">Balance</div>
                                    <div
                                      className={`text-sm font-medium ${
                                        group.user_balance >= 0 ? "text-green-600" : "text-red-600"
                                      }`}
                                    >
                                      ₹{Math.abs(group.user_balance).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No groups yet</p>
                          )}
                        </TabsContent>

                        <TabsContent value="expenses" className="space-y-2">
                          {accountData.expenses.length > 0 ? (
                            accountData.expenses.slice(0, 3).map((expense) => (
                              <div key={expense.id} className="p-2 bg-white rounded border text-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{expense.description}</div>
                                    <div className="text-xs text-gray-500">{expense.category}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">₹{expense.amount.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(expense.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No expenses yet</p>
                          )}
                          {accountData.expenses.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{accountData.expenses.length - 3} more expenses
                            </p>
                          )}
                        </TabsContent>

                        <TabsContent value="friends" className="space-y-2">
                          {accountData.friends.length > 0 ? (
                            accountData.friends.map((friend) => {
                              const friendUser = mockUsers.users.find((u) => u.id === friend.friend_id)
                              return (
                                <div key={friend.id} className="p-2 bg-white rounded border text-sm">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={friendUser?.avatar_url || "/placeholder.svg"}
                                      alt={friendUser?.name || "Friend"}
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium">{friendUser?.name || "Unknown"}</div>
                                      <div className="text-xs text-gray-500">
                                        Friends since {new Date(friend.created_at).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No friends yet</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}

                  {/* Login Credentials */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Login:</strong> {credentials.email} / {credentials.password}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Testing Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Scenarios</CardTitle>
            <CardDescription>
              Each demo account is designed to test specific functionality and user flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">User Experience Testing:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>John Doe:</strong> Positive balance, multiple groups
                  </li>
                  <li>
                    • <strong>Jane Smith:</strong> Negative balance, debt scenarios
                  </li>
                  <li>
                    • <strong>Mike Wilson:</strong> New user onboarding flow
                  </li>
                  <li>
                    • <strong>Sarah Johnson:</strong> Admin privileges and management
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Feature Testing:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Group creation and management</li>
                  <li>• Expense splitting and calculations</li>
                  <li>• Friend relationships and invitations</li>
                  <li>• Role-based access control</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => router.push("/demo")}>
              View All Demo Data
            </Button>
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Back to Login
            </Button>
            {user && <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
