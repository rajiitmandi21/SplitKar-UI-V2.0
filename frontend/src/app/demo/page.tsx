"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users, Receipt, UserPlus, TestTube, LogIn, Loader2 } from "lucide-react"
import Link from "next/link"

// Define types for mock data
interface MockUser {
  id: string
  name: string
  email: string
  balance: number
  upiId: string
  role: string
  isVerified: boolean
}

interface MockGroup {
  id: string
  name: string
  description: string
  memberIds: string[]
  totalExpenses: number
  createdAt: string
  category: string
}

interface MockExpense {
  id: string
  description: string
  paidBy: string
  amount: number
  category: string
  splitType: string
  date: string
  participants: string[]
}

interface MockFriend {
  id: string
  friendId: string
  status: string
  createdAt: string
}

export default function DemoPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [mockData, setMockData] = useState<{
    users: MockUser[]
    groups: MockGroup[]
    expenses: MockExpense[]
    friends: MockFriend[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  useEffect(() => {
    // Load mock data dynamically to avoid SSR issues
    const loadMockData = async () => {
      try {
        const [usersRes, groupsRes, expensesRes, friendsRes] = await Promise.all([
          import("@/data/mock-users.json"),
          import("@/data/mock-groups.json"),
          import("@/data/mock-expenses.json"),
          import("@/data/mock-friends.json"),
        ])

        setMockData({
          users: usersRes.default || [],
          groups: groupsRes.default || [],
          expenses: expensesRes.default || [],
          friends: friendsRes.default || [],
        })
      } catch (error) {
        console.error("Failed to load mock data:", error)
        // Set empty arrays as fallback
        setMockData({
          users: [],
          groups: [],
          expenses: [],
          friends: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadMockData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading demo data...</p>
        </div>
      </div>
    )
  }

  if (!mockData) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to load demo data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const { users, groups, expenses, friends } = mockData

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">SplitKar Demo</h1>
        <p className="text-muted-foreground">Explore the app with realistic demo data</p>
        {isMockMode && (
          <Badge variant="secondary" className="text-sm">
            <TestTube className="w-4 h-4 mr-1" />
            Mock Mode Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="groups">Groups ({groups.length})</TabsTrigger>
          <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
          <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => (
              <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className={user.balance >= 0 ? "text-green-600" : "text-red-600"}>
                        ₹{Math.abs(user.balance).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>UPI ID:</span>
                      <span className="text-sm text-muted-foreground">{user.upiId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role:</span>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={user.isVerified ? "default" : "destructive"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <Link href="/auth/login">
                      <Button className="w-full mt-3" size="sm">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login as {user.name.split(" ")[0]}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Members:</span>
                      <span>{group.memberIds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expenses:</span>
                      <span>₹{group.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {group.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{expense.description}</CardTitle>
                        <CardDescription>
                          Paid by {users.find((u) => u.id === expense.paidBy)?.name || "Unknown"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{expense.amount.toFixed(2)}</div>
                      <Badge variant="outline">{expense.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Split Type:</span>
                      <Badge variant="secondary">{expense.splitType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span>{expense.participants.length} people</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {friends.map((friendship) => (
              <Card key={friendship.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {users.find((u) => u.id === friendship.friendId)?.name || "Unknown"}
                      </CardTitle>
                      <CardDescription>
                        {users.find((u) => u.id === friendship.friendId)?.email || "No email"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={friendship.status === "accepted" ? "default" : "secondary"}>
                        {friendship.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Since:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(friendship.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-4">
        <Link href="/demo/accounts">
          <Button size="lg">
            <TestTube className="w-4 h-4 mr-2" />
            Test Demo Accounts
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">Click above to interactively test different user scenarios</p>
      </div>
    </div>
  )
}
