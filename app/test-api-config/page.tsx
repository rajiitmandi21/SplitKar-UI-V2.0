"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, RefreshCw, Server, Globe, Key } from "lucide-react"
import { API_CONFIG } from "@/lib/config/api"

export default function TestApiConfigPage() {
  const [healthStatus, setHealthStatus] = useState<"checking" | "healthy" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")
  const [apiDetails, setApiDetails] = useState({
    baseUrl: API_CONFIG.BASE_URL,
    hasApiKey: !!API_CONFIG.API_KEY,
    timeout: API_CONFIG.TIMEOUT,
  })

  const checkHealth = async () => {
    setHealthStatus("checking")
    setErrorMessage("")

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        headers: {
          "X-API-Key": API_CONFIG.API_KEY,
        },
      })

      if (response.ok) {
        setHealthStatus("healthy")
      } else {
        setHealthStatus("error")
        setErrorMessage(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      setHealthStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Configuration Test</h1>

      <div className="grid gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Current API settings and environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Base URL</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{apiDetails.baseUrl}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Key</span>
              <Badge variant={apiDetails.hasApiKey ? "default" : "destructive"}>
                {apiDetails.hasApiKey ? "Configured" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Timeout</span>
              <span className="text-sm text-muted-foreground">{apiDetails.timeout}ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Backend Health Check
            </CardTitle>
            <CardDescription>Test connection to the backend API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {healthStatus === "checking" && <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />}
                {healthStatus === "healthy" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {healthStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                <span className="font-medium">
                  {healthStatus === "checking" && "Checking..."}
                  {healthStatus === "healthy" && "Backend is healthy"}
                  {healthStatus === "error" && "Backend is unreachable"}
                </span>
              </div>
              <Button onClick={checkHealth} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Environment Variables
            </CardTitle>
            <CardDescription>Required environment variables for the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-mono text-sm">
                <div className="text-muted-foreground"># Frontend (.env.local)</div>
                <div>NEXT_PUBLIC_API_URL={API_CONFIG.BASE_URL}</div>
                <div>API_KEY={apiDetails.hasApiKey ? "[CONFIGURED]" : "[NOT SET]"}</div>
              </div>
              <div className="font-mono text-sm mt-4">
                <div className="text-muted-foreground"># Backend (.env)</div>
                <div>PORT=5000</div>
                <div>DATABASE_URL=[YOUR_DATABASE_URL]</div>
                <div>JWT_SECRET=[YOUR_JWT_SECRET]</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common troubleshooting steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Alert>
              <AlertDescription>
                <strong>Backend not running?</strong> Run these commands:
                <pre className="mt-2 text-xs">
                  {`cd backend
npm install
npm run build
npm start`}
                </pre>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Frontend not connecting?</strong> Check your .env.local:
                <pre className="mt-2 text-xs">
                  {`NEXT_PUBLIC_API_URL=http://localhost:5000/api
API_KEY=your-api-key-here`}
                </pre>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
