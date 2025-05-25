"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, Loader2, Heart } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [healthStatus, setHealthStatus] = useState<any>(null)

  const checkEmailHealth = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test/email-health")
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus({ success: false, error: "Failed to connect to backend" })
    }
  }

  const sendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, error: "Please enter an email address" })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/api/test/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to send test email. Is the backend running?",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check health on mount
  useState(() => {
    checkEmailHealth()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Service Test</h1>
          <p className="text-gray-600">Test your Gmail OAuth2 email configuration</p>
        </div>

        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Email Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Service Status:</span>
                  {healthStatus.success ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Unhealthy
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>OAuth2 Credentials:</span>
                  {healthStatus.hasOAuth2Credentials ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Missing
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Environment:</span>
                  <Badge variant="outline">{healthStatus.environment || "unknown"}</Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking health...
              </div>
            )}
            <Button onClick={checkEmailHealth} variant="outline" className="mt-4 w-full">
              Refresh Health Status
            </Button>
          </CardContent>
        </Card>

        {/* Test Email Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Test Email
            </CardTitle>
            <CardDescription>Enter an email address to send a test verification email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button onClick={sendTestEmail} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {result.message}
                      </p>
                      <p className="text-sm">Verification URL:</p>
                      <code className="text-xs bg-gray-100 p-2 rounded block break-all">{result.verificationUrl}</code>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        {result.error}
                      </p>
                      {result.details && <p className="text-sm text-gray-600">{result.details}</p>}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Backend Setup</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                cd backend && npm install && npm run build && npm start
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Environment Variables</h3>
              <p className="text-sm text-gray-600">Make sure these are set in your backend .env file:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• GMAIL_USER</li>
                <li>• GMAIL_CLIENT_ID</li>
                <li>• GMAIL_CLIENT_SECRET</li>
                <li>• GMAIL_REFRESH_TOKEN</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Test Registration</h3>
              <p className="text-sm text-gray-600">
                Once email is working, test the full registration flow at{" "}
                <a href="/auth/register" className="text-blue-600 hover:underline">
                  /auth/register
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
