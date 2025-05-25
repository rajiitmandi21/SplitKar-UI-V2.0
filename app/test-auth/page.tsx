"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testRegistration = async () => {
    setIsLoading(true)
    try {
      const result = await apiClient.register({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
        upi_id: `test${Date.now()}@paytm`,
      })
      addResult("✅ Registration successful")
    } catch (error: any) {
      addResult(`❌ Registration failed: ${error.message}`)
    }
    setIsLoading(false)
  }

  const testLogin = async () => {
    setIsLoading(true)
    try {
      const result = await apiClient.login({
        email: "john.doe@example.com",
        password: "password123",
      })
      addResult("✅ Login successful")
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.message}`)
    }
    setIsLoading(false)
  }

  const testProfile = async () => {
    setIsLoading(true)
    try {
      const profile = await apiClient.getProfile()
      addResult("✅ Profile fetch successful")

      const updated = await apiClient.updateProfile({
        name: "Updated Test User",
      })
      addResult("✅ Profile update successful")
    } catch (error: any) {
      addResult(`❌ Profile test failed: ${error.message}`)
    }
    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Authentication Testing</h1>
          <p className="text-gray-600">Test registration, login, and profile updates</p>
          {isMockMode && (
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              Mock Mode Active
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>Run authentication tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testRegistration} disabled={isLoading} className="w-full">
                Test Registration
              </Button>

              <Button onClick={testLogin} disabled={isLoading} className="w-full">
                Test Login
              </Button>

              <Button onClick={testProfile} disabled={isLoading} className="w-full">
                Test Profile Update
              </Button>

              <Button onClick={clearResults} variant="outline" className="w-full">
                Clear Results
              </Button>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Real-time test output</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tests run yet</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Accounts</CardTitle>
            <CardDescription>Available test accounts for login testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">John Doe</h4>
                <p className="text-sm text-gray-600">Email: john.doe@example.com</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Jane Smith</h4>
                <p className="text-sm text-gray-600">Email: jane.smith@example.com</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
