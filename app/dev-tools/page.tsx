"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Mail, CheckCircle, Clock, RefreshCw } from "lucide-react"

interface User {
  email: string
  name: string
  verification_token: string
  is_verified: boolean
  created_at: string
}

export default function DevToolsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  const fetchUnverifiedUsers = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Since we can't access the test endpoint, we'll get users from the database directly
      // For now, let's create a simple interface to manually add verification links
      setUsers([])
    } catch (err) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, email: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(email)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateVerificationLink = (token: string) => {
    return `${window.location.origin}/auth/verify?token=${token}`
  }

  // Manual verification links for development
  const manualUsers = [
    {
      email: "devtest@example.com",
      name: "Dev Test User", 
      verification_token: "627951d2a14499772de45936911a887684d6d3005887385f4d04d321670778c9",
      is_verified: false,
      created_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    fetchUnverifiedUsers()
  }, [])

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Dev tools are not available in production</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛠️ Development Tools</h1>
          <p className="text-gray-600">Tools for testing email verification and user management</p>
        </div>

        <div className="grid gap-6">
          {/* Verification Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Verification Links
              </CardTitle>
              <CardDescription>
                Since emails are not sent in development mode, use these links to verify accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Unverified Users</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchUnverifiedUsers}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Manual users for development */}
                <div className="space-y-3">
                  {manualUsers.map((user) => (
                    <div key={user.email} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={user.is_verified ? "default" : "secondary"}>
                          {user.is_verified ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {!user.is_verified && user.verification_token && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <Input
                              value={generateVerificationLink(user.verification_token)}
                              readOnly
                              className="text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generateVerificationLink(user.verification_token), user.email)}
                            >
                              <Copy className="w-4 h-4" />
                              {copied === user.email ? "Copied!" : "Copy"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.open(generateVerificationLink(user.verification_token), '_blank')}
                            >
                              Verify Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <Alert>
                  <AlertDescription>
                    <strong>How to use:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Register a new user through the normal signup flow</li>
                      <li>Add the user's verification token to this page manually (check database)</li>
                      <li>Click "Verify Now" or copy the link to verify the account</li>
                      <li>The user will be marked as verified and can log in</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common development tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => window.open('/auth/register', '_blank')}>
                  Test Registration
                </Button>
                <Button variant="outline" onClick={() => window.open('/auth/login', '_blank')}>
                  Test Login
                </Button>
                <Button variant="outline" onClick={() => window.open('/onboarding', '_blank')}>
                  Test Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 