"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IndianRupee,
  ArrowLeft,
  Send,
  MessageSquare,
  Zap,
  Heart,
  Coffee,
  Smile,
  Settings,
  Users,
  Home,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function NudgesPage() {
  const [selectedTab, setSelectedTab] = useState("send")
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState("")
  const [nudgeType, setNudgeType] = useState("friendly")

  const friends = [
    {
      id: "1",
      name: "Priya Sharma",
      avatar: "P",
      balance: -1200,
      lastSeen: "2 hours ago",
      responseRate: 85,
      preferredTime: "Evening",
    },
    {
      id: "2",
      name: "Amit Kumar",
      avatar: "A",
      balance: 850,
      lastSeen: "1 day ago",
      responseRate: 60,
      preferredTime: "Morning",
    },
    {
      id: "3",
      name: "Sneha Patel",
      avatar: "S",
      balance: 450,
      lastSeen: "5 minutes ago",
      responseRate: 95,
      preferredTime: "Afternoon",
    },
    {
      id: "4",
      name: "Rohan Gupta",
      avatar: "R",
      balance: -300,
      lastSeen: "3 days ago",
      responseRate: 40,
      preferredTime: "Evening",
    },
  ]

  const nudgeTemplates = [
    {
      id: "friendly",
      name: "Friendly Reminder",
      icon: <Smile className="w-5 h-5" />,
      color: "bg-blue-500",
      message: "Hey {name}! Just a gentle reminder about our pending settlement of ₹{amount}. No rush! 😊",
    },
    {
      id: "urgent",
      name: "Urgent Payment",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-red-500",
      message: "Hi {name}, this is urgent! Please settle ₹{amount} as soon as possible. Thanks!",
    },
    {
      id: "casual",
      name: "Casual Nudge",
      icon: <Coffee className="w-5 h-5" />,
      color: "bg-orange-500",
      message: "Yo {name}! Coffee pe milenge aur ₹{amount} ka hisaab bhi clear kar denge? ☕",
    },
    {
      id: "motivational",
      name: "Motivational",
      icon: <Star className="w-5 h-5" />,
      color: "bg-purple-500",
      message: "Hey {name}! You're awesome at settling up! Just ₹{amount} pending. Keep it up! 🌟",
    },
    {
      id: "humorous",
      name: "Humorous",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-pink-500",
      message: "Dear {name}, my wallet is feeling lonely without ₹{amount}. Please reunite them! 😄",
    },
  ]

  const recentNudges = [
    {
      id: "1",
      recipient: "Priya Sharma",
      message: "Hey Priya! Just a gentle reminder about our pending settlement of ₹1,200. No rush! 😊",
      sentAt: "2 hours ago",
      status: "delivered",
      response: "Will pay by evening!",
      type: "friendly",
    },
    {
      id: "2",
      recipient: "Rohan Gupta",
      message: "Yo Rohan! Coffee pe milenge aur ₹300 ka hisaab bhi clear kar denge? ☕",
      sentAt: "1 day ago",
      status: "read",
      response: null,
      type: "casual",
    },
    {
      id: "3",
      recipient: "Amit Kumar",
      message: "Hey Amit! You're awesome at settling up! Just ₹850 pending. Keep it up! 🌟",
      sentAt: "3 days ago",
      status: "paid",
      response: "Done! Thanks for the reminder 😊",
      type: "motivational",
    },
  ]

  const smartSuggestions = [
    {
      friend: "Priya Sharma",
      amount: 1200,
      reason: "Overdue by 5 days",
      urgency: "high",
      suggestedTemplate: "urgent",
    },
    {
      friend: "Rohan Gupta",
      amount: 300,
      reason: "Low response rate",
      urgency: "medium",
      suggestedTemplate: "casual",
    },
  ]

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const sendNudge = () => {
    if (selectedFriends.length === 0) return

    // Send nudge logic here
    alert(`Nudge sent to ${selectedFriends.length} friend(s)!`)
    setSelectedFriends([])
    setCustomMessage("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
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
                <h1 className="text-xl font-bold text-gray-900">Smart Nudges</h1>
                <p className="text-sm text-gray-500">Send friendly payment reminders</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="send">Send Nudges</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Send Nudge Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Select Friends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Friends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedFriends.includes(friend.id)
                              ? "border-teal-200 bg-teal-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleFriend(friend.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                                {friend.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{friend.name}</p>
                              <p className="text-sm text-gray-500">Last seen: {friend.lastSeen}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {friend.responseRate}% response rate
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {friend.preferredTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${friend.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                              {friend.balance < 0 ? "Owes" : "You owe"} ₹{Math.abs(friend.balance)}
                            </p>
                            {selectedFriends.includes(friend.id) && (
                              <CheckCircle className="w-5 h-5 text-teal-500 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Message Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Message Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      {nudgeTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            nudgeType === template.id
                              ? "border-teal-200 bg-teal-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setNudgeType(template.id)}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`w-8 h-8 ${template.color} rounded-lg flex items-center justify-center text-white`}
                            >
                              {template.icon}
                            </div>
                            <span className="font-medium">{template.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{template.message}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                      <Textarea
                        id="customMessage"
                        placeholder="Write your own message or modify the template..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {"{name}"} and {"{amount}"} for personalization
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Send */}
              <div className="space-y-6">
                {/* Preview */}
                {selectedFriends.length > 0 && (
                  <Card className="border-teal-200 bg-teal-50">
                    <CardHeader>
                      <CardTitle className="text-teal-800">Message Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedFriends.slice(0, 2).map((friendId) => {
                          const friend = friends.find((f) => f.id === friendId)
                          const template = nudgeTemplates.find((t) => t.id === nudgeType)
                          const message = customMessage || template?.message || ""
                          const personalizedMessage = message
                            .replace("{name}", friend?.name || "")
                            .replace("{amount}", Math.abs(friend?.balance || 0).toString())

                          return (
                            <div key={friendId} className="bg-white p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                    {friend?.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{friend?.name}</span>
                              </div>
                              <p className="text-sm text-gray-700">{personalizedMessage}</p>
                            </div>
                          )
                        })}
                        {selectedFriends.length > 2 && (
                          <p className="text-xs text-teal-600">+{selectedFriends.length - 2} more friends</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Send Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Send immediately</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Follow up if no response</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Respect preferred timing</Label>
                      <Switch defaultChecked />
                    </div>

                    <Button
                      onClick={sendNudge}
                      disabled={selectedFriends.length === 0}
                      className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Nudge{selectedFriends.length > 1 ? "s" : ""} ({selectedFriends.length})
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Nudge Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-bold">12 sent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-bold text-green-600">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payments Received</span>
                      <span className="font-bold text-green-600">₹8,400</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {recentNudges.map((nudge) => (
                <Card key={nudge.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {nudge.recipient.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{nudge.recipient}</p>
                          <p className="text-sm text-gray-500">{nudge.sentAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(nudge.status)}>{nudge.status}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {nudge.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{nudge.message}</p>
                    </div>

                    {nudge.response && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Response: {nudge.response}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI-Powered Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 mb-4">
                  Based on payment patterns and response rates, here are smart nudge recommendations:
                </p>
                <div className="space-y-4">
                  {smartSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {suggestion.friend.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{suggestion.friend}</p>
                            <p className="text-sm text-gray-500">₹{suggestion.amount} pending</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getUrgencyColor(suggestion.urgency)}`}>
                            {suggestion.urgency.toUpperCase()} PRIORITY
                          </p>
                          <p className="text-xs text-gray-500">{suggestion.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Suggested:</span>
                          <Badge variant="outline" className="text-xs">
                            {nudgeTemplates.find((t) => t.id === suggestion.suggestedTemplate)?.name}
                          </Badge>
                        </div>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          <Send className="w-3 h-3 mr-1" />
                          Send Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Best Time to Nudge</h4>
                    <p className="text-sm text-blue-700">
                      Your friends respond 40% better to nudges sent between 6-8 PM
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Most Effective Style</h4>
                    <p className="text-sm text-green-700">
                      Friendly reminders have 85% higher response rate than urgent ones
                    </p>
                  </div>
                </div>
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
