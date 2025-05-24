"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runApiTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const tests = [
      {
        name: "Health Check",
        endpoint: "/health",
        method: "GET",
        requiresAuth: false,
      },
      {
        name: "API Key Validation",
        endpoint: "/api/auth/health",
        method: "GET",
        requiresAuth: false,
      },
      {
        name: "Rate Limiting Test",
        endpoint: "/api/auth/health",
        method: "GET",
        requiresAuth: false,
        multiple: true,
      },
    ]

    for (const test of tests) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"
        const url = `${baseUrl}${test.endpoint}`

        const headers: any = {
          "Content-Type": "application/json",
        }

        if (test.requiresAuth !== false) {
          headers["X-API-Key"] = process.env.NEXT_PUBLIC_API_KEY
        }

        const startTime = Date.now()

        if (test.multiple) {
          // Test rate limiting by making multiple requests
          const promises = Array(5)
            .fill(null)
            .map(() => fetch(url, { method: test.method, headers }))
          const responses = await Promise.all(promises)
          const endTime = Date.now()

          const successCount = responses.filter((r) => r.ok).length
          const rateLimitedCount = responses.filter((r) => r.status === 429).length

          setTestResults((prev) => [
            ...prev,
            {
              ...test,
              status: successCount > 0 ? "success" : "error",
              responseTime: endTime - startTime,
              details: `${successCount} successful, ${rateLimitedCount} rate limited`,
            },
          ])
        } else {
          const response = await fetch(url, { method: test.method, headers })
          const endTime = Date.now()
          const data = await response.json()

          setTestResults((prev) => [
            ...prev,
            {
              ...test,
              status: response.ok ? "success" : "error",
              responseTime: endTime - startTime,
              statusCode: response.status,
              details: data.message || data.error || "Success",
            },
          ])
        }
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            ...test,
            status: "error",
            details: error instanceof Error ? error.message : "Unknown error",
          },
        ])
      }
    }

    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Configuration Test</h1>
        <p className="text-gray-600">Test your API key configuration and backend connectivity</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>Current environment configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">API URL</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {process.env.NEXT_PUBLIC_API_URL || "Not configured"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">API Key</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {process.env.NEXT_PUBLIC_API_KEY
                  ? `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 8)}...`
                  : "Not configured"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mock Mode</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true" ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Run tests to verify API connectivity and authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runApiTests} disabled={isLoading} className="mb-6">
            {isLoading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run API Tests"
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    {result.responseTime && <span className="text-sm text-gray-500">{result.responseTime}ms</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Endpoint:</strong> {result.endpoint}
                    </p>
                    {result.statusCode && (
                      <p>
                        <strong>Status Code:</strong> {result.statusCode}
                      </p>
                    )}
                    <p>
                      <strong>Details:</strong> {result.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
