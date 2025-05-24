"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  IndianRupee,
  ArrowLeft,
  Plus,
  Calendar,
  Bell,
  Home,
  Wifi,
  Zap,
  Car,
  Phone,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function RecurringPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    dueDate: "",
    category: "home",
    group: "",
    autoReminder: true,
    splitEqually: true,
  })

  const recurringBills = [
    {
      id: "1",
      name: "Room Rent",
      amount: 15000,
      frequency: "Monthly",
      nextDue: "5 days",
      category: "home",
      icon: <Home className="w-5 h-5" />,
      color: "bg-green-500",
      group: "Flatmates",
      members: ["You", "Priya", "Amit", "Sneha"],
      yourShare: 3750,
      status: "active",
      autoReminder: true,
      lastPaid: "Last month",
    },
    {
      id: "2",
      name: "WiFi Bill",
      amount: 800,
      frequency: "Monthly",
      nextDue: "12 days",
      category: "utilities",
      icon: <Wifi className="w-5 h-5" />,
      color: "bg-blue-500",
      group: "Flatmates",
      members: ["You", "Priya", "Amit", "Sneha"],
      yourShare: 200,
      status: "active",
      autoReminder: true,
      lastPaid: "2 weeks ago",
    },
    {
      id: "3",
      name: "Electricity Bill",
      amount: 1200,
      frequency: "Monthly",
      nextDue: "1 week",
      category: "utilities",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-yellow-500",
      group: "Flatmates",
      members: ["You", "Priya", "Amit", "Sneha"],
      yourShare: 300,
      status: "active",
      autoReminder: true,
      lastPaid: "3 weeks ago",
    },
    {
      id: "4",
      name: "Credit Card EMI",
      amount: 5000,
      frequency: "Monthly",
      nextDue: "2 days",
      category: "finance",
      icon: <IndianRupee className="w-5 h-5" />,
      color: "bg-red-500",
      group: "Personal",
      members: ["You"],
      yourShare: 5000,
      status: "urgent",
      autoReminder: true,
      lastPaid: "Last month",
    },
    {
      id: "5",
      name: "Mobile Recharge",
      amount: 399,
      frequency: "Monthly",
      nextDue: "3 weeks",
      category: "utilities",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-purple-500",
      group: "Personal",
      members: ["You"],
      yourShare: 399,
      status: "active",
      autoReminder: false,
      lastPaid: "1 week ago",
    },
  ]

  const categories = [
    { id: "home", name: "Home & Rent", icon: <Home className="w-4 h-4" /> },
    { id: "utilities", name: "Utilities", icon: <Zap className="w-4 h-4" /> },
    { id: "transport", name: "Transport", icon: <Car className="w-4 h-4" /> },
    { id: "finance", name: "Finance & EMI", icon: <IndianRupee className="w-4 h-4" /> },
  ]

  const groups = [
    { id: "flatmates", name: "Flatmates" },
    { id: "college", name: "College Friends" },
    { id: "office", name: "Office Team" },
    { id: "personal", name: "Personal" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "due-soon":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDueDateColor = (nextDue: string) => {
    if (nextDue.includes("day") && Number.parseInt(nextDue) <= 3) return "text-red-600"
    if (nextDue.includes("day") && Number.parseInt(nextDue) <= 7) return "text-orange-600"
    return "text-gray-600"
  }

  const handleAddBill = () => {
    // Add bill logic here
    setShowAddForm(false)
    setNewBill({
      name: "",
      amount: "",
      frequency: "monthly",
      dueDate: "",
      category: "home",
      group: "",
      autoReminder: true,
      splitEqually: true,
    })
  }

  const toggleReminder = (billId: string) => {
    // Toggle reminder logic here
    console.log("Toggle reminder for bill:", billId)
  }

  const payNow = (billId: string) => {
    // Navigate to payment page
    window.location.href = `/pay/${billId}`
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
                <h1 className="text-xl font-bold text-gray-900">Recurring Bills</h1>
                <p className="text-sm text-gray-500">Manage your regular payments and reminders</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bill
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Due This Week</p>
                  <p className="text-2xl font-bold text-orange-700">₹6,200</p>
                  <p className="text-xs text-orange-600">3 bills pending</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Monthly Total</p>
                  <p className="text-2xl font-bold text-blue-700">₹22,399</p>
                  <p className="text-xs text-blue-600">5 active bills</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Your Share</p>
                  <p className="text-2xl font-bold text-green-700">₹9,649</p>
                  <p className="text-xs text-green-600">After splitting</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bills List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {recurringBills.map((bill) => (
                <Card key={bill.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 ${bill.color} rounded-lg flex items-center justify-center text-white`}
                        >
                          {bill.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{bill.name}</h3>
                          <p className="text-sm text-gray-500">{bill.group}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {bill.frequency}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">₹{bill.amount.toLocaleString()}</p>
                        <p className="text-sm text-teal-600 font-medium">Your share: ₹{bill.yourShare}</p>
                        <p className={`text-sm font-medium ${getDueDateColor(bill.nextDue)}`}>Due in {bill.nextDue}</p>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Split with:</span>
                        <div className="flex -space-x-1">
                          {bill.members.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                {member.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {bill.members.length > 3 && (
                            <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{bill.members.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Auto-remind</span>
                        <Switch checked={bill.autoReminder} onCheckedChange={() => toggleReminder(bill.id)} size="sm" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        {bill.status === "urgent" && (
                          <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => payNow(bill.id)}>
                            <IndianRupee className="w-3 h-3 mr-1" />
                            Pay Now
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Bell className="w-3 h-3 mr-1" />
                          Remind
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">Last paid: {bill.lastPaid}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Bill Form / Quick Actions */}
          <div className="space-y-6">
            {showAddForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Recurring Bill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="billName">Bill Name</Label>
                    <Input
                      id="billName"
                      placeholder="e.g., Room Rent, WiFi Bill"
                      value={newBill.name}
                      onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative mt-1">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newBill.amount}
                        onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newBill.category}
                      onValueChange={(value) => setNewBill({ ...newBill, category: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              {category.icon}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Frequency</Label>
                    <Select
                      value={newBill.frequency}
                      onValueChange={(value) => setNewBill({ ...newBill, frequency: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Group</Label>
                    <Select value={newBill.group} onValueChange={(value) => setNewBill({ ...newBill, group: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Auto-reminder</Label>
                      <Switch
                        checked={newBill.autoReminder}
                        onCheckedChange={(checked) => setNewBill({ ...newBill, autoReminder: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Split equally</Label>
                      <Switch
                        checked={newBill.splitEqually}
                        onCheckedChange={(checked) => setNewBill({ ...newBill, splitEqually: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddBill} className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-500">
                      Add Bill
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Quick Stats */}
                <Card className="border-teal-200 bg-teal-50">
                  <CardHeader>
                    <CardTitle className="text-teal-800">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-teal-700">Active Bills</span>
                      <span className="font-bold text-teal-800">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Next Due</span>
                      <span className="font-bold text-teal-800">2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Auto-reminders</span>
                      <span className="font-bold text-teal-800">4 enabled</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Bill
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Send All Reminders
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </CardContent>
                </Card>
              </>
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
