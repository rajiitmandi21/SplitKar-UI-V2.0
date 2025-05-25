"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Smartphone,
  Copy,
  Share,
  QrCode,
  IndianRupee,
  Calendar,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Clock,
  BarChart3
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface UPIPaymentGeneratorProps {
  defaultData?: {
    upiId?: string
    payeeName?: string
    amount?: number
    message?: string
    expenseId?: string
    groupId?: string
    createdBy?: string
  }
  onLinkCreated?: (link: any) => void
  className?: string
}

interface UPIPaymentLink {
  id: string
  short_code: string
  upi_id: string
  payee_name: string
  amount?: number
  currency: string
  message?: string
  shortUrl: string
  upiUrl: string
  created_at: string
  expires_at?: string
  click_count: number
}

export default function UPIPaymentGenerator({ 
  defaultData, 
  onLinkCreated, 
  className 
}: UPIPaymentGeneratorProps) {
  const [formData, setFormData] = useState({
    upiId: defaultData?.upiId || '',
    payeeName: defaultData?.payeeName || '',
    amount: defaultData?.amount || '',
    currency: 'INR',
    message: defaultData?.message || '',
    transactionNote: '',
    hasExpiry: false,
    expiryDays: 7
  })

  const [generatedLink, setGeneratedLink] = useState<UPIPaymentLink | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  // Auto-generate message based on context
  useEffect(() => {
    if (!formData.message && defaultData?.expenseId) {
      const contextMessage = `Payment for expense via SplitKar`
      setFormData(prev => ({ ...prev, message: contextMessage }))
    }
  }, [defaultData?.expenseId, formData.message])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // UPI ID validation
    if (!formData.upiId) {
      errors.upiId = 'UPI ID is required'
    } else {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
      if (!upiRegex.test(formData.upiId)) {
        errors.upiId = 'Invalid UPI ID format (e.g., user@paytm)'
      }
    }

    // Payee name validation
    if (!formData.payeeName) {
      errors.payeeName = 'Payee name is required'
    } else if (formData.payeeName.length < 2) {
      errors.payeeName = 'Payee name must be at least 2 characters'
    }

    // Amount validation (optional but if provided, must be valid)
    if (formData.amount && (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)) {
      errors.amount = 'Amount must be a positive number'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const generatePaymentLink = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const expiresAt = formData.hasExpiry 
        ? new Date(Date.now() + formData.expiryDays * 24 * 60 * 60 * 1000).toISOString()
        : null

      const response = await fetch('/api/upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId: formData.upiId,
          payeeName: formData.payeeName,
          amount: formData.amount ? Number(formData.amount) : null,
          currency: formData.currency,
          message: formData.message,
          transactionNote: formData.transactionNote,
          createdBy: defaultData?.createdBy,
          expenseId: defaultData?.expenseId,
          groupId: defaultData?.groupId,
          expiresAt
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate payment link')
      }

      setGeneratedLink(result.data)
      onLinkCreated?.(result.data)

    } catch (err) {
      console.error('Error generating payment link:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate payment link')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLink = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Pay ${formData.payeeName} via UPI`,
          url
        })
      } catch (err) {
        console.error('Error sharing:', err)
        copyToClipboard(url, 'share')
      }
    } else {
      copyToClipboard(url, 'share')
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Generate UPI Payment Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* UPI ID */}
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID *</Label>
            <Input
              id="upiId"
              placeholder="user@paytm"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className={validationErrors.upiId ? 'border-red-500' : ''}
            />
            {validationErrors.upiId && (
              <p className="text-sm text-red-600">{validationErrors.upiId}</p>
            )}
          </div>

          {/* Payee Name */}
          <div className="space-y-2">
            <Label htmlFor="payeeName">Payee Name *</Label>
            <Input
              id="payeeName"
              placeholder="John Doe"
              value={formData.payeeName}
              onChange={(e) => handleInputChange('payeeName', e.target.value)}
              className={validationErrors.payeeName ? 'border-red-500' : ''}
            />
            {validationErrors.payeeName && (
              <p className="text-sm text-red-600">{validationErrors.payeeName}</p>
            )}
          </div>

          {/* Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount">Amount (Optional)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`pl-10 ${validationErrors.amount ? 'border-red-500' : ''}`}
                />
              </div>
              {validationErrors.amount && (
                <p className="text-sm text-red-600">{validationErrors.amount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Payment Message</Label>
            <Textarea
              id="message"
              placeholder="Payment for dinner at restaurant"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={2}
            />
          </div>

          {/* Transaction Note */}
          <div className="space-y-2">
            <Label htmlFor="transactionNote">Transaction Note (Internal)</Label>
            <Input
              id="transactionNote"
              placeholder="Internal note for tracking"
              value={formData.transactionNote}
              onChange={(e) => handleInputChange('transactionNote', e.target.value)}
            />
          </div>

          {/* Expiry Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Link Expiry</Label>
                <p className="text-sm text-gray-500">Set an expiration date for the payment link</p>
              </div>
              <Switch
                checked={formData.hasExpiry}
                onCheckedChange={(checked) => handleInputChange('hasExpiry', checked)}
              />
            </div>

            {formData.hasExpiry && (
              <div className="space-y-2">
                <Label htmlFor="expiryDays">Expires in (days)</Label>
                <Select 
                  value={formData.expiryDays.toString()} 
                  onValueChange={(value) => handleInputChange('expiryDays', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                    <SelectItem value="90">3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generatePaymentLink}
            disabled={loading || !formData.upiId || !formData.payeeName}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Generate Payment Link
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Link Display */}
      {generatedLink && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Payment Link Generated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Link Details */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Short URL:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {generatedLink.short_code}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Payment Link:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedLink.shortUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedLink.shortUrl, 'shortUrl')}
                  >
                    <Copy className="w-4 h-4" />
                    {copied.shortUrl ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">UPI Link:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedLink.upiUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedLink.upiUrl, 'upiUrl')}
                  >
                    <Copy className="w-4 h-4" />
                    {copied.upiUrl ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => shareLink(generatedLink.shortUrl, 'UPI Payment Link')}
                className="flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(generatedLink.shortUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>

            {/* Link Stats */}
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Link Statistics</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>Clicks: {generatedLink.click_count}</span>
                  {generatedLink.expires_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Expires: {new Date(generatedLink.expires_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your payment link has been generated with a secure short code. 
                Share this link only with trusted recipients.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 