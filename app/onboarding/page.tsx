"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
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
  AlertCircle,
} from "lucide-react"

export default function OnboardingPage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Profile data initialized with user data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    upi_id: "",
    avatar_url: "",
  })

  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [selectedBills, setSelectedBills] = useState<string[]>([])

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        upi_id: user.upi_id || "",
        avatar_url: user.avatar_url || "",
      })
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

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

  const handleNext = async () => {
    setError("")

    if (currentStep === 1) {
      // Validate and update profile data
      if (!profileData.name || !profileData.email || !profileData.upi_id) {
        setError("Name, email, and UPI ID are required")
        return
      }

      // Validate UPI ID format
      const upiRegex = /^[\w.-]+@[\w.-]+$/
      if (!upiRegex.test(profileData.upi_id)) {
        setError("Please enter a valid UPI ID (e.g., username@paytm)")
        return
      }

      setIsLoading(true)
      try {
        // Update profile if there are changes
        const hasChanges =
          profileData.name !== user?.name || profileData.phone !== user?.phone || profileData.upi_id !== user?.upi_id

        if (hasChanges) {
          await updateProfile({
            name: profileData.name,
            phone: profileData.phone || undefined,
            upi_id: profileData.upi_id,
          })
        }

        setCurrentStep(currentStep + 1)
      } catch (error: any) {
        setError(error.message || "Failed to update profile")
      } finally {
        setIsLoading(false)
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      // Here you would typically save onboarding completion status
      // and selected friends/bills to the backend

      // For now, we'll just redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      setError("Failed to complete onboarding")
    } finally {
      setIsLoading(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Show loading if user data is still being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Redirect if no user (handled by useEffect above)
  if (!user) {
    return null
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
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Step {currentStep} of {totalSteps}
              </Badge>
              {user.is_verified ? (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
            </div>
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
                <CardTitle className="text-2xl">Welcome to SplitKar, {profileData.name}!</CardTitle>
                <CardDescription>
                  Let's complete your profile to get started with smart expense splitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.avatar_url || "/placeholder.svg?height=96&width=96"} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
                        {getInitials(profileData.name)}
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
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <Label htmlFor="phone">Mobile Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="upi_id">UPI ID *</Label>
                    <Input
                      id="upi_id"
                      name="upi_id"
                      placeholder="yourname@paytm"
                      value={profileData.upi_id}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
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

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
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
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {currentStep === 1 ? "Updating..." : "Processing..."}
                  </>
                ) : (
                  <>
                    {currentStep === totalSteps ? "Complete Setup" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
