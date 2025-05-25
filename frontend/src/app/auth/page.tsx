"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, LogIn, UserPlus, ArrowLeft, TestTube } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  // Auto-redirect to login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

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

        {/* Right Panel - Auth Options */}
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
            {isMockMode && (
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 mb-4">
                <TestTube className="w-3 h-3 mr-1" />
                Demo Mode Active
              </Badge>
            )}
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Choose how you'd like to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </Link>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Redirecting to login in 3 seconds...</p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
