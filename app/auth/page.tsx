"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { IndianRupee, Mail, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const handlePhoneAuth = async () => {
    setIsLoading(true)
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtp(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleGoogleAuth = () => {
    // Simulate Google auth
    window.location.href = "/onboarding"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel - Illustration */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-teal-500 to-indigo-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Welcome to SplitKar!</h2>
              <p className="text-teal-100 mb-8 text-lg">
                Join thousands of users who've made expense splitting effortless. No more awkward money conversations!
              </p>

              {/* Illustration */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-400 rounded-full mx-auto mb-2 flex items-center justify-center font-bold">
                      R
                    </div>
                    <p className="text-sm">Raj</p>
                  </div>
                  <div className="text-center">
                    <IndianRupee className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">₹800</p>
                    <p className="text-xs opacity-75">Pizza Night</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-400 rounded-full mx-auto mb-2 flex items-center justify-center font-bold">
                      S
                    </div>
                    <p className="text-sm">Sneha</p>
                  </div>
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">Split Equally - ₹400 each</Button>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        {/* Right Panel - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SplitKar</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Welcome Back!</CardTitle>
                  <CardDescription>Sign in to your account to continue splitting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Auth Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleGoogleAuth} className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Google
                    </Button>
                    <Button variant="outline" onClick={() => setShowOtp(!showOtp)} className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  {/* Email Login */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Button variant="link" className="px-0 text-sm">
                        Forgot password?
                      </Button>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                      Sign In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join SplitKar and start splitting expenses effortlessly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Auth Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleGoogleAuth} className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Google
                    </Button>
                    <Button variant="outline" onClick={() => setShowOtp(!showOtp)} className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  {/* Phone OTP Section */}
                  {showOtp && (
                    <div className="space-y-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <div>
                        <Label htmlFor="phone">Mobile Number</Label>
                        <div className="flex mt-1">
                          <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                            <span className="text-sm text-gray-600">+91</span>
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>

                      {phoneNumber.length === 10 && (
                        <div>
                          <Label htmlFor="otp">OTP</Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">OTP sent to +91 {phoneNumber}</p>
                        </div>
                      )}

                      <Button
                        onClick={handlePhoneAuth}
                        disabled={isLoading || phoneNumber.length !== 10}
                        className="w-full"
                      >
                        {isLoading ? "Sending OTP..." : phoneNumber.length === 10 ? "Verify OTP" : "Send OTP"}
                      </Button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  {/* Email Signup */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" type="text" placeholder="Rahul Sharma" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="rahul@example.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Button variant="link" className="px-0 h-auto text-sm">
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="px-0 h-auto text-sm">
                          Privacy Policy
                        </Button>
                      </Label>
                    </div>

                    <Link href="/onboarding">
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
