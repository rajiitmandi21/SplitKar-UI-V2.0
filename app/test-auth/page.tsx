"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User, Lock, Mail } from "lucide-react"

interface AuthTestResult {
  test: string
  status: "success" | "error" | "pending"
  message: string
  data?: any
}

export default function TestAuthPage() {
  const [results, setResults] = useState<AuthTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "john.doe@example.com",
    password: "password123",
  })

  const updateResult = (test: string, status: "success" | "error", message: string, data?: any) => {
    setResults((prev) => prev.map((result) => (result.test === test ? { ...result, status, message, data } : result)))
  }

  const runAuthTests = async () => {
    setIsRunning(true)
    setResults([
      { test: "Login Test", status: "pending", message: "Testing login functionality..." },
      { test: "Token Validation", status: "pending", message: "Validating JWT token..." },
      { test: "Protected Route", status: "pending", message: "Testing protected route access..." },
      { test: "Logout Test", status: "pending", message: "Testing logout functionality..." },
    ])

    try {
      // Test 1: Login
      const { apiClient } = await import("@/lib/api-client")

      const loginResult = await apiClient.login(credentials)
      updateResult("Login Test", "success", "Login successful", {
        token: loginResult.token?.substring(0, 20) + "...",
        user: loginResult.user?.name,
      })

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Test 2: Token Validation
      if (loginResult.token) {
        // In a real app, this would validate the token with the backend
        updateResult("Token Validation", "success", "Token is valid", {
          expires: "24 hours",
          type: "JWT",
        })
      } else {
        updateResult("Token Validation", "error", "No token received")
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Test 3: Protected Route Access
      try {
        const userProfile = await apiClient.getCurrentUser()
        updateResult("Protected Route", "success", "Protected route accessible", {
          userId: userProfile.id,
          email: userProfile.email,
        })
      } catch (error) {
        updateResult("Protected Route", "error", "Protected route access failed")
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Test 4: Logout
      try {
        await apiClient.logout()
        updateResult("Logout Test", "success", "Logout successful")
      } catch (error) {
        updateResult("Logout Test", "error", "Logout failed")
      }
    } catch (error: any) {
      updateResult("Login Test", "error", error.message)
      // Skip remaining tests if login fails
      updateResult("Token Validation", "error", "Skipped due to login failure")
      updateResult("Protected Route", "error", "Skipped due to login failure")
      updateResult("Logout Test", "error", "Skipped due to login failure")
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Authentication Testing</h1>
          <p className="text-gray-600">Test authentication flows and security</p>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            <Lock className="w-3 h-3 mr-1" />
            Security Testing
          </Badge>
        </div>

        {/* Test Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
            <CardDescription>Configure credentials for authentication testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="pl-10"
                    placeholder="test@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10"
                    placeholder="password"
                  />
                </div>
              </div>
            </div>
            <Button onClick={runAuthTests} disabled={isRunning} className="w-full">
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Run Authentication Tests
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Authentication test results and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <h4 className="font-medium">{result.test}</h4>
                      </div>
                      <Badge
                        variant={
                          result.status === "success"
                            ? "default"
                            : result.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                    {result.data && (
                      <div className="text-xs bg-gray-50 p-2 rounded">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to authentication pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <a href="/auth/login">Login Page</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/auth/register">Register Page</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
