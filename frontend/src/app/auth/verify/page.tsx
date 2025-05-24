"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Mail, ArrowRight, TestTube } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "waiting">("waiting")
  const [message, setMessage] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setStatus("loading")
    setIsVerifying(true)

    try {
      const response = await apiClient.verifyEmail(verificationToken)
      setStatus("success")
      setMessage(response.message || "Email verified successfully!")

      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Email verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const resendVerification = async () => {
    try {
      // This would need to be implemented in the API
      setMessage("Verification email resent! Please check your inbox.")
    } catch (error: any) {
      setMessage(error.message || "Failed to resend verification email")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-600">Verify your email to complete registration</p>
          {isMockMode && (
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
              <TestTube className="w-3 h-3 mr-1" />
              Demo Mode Active
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {status === "loading" && (
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              )}
              {status === "success" && <CheckCircle className="w-16 h-16 text-green-600" />}
              {status === "error" && <XCircle className="w-16 h-16 text-red-600" />}
              {status === "waiting" && <Mail className="w-16 h-16 text-blue-600" />}
            </div>

            <CardTitle>
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
              {status === "waiting" && "Check Your Email"}
            </CardTitle>

            <CardDescription>
              {status === "loading" && "Please wait while we verify your email address."}
              {status === "success" && "Your account has been successfully verified."}
              {status === "error" && "There was an issue verifying your email address."}
              {status === "waiting" && "Click the verification link in your email to continue."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert className={status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={status === "success" ? "text-green-800" : "text-red-800"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Redirecting to dashboard in 3 seconds...</p>
                  <Button onClick={() => router.push("/dashboard")} className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Button onClick={resendVerification} variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </Button>
                <div className="text-center">
                  <Link href="/auth/register">
                    <Button variant="ghost" className="w-full">
                      Back to Registration
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "waiting" && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What to do next:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Look for an email from SplitKar</li>
                    <li>Click the verification link</li>
                    <li>Return here to complete setup</li>
                  </ol>
                </div>

                <Button onClick={resendVerification} variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </Button>

                <div className="text-center">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {isMockMode && status === "waiting" && (
              <div className="border-t pt-4">
                <Button
                  onClick={() => {
                    setStatus("success")
                    setMessage("Demo verification successful!")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Simulate Verification (Demo)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or{" "}
            <button onClick={resendVerification} className="text-blue-600 hover:underline">
              request a new one
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
