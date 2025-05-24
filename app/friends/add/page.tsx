"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  QrCode,
  Mail,
  MessageSquare,
  Phone,
  UserPlus,
  CheckCircle,
  Copy,
  Share,
  Users,
  IndianRupee,
  Settings,
  Home,
} from "lucide-react"
import Link from "next/link"

export default function AddFriendPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const suggestedFriends = [
    {
      id: "1",
      name: "Arjun Mehta",
      email: "arjun@example.com",
      phone: "+91 9876543214",
      avatar: "A",
      mutualFriends: 3,
      source: "contacts",
    },
    {
      id: "2",
      name: "Kavya Singh",
      email: "kavya@example.com",
      phone: "+91 9876543215",
      avatar: "K",
      mutualFriends: 5,
      source: "facebook",
    },
    {
      id: "3",
      name: "Vikram Sharma",
      email: "vikram@example.com",
      phone: "+91 9876543216",
      avatar: "V",
      mutualFriends: 2,
      source: "contacts",
    },
    {
      id: "4",
      name: "Meera Patel",
      email: "meera@example.com",
      phone: "+91 9876543217",
      avatar: "M",
      mutualFriends: 1,
      source: "google",
    },
  ]

  const recentContacts = [
    { id: "c1", name: "Rajesh Kumar", phone: "+91 9876543218", avatar: "R" },
    { id: "c2", name: "Anita Desai", phone: "+91 9876543219", avatar: "A" },
    { id: "c3", name: "Siddharth Jain", phone: "+91 9876543220", avatar: "S" },
  ]

  const generateInviteLink = () => {
    const randomId = Math.random().toString(36).substring(2, 8)
    const link = `https://splitkar.app/invite/${randomId}`
    setInviteLink(link)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const sendInvites = () => {
    if (selectedContacts.length === 0) return
    alert(`Invites sent to ${selectedContacts.length} contact(s)!`)
    setSelectedContacts([])
  }

  const addFriend = (friendId: string) => {
    alert(`Friend request sent to ${suggestedFriends.find((f) => f.id === friendId)?.name}!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/friends">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add Friends</h1>
                <p className="text-sm text-gray-500">Connect with friends to split expenses</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="invite">Invite</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or phone number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Suggested Friends */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{friend.name}</p>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {friend.mutualFriends} mutual friends
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {friend.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addFriend(friend.id)}>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedContacts.includes(contact.id)
                          ? "border-teal-200 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleContact(contact.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {contact.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                      </div>
                      {selectedContacts.includes(contact.id) && <CheckCircle className="w-5 h-5 text-teal-500" />}
                    </div>
                  ))}
                </div>

                {selectedContacts.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={sendInvites} className="w-full bg-gradient-to-r from-teal-500 to-indigo-500">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invites ({selectedContacts.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Invite Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateInviteLink} variant="outline" className="w-full">
                  Generate Invite Link
                </Button>

                {inviteLink && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input value={inviteLink} readOnly className="bg-gray-50" />
                      <Button size="sm" onClick={copyInviteLink} className={linkCopied ? "bg-green-500" : ""}>
                        {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>SMS</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Share className="w-4 h-4" />
                        <span>More</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Ask your friends to scan this QR code to add you on SplitKar</p>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share QR Code
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
            <Button variant="ghost" className="flex flex-col items-center py-2 text-teal-600">
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
