"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertCircle, CheckCircle, XCircle, Send, Copy, Terminal, Bug, Network, Shield } from "lucide-react"

interface ApiCall {
  id: string
  method: string
  url: string
  status: number | null
  statusText: string
  headers: Record<string, string>
  requestBody: any
  responseBody: any
  error: string | null
  timestamp: Date
  duration: number
}

export default function ApiDebugPage() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([])
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null)
  const [isRecording, setIsRecording] = useState(true)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("password123")

  // API Configuration
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  // Intercept fetch to log API calls
  useEffect(() => {
    if (!isRecording) return

    const originalFetch = window.fetch
    window.fetch = async function (...args) {
      const startTime = Date.now()
      const [resource, config] = args
      const url = resource.toString()

      // Only log API calls
      if (!url.includes("/api/")) {
        return originalFetch.apply(this, args)
      }

      const callId = Math.random().toString(36).substr(2, 9)
      const method = config?.method || "GET"

      let requestBody = null
      if (config?.body) {
        try {
          requestBody = JSON.parse(config.body as string)
        } catch {
          requestBody = config.body
        }
      }

      const newCall: ApiCall = {
        id: callId,
        method,
        url,
        status: null,
        statusText: "Pending",
        headers: (config?.headers as Record<string, string>) || {},
        requestBody,
        responseBody: null,
        error: null,
        timestamp: new Date(),
        duration: 0,
      }

      setApiCalls((prev) => [newCall, ...prev].slice(0, 50)) // Keep last 50 calls

      try {
        const response = await originalFetch.apply(this, args)
        const duration = Date.now() - startTime

        let responseBody = null
        const clonedResponse = response.clone()
        try {
          responseBody = await clonedResponse.json()
        } catch {
          responseBody = await clonedResponse.text()
        }

        setApiCalls((prev) =>
          prev.map((call) =>
            call.id === callId
              ? {
                  ...call,
                  status: response.status,
                  statusText: response.statusText,
                  responseBody,
                  duration,
                }
              : call,
          ),
        )

        return response
      } catch (error: any) {
        const duration = Date.now() - startTime

        setApiCalls((prev) =>
          prev.map((call) =>
            call.id === callId
              ? {
                  ...call,
                  status: 0,
                  statusText: "Failed",
                  error: error.message,
                  duration,
                }
              : call,
          ),
        )

        throw error
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [isRecording])

  // Test API Calls
  const testHealthCheck = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`)
      const data = await response.json()
      console.log("Health check response:", data)
    } catch (error) {
      console.error("Health check failed:", error)
    }
  }

  const testRegistration = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          name: "Test User",
          email: testEmail,
          password: testPassword,
          upi_id: "test@paytm",
        }),
      })
      const data = await response.json()
      console.log("Registration response:", data)
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  const testLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })
      const data = await response.json()
      console.log("Login response:", data)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const clearCalls = () => {
    setApiCalls([])
    setSelectedCall(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: number | null) => {
    if (!status) return "text-gray-500"
    if (status >= 200 && status < 300) return "text-green-600"
    if (status >= 300 && status < 400) return "text-blue-600"
    if (status >= 400 && status < 500) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (status: number | null) => {
    if (!status) return <AlertCircle className="w-4 h-4" />
    if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4" />
    if (status >= 400) return <XCircle className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Debugger</h1>
            <p className="text-gray-600 mt-1">Monitor and debug API calls in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            {isMockMode && (
              <Badge variant="outline" className="bg-purple-100">
                Mock Mode
              </Badge>
            )}
            <Badge variant={isRecording ? "default" : "secondary"}>{isRecording ? "Recording" : "Paused"}</Badge>
          </div>
        </div>

        {/* DevTools Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Browser DevTools Guide
            </CardTitle>
            <CardDescription>Follow these steps to debug API calls using Chrome/Firefox DevTools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Opening DevTools
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-mono">F12</span>
                    <span>Press F12 to open DevTools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-mono">Ctrl+Shift+I</span>
                    <span>Alternative shortcut (Cmd+Option+I on Mac)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">Right-click</span>
                    <span>Right-click → Inspect Element</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Network Tab
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>1. Click the "Network" tab in DevTools</li>
                  <li>2. Filter by "Fetch/XHR" to see API calls</li>
                  <li>3. Click on any request to see details</li>
                  <li>4. Check Headers, Preview, Response tabs</li>
                  <li>5. Look for red entries (failed requests)</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> Keep DevTools open before making API calls to capture all network activity.
                Use "Preserve log" checkbox to keep history across page reloads.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoints</CardTitle>
            <CardDescription>Click buttons below to test different API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Test Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Test Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="password123"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={testHealthCheck} variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Health Check
              </Button>
              <Button onClick={testRegistration} variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Test Registration
              </Button>
              <Button onClick={testLogin} variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Test Login
              </Button>
              <Button onClick={() => setIsRecording(!isRecording)} variant={isRecording ? "secondary" : "default"}>
                {isRecording ? "Pause Recording" : "Resume Recording"}
              </Button>
              <Button onClick={clearCalls} variant="destructive">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Calls List */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Calls</CardTitle>
              <CardDescription>{apiCalls.length} calls recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {apiCalls.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No API calls recorded yet. Try making some requests!</p>
                ) : (
                  apiCalls.map((call) => (
                    <div
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCall?.id === call.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {call.method}
                          </Badge>
                          <span className={`flex items-center gap-1 ${getStatusColor(call.status)}`}>
                            {getStatusIcon(call.status)}
                            {call.status || "Failed"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{call.duration}ms</span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm font-mono truncate">{call.url}</p>
                        <p className="text-xs text-gray-500">{call.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call Details */}
          <Card>
            <CardHeader>
              <CardTitle>Call Details</CardTitle>
              <CardDescription>
                {selectedCall ? "Click tabs to view different aspects" : "Select a call to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCall ? (
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="request">Request</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">URL:</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedCall.url)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{selectedCall.url}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Method:</span>
                        <p className="font-mono">{selectedCall.method}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <p className={`font-mono ${getStatusColor(selectedCall.status)}`}>
                          {selectedCall.status} {selectedCall.statusText}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p className="font-mono">{selectedCall.duration}ms</p>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <p className="font-mono text-xs">{selectedCall.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    {selectedCall.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{selectedCall.error}</AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="headers" className="space-y-2">
                    <div className="space-y-2">
                      {Object.entries(selectedCall.headers || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="font-mono text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="request">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Request Body:</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(JSON.stringify(selectedCall.requestBody, null, 2))}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-[400px]">
                        {JSON.stringify(selectedCall.requestBody, null, 2) || "No request body"}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="response">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Response Body:</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(JSON.stringify(selectedCall.responseBody, null, 2))}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-[400px]">
                        {JSON.stringify(selectedCall.responseBody, null, 2) || "No response body"}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an API call to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Common API Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600">CORS Error</h3>
                <p className="text-sm">
                  <strong>Symptom:</strong> "Access-Control-Allow-Origin" error in console
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Ensure backend has CORS middleware enabled for localhost:3000
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600">Connection Refused</h3>
                <p className="text-sm">
                  <strong>Symptom:</strong> "Failed to fetch" or "ECONNREFUSED"
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Check if backend is running on port 5000
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-600">401 Unauthorized</h3>
                <p className="text-sm">
                  <strong>Symptom:</strong> API returns 401 status code
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Check if JWT token is being sent in Authorization header
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-600">400 Bad Request</h3>
                <p className="text-sm">
                  <strong>Symptom:</strong> API returns 400 with validation errors
                </p>
                <p className="text-sm">
                  <strong>Solution:</strong> Check request body format and required fields
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
