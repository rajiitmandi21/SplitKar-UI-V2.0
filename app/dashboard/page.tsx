"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  IndianRupee,
  Plus,
  Users,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Repeat,
  MessageSquare,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Add at the top of the file
import { getUserBalance } from "@/lib/data/expenses"
import { getUserGroups } from "@/lib/data/groups"

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const router = useRouter()

  // Replace the static userBalance object with:
  const [userBalance, setUserBalance] = useState({
    youOwe: 0,
    youAreOwed: 0,
    netBalance: 0,
  })

  // Replace the static activeGroups array with:
  const [activeGroups, setActiveGroups] = useState([])

  // Add useEffect to load data:
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get current user ID (you'll need to implement authentication context)
        const currentUserId = getCurrentUserId() // Implement this function

        // Load user balance
        const balance = await getUserBalance(currentUserId)
        setUserBalance(balance)

        // Load user groups
        const groups = await getUserGroups(currentUserId)
        setActiveGroups(
          groups.map((group) => ({
            id: group.id,
            name: group.name,
            members: group.member_count,
            monthlySpend: 0, // You'll need to calculate this
            yourBalance: group.your_balance,
            avatar: getGroupAvatar(group.icon),
            recentActivity: "Loading...",
          })),
        )
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    loadDashboardData()
  }, [])

  // Helper function to get group avatar
  const getGroupAvatar = (icon: string) => {
    const iconMap = {
      home: "🏠",
      graduation: "🎓",
      briefcase: "💼",
      plane: "✈️",
      users: "👥",
    }
    return iconMap[icon] || "👥"
  }

  // Helper function to get current user ID (implement based on your auth system)
  const getCurrentUserId = () => {
    // This should come from your authentication context/session
    // For now, return a placeholder
    return "current-user-id"
  }

  const upcomingDues = [
    { name: "WiFi Bill", amount: 200, dueIn: 3, type: "days", urgent: false, id: "due1" },
    { name: "Room Rent", amount: 7500, dueIn: 1, type: "week", urgent: true, id: "due2" },
    { name: "Credit Card EMI", amount: 5000, dueIn: 2, type: "weeks", urgent: false, id: "due3" },
  ]

  const recentTransactions = [
    {
      id: "1",
      type: "expense",
      description: "Dinner at Cafe Coffee Day",
      amount: 480,
      group: "College Friends",
      date: "Today",
      status: "settled",
      paidBy: "You",
    },
    {
      id: "2",
      type: "payment",
      description: "WiFi Bill Settlement",
      amount: 200,
      group: "Flatmates",
      date: "Yesterday",
      status: "completed",
      paidTo: "Priya",
    },
    {
      id: "3",
      type: "expense",
      description: "Uber to Airport",
      amount: 350,
      group: "Office Team",
      date: "2 days ago",
      status: "pending",
      paidBy: "Amit",
    },
  ]

  const quickActions = [
    {
      icon: <Plus className="w-5 h-5" />,
      label: "Add Expense",
      color: "bg-teal-500",
      onClick: () => router.push("/expenses/add"),
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Create Group",
      color: "bg-indigo-500",
      onClick: () => router.push("/groups/create"),
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Send Nudge",
      color: "bg-orange-500",
      onClick: () => router.push("/nudges"),
    },
    {
      icon: <IndianRupee className="w-5 h-5" />,
      label: "Settle Up",
      color: "bg-green-500",
      onClick: () => router.push("/settle"),
    },
  ]

  const navigationCards = [
    {
      title: "Friends",
      description: "Manage your expense relationships",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      href: "/friends",
      count: "12 friends",
    },
    {
      title: "Groups",
      description: "View and manage your groups",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-500",
      href: "/groups",
      count: "4 active",
    },
    {
      title: "Recurring Bills",
      description: "Manage recurring payments",
      icon: <Repeat className="w-6 h-6" />,
      color: "bg-orange-500",
      href: "/recurring",
      count: "5 bills",
    },
    {
      title: "Analytics",
      description: "View spending insights",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-green-500",
      href: "/analytics",
      count: "This month",
    },
    {
      title: "Smart Nudges",
      description: "Send payment reminders",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-yellow-500",
      href: "/nudges",
      count: "AI-powered",
    },
    {
      title: "Notifications",
      description: "View all notifications",
      icon: <Bell className="w-6 h-6" />,
      color: "bg-red-500",
      href: "/notifications",
      count: "3 unread",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SplitKar</h1>
                <p className="text-sm text-gray-500">Welcome back, Rahul!</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </div>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/profile">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
                    RS
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Balance Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link href="/settle">
            <Card className="border-red-200 bg-red-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">You Owe</p>
                    <p className="text-2xl font-bold text-red-700">₹{userBalance.youOwe.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/friends">
            <Card className="border-green-200 bg-green-50 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">You're Owed</p>
                    <p className="text-2xl font-bold text-green-700">₹{userBalance.youAreOwed.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Net Balance</p>
                    <p
                      className={`text-2xl font-bold ${userBalance.netBalance < 0 ? "text-red-700" : "text-green-700"}`}
                    >
                      ₹{Math.abs(userBalance.netBalance).toLocaleString()}
                    </p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {navigationCards.map((card, index) => (
                <Link key={index} href={card.href}>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div
                      className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white mb-2`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm text-center">{card.title}</h3>
                    <p className="text-xs text-gray-500 text-center mt-1">{card.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Dues */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Upcoming Dues
              </CardTitle>
              <Link href="/recurring">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDues.map((due, index) => (
                <div
                  key={due.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => router.push("/settle")}
                >
                  <div className="flex items-center space-x-3">
                    {due.urgent ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{due.name}</p>
                      <p className="text-sm text-gray-500">
                        Due in {due.dueIn} {due.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{due.amount}</p>
                    <Button size="sm" variant="outline">
                      Settle Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Groups Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Groups</h2>
              <Link href="/groups/create">
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-indigo-500">
                  <Plus className="w-4 h-4 mr-1" />
                  New Group
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {activeGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push("/groups")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-indigo-100 rounded-lg flex items-center justify-center text-xl">
                          {group.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.members} members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${group.yourBalance < 0 ? "text-red-600" : "text-green-600"}`}>
                          {group.yourBalance < 0 ? "You owe" : "You're owed"} ₹{Math.abs(group.yourBalance)}
                        </p>
                        <p className="text-sm text-gray-500">Monthly: ₹{group.monthlySpend.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{group.recentActivity}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {group.yourBalance < 0 && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Settle
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex flex-col items-center p-4 h-auto hover:bg-gray-50 cursor-pointer"
                      onClick={action.onClick}
                    >
                      <div
                        className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white mb-2`}
                      >
                        {action.icon}
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "expense" ? "bg-orange-100" : "bg-green-100"
                          }`}
                        >
                          {transaction.type === "expense" ? (
                            <ArrowUpRight
                              className={`w-4 h-4 ${
                                transaction.status === "settled" ? "text-green-600" : "text-orange-600"
                              }`}
                            />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.group} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{transaction.amount}</p>
                        <Badge
                          variant={
                            transaction.status === "settled" || transaction.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-3 text-sm">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Smart Suggestions */}
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader>
                <CardTitle className="text-teal-800">Smart Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-teal-800">Simplify 3 debts in one payment</p>
                      <p className="text-xs text-teal-600">Save ₹50 in transaction fees</p>
                    </div>
                  </div>
                  <Link href="/settle">
                    <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                      Optimize Payments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Link href="/expenses/add">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 gap-1">
          <Button variant="ghost" className="flex flex-col items-center py-2 text-teal-600">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2" onClick={() => router.push("/groups")}>
            <Users className="w-5 h-5" />
            <span className="text-xs">Groups</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2" onClick={() => router.push("/friends")}>
            <IndianRupee className="w-5 h-5" />
            <span className="text-xs">Friends</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-2" onClick={() => router.push("/profile")}>
            <Settings className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
