"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  Settings,
  Home,
  Download,
  Share,
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedTab, setSelectedTab] = useState("overview")

  const monthlyData = {
    totalSpent: 18500,
    totalReceived: 16200,
    netBalance: -2300,
    transactions: 45,
    avgPerTransaction: 411,
    topCategory: "Food & Dining",
    savingsGoal: 20000,
    currentSavings: 15600,
  }

  const categoryBreakdown = [
    { name: "Food & Dining", amount: 6800, percentage: 37, color: "bg-orange-500" },
    { name: "Transport", amount: 4200, percentage: 23, color: "bg-blue-500" },
    { name: "Home & Utilities", amount: 3800, percentage: 21, color: "bg-green-500" },
    { name: "Entertainment", amount: 2100, percentage: 11, color: "bg-purple-500" },
    { name: "Shopping", amount: 1600, percentage: 8, color: "bg-pink-500" },
  ]

  const groupSpending = [
    { name: "Flatmates", amount: 12500, transactions: 18, avgPerPerson: 3125 },
    { name: "College Friends", amount: 3200, transactions: 12, avgPerPerson: 533 },
    { name: "Office Team", amount: 2800, transactions: 8, avgPerPerson: 350 },
  ]

  const monthlyTrends = [
    { month: "Jan", spent: 15200, received: 14800 },
    { month: "Feb", spent: 16800, received: 15900 },
    { month: "Mar", spent: 18500, received: 16200 },
    { month: "Apr", spent: 17200, received: 17800 },
  ]

  const insights = [
    {
      type: "warning",
      title: "High Food Spending",
      description: "You've spent 23% more on food this month compared to last month",
      action: "Set a food budget",
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    },
    {
      type: "success",
      title: "Great Settlement Rate",
      description: "You've settled 87% of your expenses within 7 days",
      action: "Keep it up!",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      type: "info",
      title: "Savings Goal Progress",
      description: "You're 78% towards your monthly savings goal",
      action: "Reduce dining out",
      icon: <Target className="w-5 h-5 text-blue-500" />,
    },
  ]

  const exportData = () => {
    alert("Exporting your expense data...")
  }

  const shareReport = () => {
    alert("Sharing monthly report...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500">Your spending insights and trends</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-blue-700">₹{monthlyData.totalSpent.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Received</p>
                  <p className="text-2xl font-bold text-green-700">₹{monthlyData.totalReceived.toLocaleString()}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Net Balance</p>
                  <p className="text-2xl font-bold text-red-700">
                    ₹{Math.abs(monthlyData.netBalance).toLocaleString()}
                  </p>
                </div>
                <IndianRupee className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Transactions</p>
                  <p className="text-2xl font-bold text-purple-700">{monthlyData.transactions}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Savings Goal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    Savings Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold">
                        ₹{monthlyData.currentSavings.toLocaleString()} / ₹{monthlyData.savingsGoal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(monthlyData.currentSavings / monthlyData.savingsGoal) * 100} className="h-3" />
                    <p className="text-sm text-gray-500">
                      {Math.round((monthlyData.currentSavings / monthlyData.savingsGoal) * 100)}% of your monthly goal
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg per Transaction</span>
                    <span className="font-bold">₹{monthlyData.avgPerTransaction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top Category</span>
                    <Badge variant="outline">{monthlyData.topCategory}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Settlement Rate</span>
                    <span className="font-bold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Groups</span>
                    <span className="font-bold">{groupSpending.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Spent</p>
                          <p className="font-bold text-red-600">₹{month.spent.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Received</p>
                          <p className="font-bold text-green-600">₹{month.received.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Net</p>
                          <p
                            className={`font-bold ${
                              month.spent - month.received > 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            ₹{Math.abs(month.spent - month.received).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-orange-500" />
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="font-bold">₹{category.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={category.percentage} className="flex-1 h-2" />
                        <span className="text-sm text-gray-500 w-12">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="space-y-4">
              {groupSpending.map((group) => (
                <Card key={group.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{group.name}</h3>
                      <Badge variant="outline">{group.transactions} transactions</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-bold text-gray-900">₹{group.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Avg per Person</p>
                        <p className="font-bold text-gray-900">₹{group.avgPerPerson}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Your Share</p>
                        <p className="font-bold text-gray-900">₹{Math.round(group.amount / 4).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{insight.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{insight.title}</h3>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        <Button size="sm" variant="outline">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Export Options */}
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader>
                <CardTitle className="text-teal-800">Export & Share</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-white hover:bg-teal-100" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data (CSV)
                </Button>
                <Button variant="outline" className="w-full bg-white hover:bg-teal-100" onClick={shareReport}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Monthly Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 gap-1">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/groups">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Users className="w-5 h-5" />
              <span className="text-xs">Groups</span>
            </Button>
          </Link>
          <Link href="/friends">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <IndianRupee className="w-5 h-5" />
              <span className="text-xs">Friends</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
