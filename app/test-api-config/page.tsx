"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildApiUrl, API_CONFIG } from "@/lib/config/api"
import { apiClient } from "@/lib/api-client"

export default function TestApiConfig() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApiConfig = () => {
    const config = {
      BASE_URL: API_CONFIG.BASE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
      testUrl: buildApiUrl("auth/login"),
      healthUrl: buildApiUrl("../health"),
    }
    setTestResult(config)
  }

  const testApiCall = async () => {
    setLoading(true)
    try {
      const response = await apiClient.login("test@example.com", "password")
      setTestResult({ success: true, response })
    } catch (error: any) {
      setTestResult({ success: false, error: error.message, stack: error.stack })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testApiConfig}>Test API Config</Button>
          <Button onClick={testApiCall} disabled={loading}>
            {loading ? "Testing API Call..." : "Test API Call"}
          </Button>
          
          {testResult && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
