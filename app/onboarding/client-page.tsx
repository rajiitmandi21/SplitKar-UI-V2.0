"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard, MaterialCardContent, MaterialCardDescription, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SplitKarIcon, SplitKarLogoCompact } from "@/components/ui/splitkar-logo"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
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
  Camera,
  UserPlus,
  CreditCard,
  Star,
  Shield,
  Smartphone
} from "lucide-react"

export default function OnboardingClientPage() {
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
    { id: "1", name: "Priya Sharma", email: "priya@example.com", avatar: "P", mutual: 3 },
    { id: "2", name: "Amit Kumar", email: "amit@example.com", avatar: "A", mutual: 5 },
    { id: "3", name: "Sneha Patel", email: "sneha@example.com", avatar: "S", mutual: 2 },
    { id: "4", name: "Rohan Gupta", email: "rohan@example.com", avatar: "R", mutual: 1 },
  ]

  const recurringBills = [
    { 
      id: "rent", 
      name: "Room Rent", 
      icon: <Home className="w-5 h-5" />, 
      amount: "₹15,000", 
      frequency: "Monthly",
      color: "from-primary-light to-primary-container-light dark:from-primary-dark dark:to-primary-container-dark"
    },
    { 
      id: "wifi", 
      name: "WiFi Bill", 
      icon: <Wifi className="w-5 h-5" />, 
      amount: "₹800", 
      frequency: "Monthly",
      color: "from-secondary-light to-secondary-container dark:from-secondary to-secondary-container-dark"
    },
    {
      id: "electricity",
      name: "Electricity",
      icon: <Zap className="w-5 h-5" />,
      amount: "₹1,200",
      frequency: "Monthly",
      color: "from-tertiary to-tertiary-container dark:from-tertiary-dark dark:to-tertiary-container-dark"
    },
    {
      id: "emi",
      name: "Credit Card EMI",
      icon: <CreditCard className="w-5 h-5" />,
      amount: "₹5,000",
      frequency: "Monthly",
      color: "from-warning-500 to-warning-600"
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
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <MaterialCard elevation={3} className="p-8 border-0">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark">Loading your profile...</p>
          </div>
        </MaterialCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Enhanced Header */}
      <header className="bg-surface-container dark:bg-surface-container-dark border-b border-outline-variant dark:border-outline-variant-dark">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SplitKarIcon size="sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">Welcome to</span>
                  <SplitKarLogoCompact />
                </div>
                <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">Let's set up your account</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Enhanced Progress Section */}
        <MaterialCard elevation={2} className="mb-8 border-0 bg-primary-container-light/30 dark:bg-primary-container-dark/30">
          <MaterialCardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                  Step {currentStep} of {totalSteps}
                </h2>
                <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                  {currentStep === 1 && "Complete your profile"}
                  {currentStep === 2 && "Connect with friends"}
                  {currentStep === 3 && "Set up recurring bills"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">{Math.round(progress)}%</div>
                <div className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">Complete</div>
              </div>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-surface-container dark:bg-surface-container-dark"
            />
          </MaterialCardContent>
        </MaterialCard>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-error bg-error-container text-on-error-container dark:bg-error-container-dark dark:text-on-error-container-dark">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="space-y-8">
          {/* Step 1: Profile Setup */}
          {currentStep === 1 && (
            <MaterialCard elevation={3} className="border-0">
              <MaterialCardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary rounded-3xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <MaterialCardTitle className="text-2xl text-on-surface dark:text-on-surface-dark">
                  Complete Your Profile
                </MaterialCardTitle>
                <MaterialCardDescription className="text-base text-center space-y-2">
                  <div>Help us personalize your</div>
                  <SplitKarLogoCompact />
                  <div>experience with some basic information</div>
                </MaterialCardDescription>
              </MaterialCardHeader>
              
              <MaterialCardContent className="space-y-8">
                {/* Avatar Section */}
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 border-4 border-primary-container-light dark:border-primary-container-dark">
                      <AvatarImage src={profileData.avatar_url} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary text-white">
                        {profileData.name ? getInitials(profileData.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <MaterialButton
                      variant="filled"
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                      elevation={2}
                    >
                      <Camera className="w-4 h-4" />
                    </MaterialButton>
                  </div>
                  <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                    Upload a profile picture (optional)
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-on-surface dark:text-on-surface-dark font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="h-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-on-surface dark:text-on-surface-dark font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="h-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-on-surface dark:text-on-surface-dark font-semibold">
                      Phone Number
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-4 bg-surface-container dark:bg-surface-container-dark border border-r-0 border-outline dark:border-outline-dark rounded-l-xl h-12">
                        <span className="text-sm text-on-surface dark:text-on-surface-dark font-semibold">+91</span>
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="rounded-l-none h-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upi_id" className="text-on-surface dark:text-on-surface-dark font-semibold">
                      UPI ID *
                    </Label>
                    <Input
                      id="upi_id"
                      name="upi_id"
                      type="text"
                      placeholder="username@paytm"
                      value={profileData.upi_id}
                      onChange={handleInputChange}
                      className="h-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl"
                      required
                    />
                    <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">
                      This will be used for quick payments and settlements
                    </p>
                  </div>
                </div>

                {/* Benefits Section */}
                <MaterialCard elevation={2} className="bg-secondary-container dark:bg-secondary-container-dark border-0">
                  <MaterialCardContent className="p-6">
                    <h3 className="font-semibold text-on-secondary-container dark:text-on-secondary-container-dark mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Why we need this information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-on-secondary-container dark:text-on-secondary-container-dark">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-success-500" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-success-500" />
                        <span>Friend discovery and invites</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-success-500" />
                        <span>Expense notifications</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-success-500" />
                        <span>Account security</span>
                      </div>
                    </div>
                  </MaterialCardContent>
                </MaterialCard>
              </MaterialCardContent>
            </MaterialCard>
          )}

          {/* Step 2: Add Friends */}
          {currentStep === 2 && (
            <MaterialCard elevation={3} className="border-0">
              <MaterialCardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-light to-tertiary dark:from-secondary to-tertiary-dark rounded-3xl mx-auto mb-4 flex items-center justify-center">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <MaterialCardTitle className="text-2xl text-on-surface dark:text-on-surface-dark">
                  Connect with Friends
                </MaterialCardTitle>
                <MaterialCardDescription className="text-base">
                  Find and add friends to start splitting expenses together
                </MaterialCardDescription>
              </MaterialCardHeader>
              
              <MaterialCardContent className="space-y-8">
                {/* Search Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-on-surface-variant dark:text-on-surface-variant-dark" />
                    <Input
                      placeholder="Search by name, email, or phone number"
                      className="pl-12 h-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <MaterialButton variant="outlined" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Import from Gmail
                    </MaterialButton>
                    <MaterialButton variant="outlined" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Import Contacts
                    </MaterialButton>
                    <MaterialButton variant="outlined" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR Code
                    </MaterialButton>
                  </div>
                </div>

                {/* Suggested Friends */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                    Suggested Friends
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {suggestedFriends.map((friend) => (
                      <MaterialCard
                        key={friend.id}
                        elevation={selectedFriends.includes(friend.id) ? 3 : 1}
                        className={cn(
                          "cursor-pointer transition-all duration-200 border-0",
                          selectedFriends.includes(friend.id) 
                            ? "ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark bg-primary-container-light/20 dark:bg-primary-container-dark/20" 
                            : "hover:scale-105"
                        )}
                        onClick={() => toggleFriend(friend.id)}
                      >
                        <MaterialCardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary text-white font-bold">
                                {friend.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-on-surface dark:text-on-surface-dark">{friend.name}</p>
                              <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">{friend.email}</p>
                              <div className="flex items-center mt-1">
                                <Users className="w-3 h-3 mr-1 text-on-surface-variant dark:text-on-surface-variant-dark" />
                                <span className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">
                                  {friend.mutual} mutual friends
                                </span>
                              </div>
                            </div>
                            {selectedFriends.includes(friend.id) && (
                              <CheckCircle className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                            )}
                          </div>
                        </MaterialCardContent>
                      </MaterialCard>
                    ))}
                  </div>
                </div>

                {/* Selected Count */}
                {selectedFriends.length > 0 && (
                  <MaterialCard elevation={2} className="bg-success-500/10 border-0">
                    <MaterialCardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-success-500" />
                          <span className="font-medium text-on-surface dark:text-on-surface-dark">
                            {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
                          </span>
                        </div>
                        <MaterialButton variant="text" size="sm" onClick={() => setSelectedFriends([])}>
                          Clear all
                        </MaterialButton>
                      </div>
                    </MaterialCardContent>
                  </MaterialCard>
                )}
              </MaterialCardContent>
            </MaterialCard>
          )}

          {/* Step 3: Recurring Bills */}
          {currentStep === 3 && (
            <MaterialCard elevation={3} className="border-0">
              <MaterialCardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-tertiary to-warning-500 dark:from-tertiary-dark dark:to-warning-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <MaterialCardTitle className="text-2xl text-on-surface dark:text-on-surface-dark">
                  Set Up Recurring Bills
                </MaterialCardTitle>
                <MaterialCardDescription className="text-base">
                  Choose bills you want to split regularly with your friends
                </MaterialCardDescription>
              </MaterialCardHeader>
              
              <MaterialCardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {recurringBills.map((bill) => (
                    <MaterialCard
                      key={bill.id}
                      elevation={selectedBills.includes(bill.id) ? 3 : 1}
                      className={cn(
                        "cursor-pointer transition-all duration-200 border-0",
                        selectedBills.includes(bill.id) 
                          ? "ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark" 
                          : "hover:scale-105"
                      )}
                      onClick={() => toggleBill(bill.id)}
                    >
                      <MaterialCardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br", bill.color)}>
                              {bill.icon}
                            </div>
                            {selectedBills.includes(bill.id) && (
                              <CheckCircle className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-on-surface dark:text-on-surface-dark">{bill.name}</h3>
                            <p className="text-2xl font-bold text-on-surface dark:text-on-surface-dark mt-1">{bill.amount}</p>
                            <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">{bill.frequency}</p>
                          </div>
                        </div>
                      </MaterialCardContent>
                    </MaterialCard>
                  ))}
                </div>

                {/* Custom Bill Option */}
                <MaterialCard elevation={2} className="border-2 border-dashed border-outline dark:border-outline-dark bg-surface-container dark:bg-surface-container-dark">
                  <MaterialCardContent className="p-6 text-center">
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-primary-container-light dark:bg-primary-container-dark rounded-2xl mx-auto flex items-center justify-center">
                        <Plus className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-on-surface dark:text-on-surface-dark mb-2">Add Custom Bill</h3>
                        <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                          Create your own recurring expense category
                        </p>
                      </div>
                    </div>
                  </MaterialCardContent>
                </MaterialCard>

                {/* Selected Bills Summary */}
                {selectedBills.length > 0 && (
                  <MaterialCard elevation={2} className="bg-primary-container-light/20 dark:bg-primary-container-dark/20 border-0">
                    <MaterialCardContent className="p-6">
                      <h3 className="font-semibold text-on-surface dark:text-on-surface-dark mb-4">
                        Selected Bills Summary
                      </h3>
                      <div className="space-y-3">
                        {selectedBills.map((billId) => {
                          const bill = recurringBills.find(b => b.id === billId)
                          return bill ? (
                            <div key={billId} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br", bill.color)}>
                                  {bill.icon}
                                </div>
                                <span className="font-medium text-on-surface dark:text-on-surface-dark">{bill.name}</span>
                              </div>
                              <span className="font-bold text-on-surface dark:text-on-surface-dark">{bill.amount}</span>
                            </div>
                          ) : null
                        })}
                        <div className="border-t border-outline-variant dark:border-outline-variant-dark pt-3 mt-3">
                          <div className="flex items-center justify-between font-bold text-on-surface dark:text-on-surface-dark">
                            <span>Total Monthly</span>
                            <span>
                              ₹{selectedBills.reduce((total, billId) => {
                                const bill = recurringBills.find(b => b.id === billId)
                                return total + (bill ? parseInt(bill.amount.replace(/[₹,]/g, '')) : 0)
                              }, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </MaterialCardContent>
                  </MaterialCard>
                )}
              </MaterialCardContent>
            </MaterialCard>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant dark:border-outline-variant-dark">
          <MaterialButton
            variant="outlined"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </MaterialButton>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  i + 1 <= currentStep 
                    ? "bg-primary-light dark:bg-primary-dark" 
                    : "bg-outline-variant dark:bg-outline-variant-dark"
                )}
              />
            ))}
          </div>

          <MaterialButton
            variant="filled"
            size="lg"
            onClick={handleNext}
            disabled={isLoading}
            loading={isLoading}
            elevation={2}
            className="px-8"
          >
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </MaterialButton>
        </div>
      </div>
    </div>
  )
}
