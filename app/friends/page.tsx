"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  IndianRupee,
  ArrowLeft,
  Search,
  Plus,
  Bell,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Send,
  History,
  Users,
  Settings,
  Home,
} from "lucide-react"
import Link from "next/link"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)

  const friends = [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543210",
      avatar: "P",
      netBalance: -1200,
      lastActivity: "2 hours ago",
      status: "online",
      totalExpenses: 15600,
      totalSettled: 14400,
      groups: ["Flatmates", "College Friends"],
    },
    {
      id: "2",
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 9876543211",
      avatar: "A",
      netBalance: 850,
      lastActivity: "1 day ago",
      status: "offline",
      totalExpenses: 8900,
      totalSettled: 8050,
      groups: ["Office Team", "Flatmates"],
    },
    {
      id: "3",
      name: "Sneha Patel",
      email: "sneha@example.com",
      phone: "+91 9876543212",
      avatar: "S",
      netBalance: 450,
      lastActivity: "5 minutes ago",
      status: "online",
      totalExpenses: 12300,
      totalSettled: 11850,
      groups: ["College Friends"],
    },
    {
      id: "4",
      name: "Rohan Gupta",
      email: "rohan@example.com",
      phone: "+91 9876543213",
      avatar: "R",
      netBalance: -300,
      lastActivity: "3 days ago",
      status: "offline",
      totalExpenses: 5600,
      totalSettled: 5900,
      groups: ["Office Team", "College Friends"],
    },
  ]

  const recentTransactions = [
    {
      id: "1",
      friendId: "1",
      type: "expense",
      description: "Dinner at Cafe Coffee Day",
      amount: 480,
      yourShare: 240,
      date: "Today, 2:30 PM",
      status: "pending",
      group: "College Friends",
    },
    {
      id: "2",
      friendId: "2",
      type: "payment",
      description: "WiFi Bill Settlement",
      amount: 200,
      date: "Yesterday, 6:45 PM",
      status: "completed",
      group: "Flatmates",
    },
    {
      id: "3",
      friendId: "1",
      type: "expense",
      description: "Uber to Airport",
      amount: 350,
      yourShare: 175,
      date: "2 days ago",
      status: "settled",
      group: "Flatmates",
    },
  ]

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedFriendData = friends.find((f) => f.id === selectedFriend)

  const friendTransactions = recentTransactions.filter((t) => t.friendId === selectedFriend)

  const sendNudge = (friendId: string) => {
    // Implement nudge functionality
    alert("Nudge sent! 🔔")
  }

  const settleUp = (friendId: string) => {
    // Implement settle up functionality
    window.location.href = `/settle/${friendId}`
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
                <h1 className="text-xl font-bold text-gray-900">Friends</h1>
                <p className="text-sm text-gray-500">Manage your expense relationships</p>
              </div>
            </div>
            <Link href="/friends/add">
              <Button className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Friends List */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search friends by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Friends Grid */}
            <div className="space-y-4">
              {filteredFriends.map((friend) => (
                <Card
                  key={friend.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedFriend === friend.id ? "ring-2 ring-teal-500 bg-teal-50" : ""
                  }`}
                  onClick={() => setSelectedFriend(friend.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold">
                              {friend.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {friend.groups.map((group) => (
                              <Badge key={group} variant="secondary" className="text-xs">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          {friend.netBalance < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                          <span className={`font-bold ${friend.netBalance < 0 ? "text-red-600" : "text-green-600"}`}>
                            {friend.netBalance < 0 ? "You owe" : "Owes you"} ₹{Math.abs(friend.netBalance)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Last active: {friend.lastActivity}</p>

                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              sendNudge(friend.id)
                            }}
                          >
                            <Bell className="w-3 h-3 mr-1" />
                            Nudge
                          </Button>
                          {friend.netBalance !== 0 && (
                            <Button
                              size="sm"
                              className={
                                friend.netBalance < 0
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }
                              onClick={(e) => {
                                e.stopPropagation()
                                settleUp(friend.id)
                              }}
                            >
                              <IndianRupee className="w-3 h-3 mr-1" />
                              Settle
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Friend Details Sidebar */}
          <div className="space-y-6">
            {selectedFriendData ? (
              <>
                {/* Friend Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                          {selectedFriendData.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{selectedFriendData.name}</p>
                        <p className="text-sm text-gray-500 font-normal">{selectedFriendData.email}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Total Expenses</p>
                        <p className="font-bold text-gray-900">₹{selectedFriendData.totalExpenses.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Total Settled</p>
                        <p className="font-bold text-gray-900">₹{selectedFriendData.totalSettled.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Expense
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <History className="w-4 h-4 mr-1" />
                          History
                        </Button>
                      </div>
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
                      {friendTransactions.length > 0 ? (
                        friendTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  transaction.type === "expense" ? "bg-orange-100" : "bg-green-100"
                                }`}
                              >
                                {transaction.type === "expense" ? (
                                  <TrendingUp className="w-4 h-4 text-orange-600" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                <p className="text-xs text-gray-500">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                ₹{transaction.yourShare || transaction.amount}
                              </p>
                              <Badge
                                variant={
                                  transaction.status === "completed" || transaction.status === "settled"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No recent transactions</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-teal-200 bg-teal-50">
                  <CardHeader>
                    <CardTitle className="text-teal-800">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full bg-white hover:bg-teal-100"
                      onClick={() => sendNudge(selectedFriendData.id)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment Reminder
                    </Button>
                    <Button variant="outline" className="w-full bg-white hover:bg-teal-100">
                      <Users className="w-4 h-4 mr-2" />
                      Add to Group
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Select a Friend</h3>
                  <p className="text-sm text-gray-500">
                    Choose a friend from the list to view details and manage expenses
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
          <Link href="/groups">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Users className="w-5 h-5" />
              <span className="text-xs">Groups</span>
            </Button>
          </Link>
          <Button variant="ghost" className="flex flex-col items-center py-2 text-teal-600">
            <IndianRupee className="w-5 h-5" />
            <span className="text-xs">Friends</span>
          </Button>
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
