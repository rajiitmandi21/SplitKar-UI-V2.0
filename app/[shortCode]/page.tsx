"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Smartphone, 
  Copy, 
  ExternalLink, 
  QrCode, 
  IndianRupee,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

interface UPIPaymentLink {
  id: string
  short_code: string
  upi_id: string
  payee_name: string
  amount?: number
  currency: string
  message?: string
  transaction_note?: string
  expense_title?: string
  group_name?: string
  creator_name?: string
  is_active: boolean
  expires_at?: string
  created_at: string
  shortUrl: string
  upiUrl: string
}

interface ShortUrl {
  id: string
  short_code: string
  original_url: string
  title?: string
  description?: string
  is_active: boolean
  expires_at?: string
}

export default function ShortCodeRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const shortCode = params.shortCode as string

  const [upiLink, setUpiLink] = useState<UPIPaymentLink | null>(null)
  const [shortUrl, setShortUrl] = useState<ShortUrl | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!shortCode) return

    const fetchLinkData = async () => {
      try {
        setLoading(true)
        
        // First try to fetch as UPI payment link
        const upiResponse = await fetch(`/api/upi/redirect/${shortCode}`)
        
        if (upiResponse.ok) {
          const upiData = await upiResponse.json()
          if (upiData.success && upiData.data) {
            setUpiLink(upiData.data)
            return
          }
        }

        // If not UPI link, try general short URL
        const urlResponse = await fetch(`/api/short-url/redirect/${shortCode}`)
        
        if (urlResponse.ok) {
          const urlData = await urlResponse.json()
          if (urlData.success && urlData.data) {
            setShortUrl(urlData.data)
            
            // Auto-redirect for general URLs after 3 seconds
            setTimeout(() => {
              setRedirecting(true)
              window.location.href = urlData.data.original_url
            }, 3000)
            return
          }
        }

        // If neither found
        setError('Link not found or has expired')
        
      } catch (err) {
        console.error('Error fetching link data:', err)
        setError('Failed to load link data')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [shortCode])

  const handleUPIPayment = () => {
    if (!upiLink) return
    
    // Track click
    fetch(`/api/upi/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        upiLinkId: upiLink.id,
        userAgent: navigator.userAgent,
        referer: document.referrer
      })
    }).catch(console.error)

    // Open UPI app
    window.location.href = upiLink.upiUrl
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Link Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                This payment link may have expired or been deactivated.
              </p>
              
              <div className="flex gap-2">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // UPI Payment Link Display
  if (upiLink) {
    const expired = isExpired(upiLink.expires_at)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">UPI Payment</CardTitle>
            <p className="text-gray-600">Secure payment via UPI</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {expired && (
              <Alert variant="destructive">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  This payment link has expired and is no longer valid.
                </AlertDescription>
              </Alert>
            )}

            {!expired && !upiLink.is_active && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This payment link has been deactivated.
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pay to:</span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{upiLink.payee_name}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">UPI ID:</span>
                <span className="font-mono text-sm">{upiLink.upi_id}</span>
              </div>

              {upiLink.amount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      {upiLink.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">{upiLink.currency}</span>
                  </div>
                </div>
              )}

              {upiLink.message && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Message:</span>
                  <p className="text-sm mt-1">{upiLink.message}</p>
                </div>
              )}
            </div>

            {/* Context Information */}
            {(upiLink.expense_title || upiLink.group_name) && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-blue-900">Payment Context</h4>
                {upiLink.expense_title && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Expense: {upiLink.expense_title}
                    </Badge>
                  </div>
                )}
                {upiLink.group_name && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Group: {upiLink.group_name}
                    </Badge>
                  </div>
                )}
                {upiLink.creator_name && (
                  <p className="text-sm text-blue-700">
                    Created by {upiLink.creator_name}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!expired && upiLink.is_active ? (
                <>
                  <Button 
                    onClick={handleUPIPayment}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    size="lg"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Pay with UPI
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(upiLink.upiUrl)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(upiLink.shortUrl)}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    This payment link is no longer available.
                  </p>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Secure Payment</p>
                  <p className="text-yellow-700">
                    This link is generated by SplitKar. Always verify the payee details before making payment.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // General Short URL Display
  if (shortUrl) {
    const expired = isExpired(shortUrl.expires_at)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Redirecting...</CardTitle>
            {shortUrl.title && (
              <p className="text-gray-600">{shortUrl.title}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {expired ? (
              <Alert variant="destructive">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  This link has expired and is no longer valid.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {shortUrl.description && (
                  <p className="text-sm text-gray-600 text-center">
                    {shortUrl.description}
                  </p>
                )}
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">Redirecting to:</p>
                  <p className="text-sm font-mono break-all">
                    {shortUrl.original_url}
                  </p>
                </div>

                {redirecting ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Redirecting...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      You will be redirected in 3 seconds...
                    </p>
                    <Button
                      onClick={() => window.location.href = shortUrl.original_url}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Go Now
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
} 