"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  IndianRupee,
  Users,
  Settings,
  Home,
  Smartphone,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    upiId: "rahul@paytm",
    defaultCurrency: "INR",
    language: "en",
  })

  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    expenseUpdates: true,
    groupActivity: false,
    weeklyReports: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "friends",
    showBalance: false,
    allowFriendRequests: true,
    showOnlineStatus: true,
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    soundEffects: true,
    autoBackup: true,
    biometricAuth: false,
  })

  const stats = {
    totalExpenses: 45600,
    totalSettled: 42100,
    activeGroups: 4,
    totalFriends: 12,
    joinedDate: "March 2024",
    totalTransactions: 156,
  }

  const recentActivity = [
    { action: "Settled ₹1,200 with Priya", date: "2 hours ago" },
    { action: "Added WiFi bill expense", date: "1 day ago" },
    { action: "Joined Office Team group", date: "3 days ago" },
    { action: "Updated UPI ID", date: "1 week ago" },
  ]

  const handleSaveProfile = () => {
    alert("Profile updated successfully!")
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/auth"
    }
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
                <h1 className="text-xl font-bold text-gray-900">Profile & Settings</h1>
                <p className="text-sm text-gray-500">Manage your account and preferences</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
                      RS
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" variant="outline">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{profileData.email}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{stats.activeGroups}</p>
                    <p className="text-xs text-gray-500">Active Groups</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{stats.totalFriends}</p>
                    <p className="text-xs text-gray-500">Friends</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-bold">₹{stats.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Settled</span>
                  <span className="font-bold text-green-600">₹{stats.totalSettled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions</span>
                  <span className="font-bold">{stats.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-bold">{stats.joinedDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="upi">UPI ID</Label>
                        <Input
                          id="upi"
                          value={profileData.upiId}
                          onChange={(e) => setProfileData({ ...profileData, upiId: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Default Currency</Label>
                        <Select
                          value={profileData.defaultCurrency}
                          onValueChange={(value) => setProfileData({ ...profileData, defaultCurrency: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">🇮🇳 Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">🇺🇸 US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">🇪🇺 Euro (€)</SelectItem>
                            <SelectItem value="GBP">🇬🇧 British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Language</Label>
                        <Select
                          value={profileData.language}
                          onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-teal-500 to-indigo-500">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{activity.action}</span>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">General Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Push Notifications</span>
                          </div>
                          <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, pushNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Email Notifications</span>
                          </div>
                          <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, emailNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">SMS Notifications</span>
                          </div>
                          <Switch
                            checked={notifications.smsNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, smsNotifications: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Expense Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Payment Reminders</span>
                          <Switch
                            checked={notifications.paymentReminders}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, paymentReminders: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Expense Updates</span>
                          <Switch
                            checked={notifications.expenseUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, expenseUpdates: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Group Activity</span>
                          <Switch
                            checked={notifications.groupActivity}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, groupActivity: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Weekly Reports</span>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, weeklyReports: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Profile Visibility</Label>
                      <Select
                        value={privacy.profileVisibility}
                        onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Show Balance to Friends</span>
                        <Switch
                          checked={privacy.showBalance}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, showBalance: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Allow Friend Requests</span>
                        <Switch
                          checked={privacy.allowFriendRequests}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, allowFriendRequests: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Show Online Status</span>
                        <Switch
                          checked={privacy.showOnlineStatus}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      App Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {preferences.darkMode ? (
                          <Moon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Sun className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm font-medium">Dark Mode</span>
                      </div>
                      <Switch
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {preferences.soundEffects ? (
                          <Volume2 className="w-4 h-4 text-gray-600" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm font-medium">Sound Effects</span>
                      </div>
                      <Switch
                        checked={preferences.soundEffects}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Auto Backup</span>
                      <Switch
                        checked={preferences.autoBackup}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, autoBackup: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Biometric Authentication</span>
                      <Switch
                        checked={preferences.biometricAuth}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, biometricAuth: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
          <Button variant="ghost" className="flex flex-col items-center py-2 text-teal-600">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
