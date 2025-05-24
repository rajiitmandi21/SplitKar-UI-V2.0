"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IndianRupee,
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  Users,
  Plus,
  Settings,
  Home,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [showSettings, setShowSettings] = useState(false)

  const notifications = [
    {
      id: "1",
      type: "payment_received",
      title: "Payment Received",
      message: "Priya paid ₹1,200 for WiFi Bill",
      amount: 1200,
      timestamp: "2 minutes ago",
      read: false,
      priority: "normal",
      avatar: "P",
      group: "Flatmates",
      actionRequired: false,
    },
    {
      id: "2",
      type: "expense_added",
      title: "New Expense Added",
      message: "Amit added ₹480 for Dinner at Cafe Coffee Day",
      amount: 480,
      timestamp: "1 hour ago",
      read: false,
      priority: "normal",
      avatar: "A",
      group: "College Friends",
      actionRequired: true,
      yourShare: 120,
    },
    {
      id: "3",
      type: "reminder",
      title: "Payment Reminder",
      message: "Rent payment due in 2 days",
      amount: 15000,
      timestamp: "3 hours ago",
      read: true,
      priority: "high",
      avatar: "🏠",
      group: "Flatmates",
      actionRequired: true,
      yourShare: 3750,
    },
    {
      id: "4",
      type: "nudge_received",
      title: "Nudge Received",
      message: "Sneha sent you a friendly reminder about ₹450",
      amount: 450,
      timestamp: "5 hours ago",
      read: true,
      priority: "normal",
      avatar: "S",
      group: "College Friends",
      actionRequired: true,
    },
    {
      id: "5",
      type: "group_invite",
      title: "Group Invitation",
      message: "Rohan invited you to join 'Office Team'",
      timestamp: "1 day ago",
      read: false,
      priority: "normal",
      avatar: "R",
      group: "Office Team",
      actionRequired: true,
    },
    {
      id: "6",
      type: "settlement_suggestion",
      title: "Smart Settlement",
      message: "You can simplify 3 debts with one payment of ₹2,100",
      amount: 2100,
      timestamp: "2 days ago",
      read: true,
      priority: "low",
      avatar: "🤖",
      group: "AI Assistant",
      actionRequired: true,
    },
  ]

  const notificationSettings = [
    {
      category: "Payments",
      settings: [
        { id: "payment_received", name: "Payment received", enabled: true },
        { id: "payment_overdue", name: "Payment overdue", enabled: true },
        { id: "payment_reminder", name: "Payment reminders", enabled: true },
      ],
    },
    {
      category: "Expenses",
      settings: [
        { id: "expense_added", name: "New expense added", enabled: true },
        { id: "expense_updated", name: "Expense updated", enabled: false },
        { id: "expense_deleted", name: "Expense deleted", enabled: true },
      ],
    },
    {
      category: "Groups",
      settings: [
        { id: "group_invite", name: "Group invitations", enabled: true },
        { id: "group_activity", name: "Group activity", enabled: false },
        { id: "member_joined", name: "Member joined/left", enabled: true },
      ],
    },
    {
      category: "Smart Features",
      settings: [
        { id: "ai_suggestions", name: "AI suggestions", enabled: true },
        { id: "settlement_optimization", name: "Settlement optimization", enabled: true },
        { id: "spending_insights", name: "Spending insights", enabled: false },
      ],
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment_received":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case "expense_added":
        return <Plus className="w-5 h-5 text-blue-500" />
      case "reminder":
        return <Clock className="w-5 h-5 text-orange-500" />
      case "nudge_received":
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case "group_invite":
        return <Users className="w-5 h-5 text-indigo-500" />
      case "settlement_suggestion":
        return <Zap className="w-5 h-5 text-yellow-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "normal":
        return "border-l-blue-500"
      case "low":
        return "border-l-gray-300"
      default:
        return "border-l-gray-300"
    }
  }

  const markAsRead = (notificationId: string) => {
    // Mark notification as read logic
    console.log("Mark as read:", notificationId)
  }

  const deleteNotification = (notificationId: string) => {
    // Delete notification logic
    console.log("Delete notification:", notificationId)
  }

  const handleAction = (notification: any) => {
    switch (notification.type) {
      case "expense_added":
        window.location.href = `/expenses/${notification.id}`
        break
      case "reminder":
        window.location.href = `/pay/${notification.id}`
        break
      case "nudge_received":
        window.location.href = `/settle/${notification.id}`
        break
      case "group_invite":
        window.location.href = `/groups/join/${notification.id}`
        break
      case "settlement_suggestion":
        window.location.href = `/settle/optimize`
        break
      default:
        break
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === "all") return true
    if (selectedTab === "unread") return !notification.read
    if (selectedTab === "payments")
      return ["payment_received", "reminder", "nudge_received"].includes(notification.type)
    if (selectedTab === "groups") return ["group_invite", "expense_added"].includes(notification.type)
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

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
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {showSettings ? (
          /* Notification Settings */
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map((category) => (
                <div key={category.category}>
                  <h3 className="font-semibold text-gray-900 mb-3">{category.category}</h3>
                  <div className="space-y-3">
                    {category.settings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{setting.name}</span>
                        <Switch defaultChecked={setting.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <Button onClick={() => setShowSettings(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Notifications List */
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark All Read
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{filteredNotifications.length} notifications</span>
              </div>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && <Badge className="ml-1 text-xs">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-3">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`hover:shadow-md transition-all cursor-pointer border-l-4 ${getPriorityColor(
                          notification.priority,
                        )} ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {typeof notification.avatar === "string" && notification.avatar.length === 1 ? (
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                                      {notification.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg">{notification.avatar}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  {getNotificationIcon(notification.type)}
                                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.group}
                                  </Badge>
                                  {notification.priority === "high" && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {notification.amount && (
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">₹{notification.amount.toLocaleString()}</p>
                                  {notification.yourShare && (
                                    <p className="text-xs text-gray-500">Your share: ₹{notification.yourShare}</p>
                                  )}
                                </div>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {notification.actionRequired && (
                            <div className="mt-4 pt-3 border-t flex items-center justify-between">
                              <span className="text-sm text-gray-600">Action required</span>
                              <div className="flex space-x-2">
                                {notification.type === "expense_added" && (
                                  <>
                                    <Button size="sm" variant="outline">
                                      Decline
                                    </Button>
                                    <Button size="sm" onClick={() => handleAction(notification)}>
                                      Accept
                                    </Button>
                                  </>
                                )}
                                {notification.type === "reminder" && (
                                  <Button size="sm" onClick={() => handleAction(notification)}>
                                    <CreditCard className="w-3 h-3 mr-1" />
                                    Pay Now
                                  </Button>
                                )}
                                {notification.type === "nudge_received" && (
                                  <Button size="sm" onClick={() => handleAction(notification)}>
                                    <IndianRupee className="w-3 h-3 mr-1" />
                                    Settle
                                  </Button>
                                )}
                                {notification.type === "group_invite" && (
                                  <>
                                    <Button size="sm" variant="outline">
                                      Decline
                                    </Button>
                                    <Button size="sm" onClick={() => handleAction(notification)}>
                                      Join Group
                                    </Button>
                                  </>
                                )}
                                {notification.type === "settlement_suggestion" && (
                                  <Button size="sm" onClick={() => handleAction(notification)}>
                                    <Zap className="w-3 h-3 mr-1" />
                                    Optimize
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">No notifications</h3>
                        <p className="text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
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
