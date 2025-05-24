"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  IndianRupee,
  Upload,
  Users,
  Plus,
  Search,
  QrCode,
  Mail,
  Phone,
  Home,
  Wifi,
  Zap,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    upiId: "rahul@paytm",
  })
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [selectedBills, setSelectedBills] = useState<string[]>([])

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const suggestedFriends = [
    { id: "1", name: "Priya Sharma", email: "priya@example.com", avatar: "P" },
    { id: "2", name: "Amit Kumar", email: "amit@example.com", avatar: "A" },
    { id: "3", name: "Sneha Patel", email: "sneha@example.com", avatar: "S" },
    { id: "4", name: "Rohan Gupta", email: "rohan@example.com", avatar: "R" },
  ]

  const recurringBills = [
    { id: "rent", name: "Room Rent", icon: <Home className="w-5 h-5" />, amount: "₹15,000", frequency: "Monthly" },
    { id: "wifi", name: "WiFi Bill", icon: <Wifi className="w-5 h-5" />, amount: "₹800", frequency: "Monthly" },
    {
      id: "electricity",
      name: "Electricity",
      icon: <Zap className="w-5 h-5" />,
      amount: "₹1,200",
      frequency: "Monthly",
    },
    {
      id: "emi",
      name: "Credit Card EMI",
      icon: <IndianRupee className="w-5 h-5" />,
      amount: "₹5,000",
      frequency: "Monthly",
    },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      window.location.href = "/dashboard"
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const toggleBill = (billId: string) => {
    setSelectedBills((prev) => (prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SplitKar</span>
            </div>
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Welcome to SplitKar!</CardTitle>
                <CardDescription>Let's set up your profile to get started with smart expense splitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
                        {profileData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Upload your profile picture</p>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="phone">Mobile Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="upi">UPI ID (Optional)</Label>
                    <Input
                      id="upi"
                      placeholder="yourname@paytm"
                      value={profileData.upiId}
                      onChange={(e) => setProfileData({ ...profileData, upiId: e.target.value })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">This will be used for quick payments and settlements</p>
                  </div>

                  <div>
                    <Label>Default Currency</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button variant="outline" size="sm" className="bg-teal-50 border-teal-200">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        INR (₹)
                      </Button>
                      <Button variant="outline" size="sm">
                        USD ($)
                      </Button>
                      <Button variant="outline" size="sm">
                        EUR (€)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Add Friends */}
          {currentStep === 2 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Add Your Friends</CardTitle>
                <CardDescription>Connect with friends to start splitting expenses together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search by email or phone number" className="pl-10" />
                </div>

                {/* Quick Add Options */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <QrCode className="w-6 h-6 mb-2" />
                    <span className="text-xs">Scan QR</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Mail className="w-6 h-6 mb-2" />
                    <span className="text-xs">Invite via Email</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                    <Phone className="w-6 h-6 mb-2" />
                    <span className="text-xs">Invite via SMS</span>
                  </Button>
                </div>

                {/* Suggested Friends */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Suggested Friends</h3>
                  <div className="space-y-2">
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
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {friend.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.email}</p>
                          </div>
                        </div>
                        {selectedFriends.includes(friend.id) && <CheckCircle className="w-5 h-5 text-teal-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedFriends.length > 0 && (
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-sm text-teal-700">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {selectedFriends.length} friend{selectedFriends.length > 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Set Recurring Bills */}
          {currentStep === 3 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Set Up Recurring Bills</CardTitle>
                <CardDescription>Automate your regular expenses like rent, WiFi, and utilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Common Bills</h3>
                  <div className="grid gap-3">
                    {recurringBills.map((bill) => (
                      <div
                        key={bill.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedBills.includes(bill.id)
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleBill(bill.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white">
                            {bill.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{bill.name}</p>
                            <p className="text-sm text-gray-500">
                              {bill.frequency} • {bill.amount}
                            </p>
                          </div>
                        </div>
                        {selectedBills.includes(bill.id) && <CheckCircle className="w-5 h-5 text-orange-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Bill
                </Button>

                {selectedBills.length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 mb-2">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {selectedBills.length} bill{selectedBills.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="text-xs text-orange-600">
                      You can set up split ratios and invite friends to these bills after completing setup
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost">Skip</Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
              >
                {currentStep === totalSteps ? "Complete Setup" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
