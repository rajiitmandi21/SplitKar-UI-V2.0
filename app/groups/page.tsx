"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  IndianRupee,
  ArrowLeft,
  Search,
  Plus,
  Users,
  Calendar,
  Settings,
  MoreVertical,
  Home,
  GraduationCap,
  Briefcase,
  Plane,
  Bell,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const groups = [
    {
      id: "1",
      name: "Flatmates",
      description: "Apartment expenses and bills",
      icon: <Home className="w-6 h-6" />,
      color: "bg-green-500",
      members: [
        { name: "You", avatar: "Y", balance: -1200 },
        { name: "Priya", avatar: "P", balance: 400 },
        { name: "Amit", avatar: "A", balance: 300 },
        { name: "Sneha", avatar: "S", balance: 500 },
      ],
      totalExpenses: 25600,
      monthlyBudget: 30000,
      yourBalance: -1200,
      recentActivity: "WiFi bill added 2 hours ago",
      upcomingBills: [
        { name: "Rent", amount: 15000, dueDate: "5 days" },
        { name: "Electricity", amount: 1200, dueDate: "1 week" },
      ],
      currency: "₹",
    },
    {
      id: "2",
      name: "College Friends",
      description: "Hangouts and fun activities",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-blue-500",
      members: [
        { name: "You", avatar: "Y", balance: 450 },
        { name: "Rohan", avatar: "R", balance: -200 },
        { name: "Kavya", avatar: "K", balance: -150 },
        { name: "Arjun", avatar: "A", balance: -100 },
      ],
      totalExpenses: 8900,
      monthlyBudget: 10000,
      yourBalance: 450,
      recentActivity: "Pizza night settled",
      upcomingBills: [],
      currency: "₹",
    },
    {
      id: "3",
      name: "Office Team",
      description: "Work lunches and team events",
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-purple-500",
      members: [
        { name: "You", avatar: "Y", balance: -300 },
        { name: "Rajesh", avatar: "R", balance: 150 },
        { name: "Anita", avatar: "A", balance: 100 },
        { name: "Vikram", avatar: "V", balance: 50 },
      ],
      totalExpenses: 12400,
      monthlyBudget: 15000,
      yourBalance: -300,
      recentActivity: "Team lunch pending",
      upcomingBills: [{ name: "Monthly Team Lunch", amount: 2000, dueDate: "3 days" }],
      currency: "₹",
    },
    {
      id: "4",
      name: "Goa Trip 2024",
      description: "Beach vacation with friends",
      icon: <Plane className="w-6 h-6" />,
      color: "bg-indigo-500",
      members: [
        { name: "You", avatar: "Y", balance: 0 },
        { name: "Priya", avatar: "P", balance: 0 },
        { name: "Amit", avatar: "A", balance: 0 },
        { name: "Sneha", avatar: "S", balance: 0 },
        { name: "Rohan", avatar: "R", balance: 0 },
      ],
      totalExpenses: 45000,
      monthlyBudget: 50000,
      yourBalance: 0,
      recentActivity: "All expenses settled",
      upcomingBills: [],
      currency: "₹",
    },
  ]

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedGroupData = groups.find((g) => g.id === selectedGroup)

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600"
    if (balance < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getBudgetProgress = (expenses: number, budget: number) => {
    return Math.min((expenses / budget) * 100, 100)
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
                <h1 className="text-xl font-bold text-gray-900">Groups</h1>
                <p className="text-sm text-gray-500">Manage your expense groups</p>
              </div>
            </div>
            <Link href="/groups/create">
              <Button className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups by name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Groups Grid */}
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedGroup === group.id ? "ring-2 ring-teal-500 bg-teal-50" : ""
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 ${group.color} rounded-lg flex items-center justify-center text-white`}
                        >
                          {group.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{group.members.length} members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getBalanceColor(group.yourBalance)}`}>
                          {group.yourBalance === 0
                            ? "All settled"
                            : `${group.yourBalance < 0 ? "You owe" : "You're owed"} ${group.currency}${Math.abs(
                                group.yourBalance,
                              )}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {group.currency}
                          {group.totalExpenses.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Monthly Budget</span>
                        <span className="text-gray-600">
                          {group.currency}
                          {group.totalExpenses.toLocaleString()} / {group.currency}
                          {group.monthlyBudget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getBudgetProgress(group.totalExpenses, group.monthlyBudget)} className="h-2" />
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map((member, index) => (
                          <Avatar key={index} className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.members.length > 4 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{group.members.length - 4}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Expense
                        </Button>
                        {group.yourBalance !== 0 && (
                          <Button
                            size="sm"
                            className={
                              group.yourBalance < 0 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                            }
                          >
                            <IndianRupee className="w-3 h-3 mr-1" />
                            Settle
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">{group.recentActivity}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Group Details Sidebar */}
          <div className="space-y-6">
            {selectedGroupData ? (
              <>
                {/* Group Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 ${selectedGroupData.color} rounded-lg flex items-center justify-center text-white`}
                        >
                          {selectedGroupData.icon}
                        </div>
                        <div>
                          <p className="font-bold">{selectedGroupData.name}</p>
                          <p className="text-sm text-gray-500 font-normal">{selectedGroupData.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Total Expenses</p>
                        <p className="font-bold text-gray-900">
                          {selectedGroupData.currency}
                          {selectedGroupData.totalExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="font-bold text-gray-900">{selectedGroupData.members.length}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link href={`/expenses/add?group=${selectedGroupData.id}`}>
                        <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expense
                        </Button>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-1" />
                          Members
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Members List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedGroupData.members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                          <span className={`text-sm font-bold ${getBalanceColor(member.balance)}`}>
                            {member.balance === 0
                              ? "Settled"
                              : `${selectedGroupData.currency}${Math.abs(member.balance)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Bills */}
                {selectedGroupData.upcomingBills.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Upcoming Bills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedGroupData.upcomingBills.map((bill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="w-5 h-5 text-orange-500" />
                              <div>
                                <p className="font-medium text-gray-900">{bill.name}</p>
                                <p className="text-sm text-gray-500">Due in {bill.dueDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {selectedGroupData.currency}
                                {bill.amount}
                              </p>
                              <Button size="sm" variant="outline">
                                Add Now
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="border-teal-200 bg-teal-50">
                  <CardHeader>
                    <CardTitle className="text-teal-800">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full bg-white hover:bg-teal-100">
                      <Bell className="w-4 h-4 mr-2" />
                      Send Group Reminder
                    </Button>
                    <Button variant="outline" className="w-full bg-white hover:bg-teal-100">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Settle All Debts
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Select a Group</h3>
                  <p className="text-sm text-gray-500">
                    Choose a group from the list to view details and manage expenses
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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
          <Button variant="ghost" className="flex flex-col items-center py-2 text-teal-600">
            <Users className="w-5 h-5" />
            <span className="text-xs">Groups</span>
          </Button>
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
