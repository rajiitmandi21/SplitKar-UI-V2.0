"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard, MaterialCardContent, MaterialCardDescription, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { MaterialInput } from "@/components/ui/material-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SplitKarLogo, SplitKarIcon } from "@/components/ui/splitkar-logo"
import { IndianRupee, Mail, Phone, Eye, EyeOff, ArrowLeft, Sparkles, TrendingUp, Users, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function MaterialAuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    upi_id: ""
  })
  
  const { login, register } = useAuth()
  const router = useRouter()

  const handlePhoneAuth = async () => {
    setIsLoading(true)
    setError("")
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShowOtp(true)
      setSuccess("OTP sent successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = "/onboarding"
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await login(email, password)
      setSuccess("Login successful! Redirecting...")
      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      await register(signupData)
      setSuccess("Account created successfully! Please check your email for verification.")
      setTimeout(() => router.push("/auth/verify"), 2000)
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Material Design Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/10 dark:to-secondary/10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 dark:bg-primary-dark/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/8 dark:bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-tertiary/5 dark:bg-tertiary-dark/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Theme Toggle with enhanced styling */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Panel - Enhanced Material Design Illustration */}
        <div className="hidden lg:block">
          <MaterialCard elevation={4} className="p-12 text-on-surface dark:text-on-surface-dark bg-gradient-to-br from-primary-container-light to-secondary-container dark:from-primary-container-dark dark:to-secondary-container-dark border-0 shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold mb-4 text-on-primary-container-light dark:text-on-primary-container-dark leading-tight">
                  Welcome to SplitKar!
                </h2>
                <p className="text-on-surface-variant dark:text-on-surface-variant-dark mb-8 text-xl leading-relaxed">
                  Join thousands of users who've made expense splitting effortless. No more awkward money conversations!
                </p>
              </div>

              {/* Enhanced Material Illustration with better spacing */}
              <MaterialCard elevation={3} className="p-8 bg-surface-container-highest dark:bg-surface-container-highest-dark border-0">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-tertiary to-error rounded-full mx-auto flex items-center justify-center font-bold text-xl text-on-tertiary shadow-lg ring-4 ring-white/20">
                      R
                    </div>
                    <p className="text-sm font-semibold text-on-surface dark:text-on-surface-dark">Raj</p>
                  </div>
                  <div className="text-center space-y-3">
                    <MaterialCard elevation={2} className="bg-primary-container-light dark:bg-primary-container-dark rounded-2xl p-4 border-0">
                      <IndianRupee className="w-10 h-10 mx-auto text-on-primary-container-light dark:text-on-primary-container-dark" />
                    </MaterialCard>
                    <p className="font-bold text-2xl text-on-surface dark:text-on-surface-dark">₹800</p>
                    <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark bg-surface-container dark:bg-surface-container-dark rounded-full px-3 py-1.5 font-medium">Pizza Night</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg ring-4 ring-white/20">
                      S
                    </div>
                    <p className="text-sm font-semibold text-on-surface dark:text-on-surface-dark">Sneha</p>
                  </div>
                </div>
                <MaterialButton variant="filled" className="w-full bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark text-lg py-4" elevation={2}>
                  Split Equally - ₹400 each
                </MaterialButton>
              </MaterialCard>

              {/* Enhanced feature highlights with better spacing and icons */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-tertiary/10 dark:bg-tertiary-dark/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Sparkles className="w-6 h-6 text-tertiary dark:text-tertiary-dark" />
                  </div>
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark text-lg font-medium">Split bills instantly with friends</p>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="w-6 h-6 text-primary-light dark:text-primary-dark" />
                  </div>
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark text-lg font-medium">Track expenses in real-time</p>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Users className="w-6 h-6 text-secondary-light dark:text-secondary" />
                  </div>
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark text-lg font-medium">Manage groups effortlessly</p>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-success-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Shield className="w-6 h-6 text-success-500" />
                  </div>
                  <p className="text-on-surface-variant dark:text-on-surface-variant-dark text-lg font-medium">Secure UPI integration</p>
                </div>
              </div>
            </div>
          </MaterialCard>
        </div>

        {/* Right Panel - Enhanced Material Auth Forms */}
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-6">
            <Link href="/" className="inline-flex items-center text-primary-light dark:text-primary-dark hover:text-primary/80 mb-4 transition-colors duration-200 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
            <div className="mb-6">
              <SplitKarLogo size="lg" showRupee={true} showTagline={true} />
            </div>
          </div>

          {/* Enhanced Success/Error Messages */}
          {(error || success) && (
            <div className="space-y-3">
              {error && (
                <Alert variant="destructive" className="border-error bg-error-container text-on-error-container dark:bg-error-container-dark dark:text-on-error-container-dark">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-success-500 bg-success-500/10 text-success-700 dark:text-success-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{success}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-surface-container dark:bg-surface-container-dark p-1.5 rounded-2xl h-14">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-primary-light data-[state=active]:text-on-primary-light dark:data-[state=active]:bg-primary-dark dark:data-[state=active]:text-on-primary-dark data-[state=active]:shadow-lg transition-all duration-200 rounded-xl text-base font-semibold h-11"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <MaterialCard elevation={4} className="border-0 shadow-2xl">
                <MaterialCardHeader className="text-center pb-6">
                  <MaterialCardTitle className="text-3xl text-on-surface dark:text-on-surface-dark mb-2">
                    Welcome Back!
                  </MaterialCardTitle>
                  <MaterialCardDescription className="text-base">
                    Sign in to your account to continue splitting
                  </MaterialCardDescription>
                </MaterialCardHeader>
                <MaterialCardContent className="space-y-8">
                  {/* Enhanced Quick Auth Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <MaterialButton 
                      variant="outlined" 
                      onClick={handleGoogleAuth} 
                      className="w-full h-12 text-base font-semibold"
                      elevation={1}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Google
                    </MaterialButton>
                    <MaterialButton 
                      variant="outlined" 
                      onClick={() => setShowOtp(!showOtp)} 
                      className="w-full h-12 text-base font-semibold"
                      elevation={1}
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Phone
                    </MaterialButton>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="bg-outline dark:bg-outline-dark" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-surface dark:bg-surface-dark px-4 text-on-surface-variant dark:text-on-surface-variant-dark font-medium">Or continue with email</span>
                    </div>
                  </div>

                  {/* Enhanced Email Login Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-on-surface dark:text-on-surface-dark font-semibold text-base">Email</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="h-12 text-base bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark focus:border-primary-light dark:focus:border-primary-dark rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-on-surface dark:text-on-surface-dark font-semibold text-base">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 text-base pr-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark focus:border-primary-light dark:focus:border-primary-dark rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                        <MaterialButton
                          type="button"
                          variant="text"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-4 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </MaterialButton>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="remember" className="border-outline dark:border-outline-dark data-[state=checked]:bg-primary-light dark:data-[state=checked]:bg-primary-dark w-5 h-5" />
                        <Label htmlFor="remember" className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark font-medium">
                          Remember me
                        </Label>
                      </div>
                      <MaterialButton variant="text" className="px-0 text-sm font-semibold">
                        Forgot password?
                      </MaterialButton>
                    </div>

                    <MaterialButton 
                      type="submit" 
                      variant="filled"
                      className="w-full h-12 bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark text-base font-semibold"
                      disabled={isLoading}
                      elevation={2}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </MaterialButton>
                  </form>
                </MaterialCardContent>
              </MaterialCard>
            </TabsContent>

            <TabsContent value="signup">
              <MaterialCard elevation={4} className="border-0 shadow-2xl">
                <MaterialCardHeader className="text-center pb-6">
                  <MaterialCardTitle className="text-3xl text-on-surface dark:text-on-surface-dark mb-2">
                    Create Account
                  </MaterialCardTitle>
                  <MaterialCardDescription className="text-base">
                    Join SplitKar and start splitting expenses effortlessly
                  </MaterialCardDescription>
                </MaterialCardHeader>
                <MaterialCardContent className="space-y-8">
                  {/* Enhanced Quick Auth Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <MaterialButton 
                      variant="outlined" 
                      onClick={handleGoogleAuth} 
                      className="w-full h-12 text-base font-semibold"
                      elevation={1}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Google
                    </MaterialButton>
                    <MaterialButton 
                      variant="outlined" 
                      onClick={() => setShowOtp(!showOtp)} 
                      className="w-full h-12 text-base font-semibold"
                      elevation={1}
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Phone
                    </MaterialButton>
                  </div>

                  {/* Enhanced Phone OTP Section */}
                  {showOtp && (
                    <MaterialCard elevation={2} className="p-6 bg-secondary-container dark:bg-secondary-container-dark border-0">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-on-secondary-container dark:text-on-secondary-container-dark font-semibold">Mobile Number</Label>
                          <div className="flex">
                            <div className="flex items-center px-4 bg-surface-container dark:bg-surface-container-dark border border-r-0 rounded-l-xl h-12">
                              <span className="text-sm text-on-surface dark:text-on-surface-dark font-semibold">+91</span>
                            </div>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="9876543210"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="rounded-l-none h-12 text-base"
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        {phoneNumber.length === 10 && (
                          <div className="space-y-2">
                            <Label htmlFor="otp" className="text-on-secondary-container dark:text-on-secondary-container-dark font-semibold">OTP</Label>
                            <Input
                              id="otp"
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="h-12 text-base"
                              disabled={isLoading}
                            />
                            <p className="text-sm text-on-secondary-container dark:text-on-secondary-container-dark font-medium">OTP sent to +91 {phoneNumber}</p>
                          </div>
                        )}

                        <MaterialButton
                          onClick={handlePhoneAuth}
                          disabled={isLoading || phoneNumber.length !== 10}
                          variant="filled"
                          className="w-full h-12 text-base font-semibold"
                          elevation={1}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Sending OTP...
                            </>
                          ) : phoneNumber.length === 10 ? "Verify OTP" : "Send OTP"}
                        </MaterialButton>
                      </div>
                    </MaterialCard>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="bg-outline dark:bg-outline-dark" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-surface dark:bg-surface-dark px-4 text-on-surface-variant dark:text-on-surface-variant-dark font-medium">Or continue with email</span>
                    </div>
                  </div>

                  {/* Enhanced Email Signup Form */}
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-on-surface dark:text-on-surface-dark font-semibold text-base">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Rahul Sharma" 
                        className="h-12 text-base bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl" 
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-on-surface dark:text-on-surface-dark font-semibold text-base">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="rahul@example.com" 
                        className="h-12 text-base bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl" 
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-on-surface dark:text-on-surface-dark font-semibold text-base">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password (min 8 characters)"
                          className="h-12 text-base pr-12 bg-surface-container-highest dark:bg-surface-container-highest-dark border-outline dark:border-outline-dark rounded-xl"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          required
                          disabled={isLoading}
                        />
                        <MaterialButton
                          type="button"
                          variant="text"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-4 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </MaterialButton>
                      </div>
                      <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">Password must be at least 8 characters long</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" className="border-outline dark:border-outline-dark data-[state=checked]:bg-primary-light dark:data-[state=checked]:bg-primary-dark w-5 h-5 mt-0.5" />
                      <Label htmlFor="terms" className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark leading-relaxed">
                        I agree to the{" "}
                        <MaterialButton variant="text" className="px-0 h-auto text-sm font-semibold underline">
                          Terms of Service
                        </MaterialButton>{" "}
                        and{" "}
                        <MaterialButton variant="text" className="px-0 h-auto text-sm font-semibold underline">
                          Privacy Policy
                        </MaterialButton>
                      </Label>
                    </div>

                    <MaterialButton 
                      type="submit"
                      variant="filled"
                      className="w-full h-12 bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark text-base font-semibold"
                      disabled={isLoading}
                      elevation={2}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </MaterialButton>
                  </form>
                </MaterialCardContent>
              </MaterialCard>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-on-surface-variant dark:text-on-surface-variant-dark leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer font-semibold">Terms of Service</span>
            {" "}and{" "}
            <span className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer font-semibold">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
