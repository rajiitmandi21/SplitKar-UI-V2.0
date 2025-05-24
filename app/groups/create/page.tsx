"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Mail,
  MessageSquare,
  QrCode,
  Copy,
  Check,
  Home,
  GraduationCap,
  Briefcase,
  Coffee,
  Plane,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("users")
  const [selectedCurrency, setSelectedCurrency] = useState("inr")
  const [inviteEmails, setInviteEmails] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [groupLink, setGroupLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const groupIcons = [
    { id: "users", icon: <Users className="w-6 h-6" />, label: "General", color: "bg-gray-500" },
    { id: "home", icon: <Home className="w-6 h-6" />, label: "Flatmates", color: "bg-green-500" },
    { id: "graduation", icon: <GraduationCap className="w-6 h-6" />, label: "College", color: "bg-blue-500" },
    { id: "briefcase", icon: <Briefcase className="w-6 h-6" />, label: "Office", color: "bg-purple-500" },
    { id: "coffee", icon: <Coffee className="w-6 h-6" />, label: "Friends", color: "bg-orange-500" },
    { id: "plane", icon: <Plane className="w-6 h-6" />, label: "Travel", color: "bg-indigo-500" },
    { id: "heart", icon: <Heart className="w-6 h-6" />, label: "Family", color: "bg-pink-500" },
  ]

  const currencies = [
    { id: "inr", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
    { id: "usd", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { id: "eur", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { id: "gbp", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  ]

  const suggestedFriends = [
    { id: "1", name: "Priya Sharma", email: "priya@example.com", avatar: "P", status: "online" },
    { id: "2", name: "Amit Kumar", email: "amit@example.com", avatar: "A", status: "offline" },
    { id: "3", name: "Sneha Patel", email: "sneha@example.com", avatar: "S", status: "online" },
    { id: "4", name: "Rohan Gupta", email: "rohan@example.com", avatar: "R", status: "offline" },
  ]

  const generateGroupLink = () => {
    const randomId = Math.random().toString(36).substring(2, 8)
    const link = `https://splitkar.app/join/${randomId}`
    setGroupLink(link)
  }

  const copyGroupLink = () => {
    navigator.clipboard.writeText(groupLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const selectedIconData = groupIcons.find((icon) => icon.id === selectedIcon)

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
                <h1 className="text-xl font-bold text-gray-900">Create New Group</h1>
                <p className="text-sm text-gray-500">Set up a group to split expenses</p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
              disabled={!groupName.trim()}
            >
              Create Group
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Group Details */}
          <Card>
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>Give your group a name and choose an icon that represents it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group Icon Selection */}
              <div>
                <Label>Group Icon</Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mt-2">
                  {groupIcons.map((icon) => (
                    <Button
                      key={icon.id}
                      variant={selectedIcon === icon.id ? "default" : "outline"}
                      className={`flex flex-col items-center p-4 h-auto ${selectedIcon === icon.id ? icon.color : ""}`}
                      onClick={() => setSelectedIcon(icon.id)}
                    >
                      {icon.icon}
                      <span className="text-xs mt-1">{icon.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Group Name */}
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Flatmates, College Friends, Office Team"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Group Description */}
              <div>
                <Label htmlFor="groupDescription">Description (Optional)</Label>
                <Textarea
                  id="groupDescription"
                  placeholder="What's this group for? e.g., Sharing apartment expenses"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Currency Selection */}
              <div>
                <Label>Default Currency</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {currencies.map((currency) => (
                    <Button
                      key={currency.id}
                      variant={selectedCurrency === currency.id ? "default" : "outline"}
                      className={`flex items-center space-x-2 h-auto p-3 ${
                        selectedCurrency === currency.id ? "bg-teal-500" : ""
                      }`}
                      onClick={() => setSelectedCurrency(currency.id)}
                    >
                      <span className="text-lg">{currency.flag}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium">{currency.symbol}</p>
                        <p className="text-xs opacity-75">{currency.id.toUpperCase()}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Group Preview */}
              {groupName && (
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-700 mb-2">Group Preview</p>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${selectedIconData?.color} rounded-lg flex items-center justify-center text-white`}
                    >
                      {selectedIconData?.icon}
                    </div>
                    <div>
                      <p className="font-bold text-teal-800">{groupName}</p>
                      {groupDescription && <p className="text-sm text-teal-600">{groupDescription}</p>}
                      <p className="text-xs text-teal-500">
                        Currency: {currencies.find((c) => c.id === selectedCurrency)?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invite Members */}
          <Card>
            <CardHeader>
              <CardTitle>Invite Members</CardTitle>
              <CardDescription>Add friends to your group to start splitting expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Friends */}
              <div>
                <Label>Search Friends</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search by name, email, or phone" className="pl-10" />
                </div>
              </div>

              {/* Suggested Friends */}
              <div>
                <Label>Suggested Friends</Label>
                <div className="space-y-2 mt-2">
                  {suggestedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFriends.includes(friend.id)
                          ? "border-teal-200 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleFriend(friend.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
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
                          <p className="font-medium text-gray-900">{friend.name}</p>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      {selectedFriends.includes(friend.id) && <Check className="w-5 h-5 text-teal-500" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite by Email */}
              <div>
                <Label htmlFor="inviteEmails">Invite by Email</Label>
                <Textarea
                  id="inviteEmails"
                  placeholder="Enter email addresses separated by commas"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Quick Invite Options */}
              <div>
                <Label>Quick Invite</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <QrCode className="w-6 h-6 mb-2" />
                    <span className="text-xs">QR Code</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Mail className="w-6 h-6 mb-2" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={generateGroupLink}
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-xs">Share Link</span>
                  </Button>
                </div>
              </div>

              {/* Generated Group Link */}
              {groupLink && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <Label className="text-indigo-800">Shareable Group Link</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input value={groupLink} readOnly className="bg-white" />
                    <Button size="sm" onClick={copyGroupLink} className={linkCopied ? "bg-green-500" : ""}>
                      {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">
                    Share this link with friends to let them join the group
                  </p>
                </div>
              )}

              {/* Selected Members Summary */}
              {selectedFriends.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-2">
                    <Check className="w-4 h-4 inline mr-1" />
                    {selectedFriends.length} friend{selectedFriends.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFriends.map((friendId) => {
                      const friend = suggestedFriends.find((f) => f.id === friendId)
                      return friend ? (
                        <Badge key={friendId} variant="secondary" className="bg-green-100 text-green-800">
                          {friend.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Group Settings</CardTitle>
              <CardDescription>Configure how your group will handle expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Auto-generate UPI links</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Smart debt simplification</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Expense notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Payment reminders</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
