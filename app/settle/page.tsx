"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  IndianRupee,
  CreditCard,
  Smartphone,
  QrCode,
  CheckCircle,
  Clock,
  Zap,
  TrendingDown,
  Users,
  Settings,
  Home,
  Copy,
  Share,
} from "lucide-react"
import Link from "next/link"

export default function SettlePage() {
  const [selectedTab, setSelectedTab] = useState("individual")
  const [selectedFriend, setSelectedFriend] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [note, setNote] = useState("")

  const friendsWithBalance = [
    {
      id: "1",
      name: "Priya Sharma",
      avatar: "P",
      balance: -1200,
      upiId: "priya@paytm",
      groups: ["Flatmates", "College Friends"],
    },
    {
      id: "2",
      name: "Rohan Gupta",
      avatar: "R",
      balance: -300,
      upiId: "rohan@gpay",
      groups: ["Office Team"],
    },
    {
      id: "3",
      name: "Amit Kumar",
      avatar: "A",
      balance: 850,
      upiId: "amit@phonepe",
      groups: ["Flatmates"],
    },
  ]

  const smartSettlements = [
    {
      id: "1",
      description: "Settle with Priya and clear 2 group balances",
      amount: 1200,
      savings: 50,
      groups: ["Flatmates", "College Friends"],
      complexity: "Simple",
    },
    {
      id: "2",
      description: "Optimize 3 payments into 1 transaction",
      amount: 2100,
      savings: 120,
      groups: ["Flatmates", "Office Team", "College Friends"],
      complexity: "Advanced",
    },
  ]

  const recentSettlements = [
    {
      id: "1",
      friend: "Sneha Patel",
      amount: 450,
      date: "2 hours ago",
      status: "completed",
      method: "UPI",
    },
    {
      id: "2",
      friend: "Vikram Sharma",
      amount: 200,
      date: "1 day ago",
      status: "pending",
      method: "Bank Transfer",
    },
    {
      id: "3",
      friend: "Kavya Singh",
      amount: 800,
      date: "3 days ago",
      status: "completed",
      method: "UPI",
    },
  ]

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: <Smartphone className="w-4 h-4" />, popular: true },
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="w-4 h-4" />, popular: false },
    { id: "bank", name: "Bank Transfer", icon: <IndianRupee className="w-4 h-4" />, popular: false },
    { id: "cash", name: "Cash", icon: <IndianRupee className="w-4 h-4" />, popular: false },
  ]

  const selectedFriendData = friendsWithBalance.find((f) => f.id === selectedFriend)

  const generateUPILink = () => {
    if (!selectedFriendData || !amount) return ""
    const upiId = selectedFriendData.upiId
    const amountValue = Math.abs(Number.parseFloat(amount))
    const noteText = note || `Settlement via SplitKar`
    return `upi://pay?pa=${upiId}&am=${amountValue}&tn=${encodeURIComponent(noteText)}`
  }

  const handleSettle = () => {
    if (!selectedFriend || !amount) {
      alert("Please select a friend and enter amount")
      return
    }

    const upiLink = generateUPILink()
    if (paymentMethod === "upi" && upiLink) {
      window.open(upiLink, "_blank")
    } else {
      alert(`Settlement initiated for ₹${amount} with ${selectedFriendData?.name}`)
    }
  }

  const handleSmartSettle = (settlementId: string) => {
    const settlement = smartSettlements.find((s) => s.id === settlementId)
    if (settlement) {
      alert(`Smart settlement initiated for ₹${settlement.amount}. You'll save ₹${settlement.savings}!`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
                <h1 className="text-xl font-bold text-gray-900">Settle Up</h1>
                <p className="text-sm text-gray-500">Pay your friends and clear balances</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="smart">Smart Settle</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Settlement Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Settle with Friend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Select Friend */}
                    <div>
                      <Label>Select Friend</Label>
                      <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a friend to settle with" />
                        </SelectTrigger>
                        <SelectContent>
                          {friendsWithBalance.map((friend) => (
                            <SelectItem key={friend.id} value={friend.id}>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                    {friend.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-medium">{friend.name}</span>
                                  <span
                                    className={`ml-2 text-sm ${friend.balance < 0 ? "text-red-600" : "text-green-600"}`}
                                  >
                                    {friend.balance < 0 ? "You owe" : "Owes you"} ₹{Math.abs(friend.balance)}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative mt-1">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 text-lg font-semibold"
                        />
                      </div>
                      {selectedFriendData && (
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAmount(Math.abs(selectedFriendData.balance).toString())}
                          >
                            Full Amount (₹{Math.abs(selectedFriendData.balance)})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAmount((Math.abs(selectedFriendData.balance) / 2).toString())}
                          >
                            Half Amount
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? "border-teal-200 bg-teal-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <div className="flex items-center space-x-2">
                              {method.icon}
                              <span className="font-medium">{method.name}</span>
                              {method.popular && <Badge className="text-xs">Popular</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input
                        id="note"
                        placeholder="Add a note for this settlement"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* UPI Link Preview */}
                    {paymentMethod === "upi" && selectedFriendData && amount && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">UPI Payment Link</span>
                        </div>
                        <p className="text-sm text-blue-700 mb-3">
                          Pay ₹{amount} to {selectedFriendData.name} ({selectedFriendData.upiId})
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Link
                          </Button>
                          <Button size="sm" variant="outline">
                            <QrCode className="w-3 h-3 mr-1" />
                            QR Code
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleSettle}
                      disabled={!selectedFriend || !amount}
                      className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Settle ₹{amount || "0"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Friend Details */}
              <div className="space-y-6">
                {selectedFriendData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Settlement Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {selectedFriendData.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{selectedFriendData.name}</p>
                          <p className="text-sm text-gray-500">{selectedFriendData.upiId}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p
                          className={`font-bold ${selectedFriendData.balance < 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {selectedFriendData.balance < 0 ? "You owe" : "Owes you"} ₹
                          {Math.abs(selectedFriendData.balance)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Shared Groups</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedFriendData.groups.map((group) => (
                            <Badge key={group} variant="outline" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">Select a Friend</h3>
                      <p className="text-sm text-gray-500">Choose someone to settle up with</p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Share className="w-4 h-4 mr-2" />
                      Share Payment Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Payment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smart" className="space-y-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Smart Settlement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 mb-4">
                  Our AI analyzes your balances to suggest optimal settlement strategies that save time and money.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {smartSettlements.map((settlement) => (
                <Card key={settlement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{settlement.description}</h3>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-lg">₹{settlement.amount.toLocaleString()}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Save ₹{settlement.savings}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {settlement.complexity}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {settlement.groups.map((group) => (
                            <Badge key={group} variant="secondary" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSmartSettle(settlement.id)}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Settle Smart
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">
                          This will optimize your payments and reduce transaction fees
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {recentSettlements.map((settlement) => (
                <Card key={settlement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Settled with {settlement.friend}</p>
                          <p className="text-sm text-gray-500">
                            {settlement.date} • {settlement.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{settlement.amount}</p>
                        <Badge className={getStatusColor(settlement.status)}>{settlement.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
