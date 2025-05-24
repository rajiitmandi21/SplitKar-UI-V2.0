"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, CreditCard, DollarSign, Users, ExternalLink } from "lucide-react"

interface WhatsAppReminderProps {
  defaultData?: {
    recipientName?: string
    recipientPhone?: string
    amount?: number
    currency?: string
    expenseName?: string
    groupName?: string
    senderName?: string
    senderUpiId?: string
  }
  onSent?: () => void
}

export default function WhatsAppReminder({ defaultData, onSent }: WhatsAppReminderProps) {
  const [formData, setFormData] = useState({
    recipientName: defaultData?.recipientName || "",
    recipientPhone: defaultData?.recipientPhone || "",
    amount: defaultData?.amount || 0,
    currency: defaultData?.currency || "₹",
    expenseName: defaultData?.expenseName || "",
    groupName: defaultData?.groupName || "",
    senderName: defaultData?.senderName || "",
    senderUpiId: defaultData?.senderUpiId || "",
  })

  const [previewMessage, setPreviewMessage] = useState("")
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    generatePreview({ ...formData, [name]: value })
  }

  const generatePreview = (data: typeof formData) => {
    let message = `Hi ${data.recipientName || "there"}! 👋\n\n`
    message += `This is a friendly reminder from ${data.senderName || "me"} about a pending payment.\n\n`

    if (data.expenseName) {
      message += `💰 *Expense:* ${data.expenseName}\n`
    }

    if (data.groupName) {
      message += `👥 *Group:* ${data.groupName}\n`
    }

    message += `💵 *Amount Due:* ${data.currency}${data.amount.toFixed(2)}\n\n`
    message += `You can pay me using UPI:\n`
    message += `🏦 *UPI ID:* ${data.senderUpiId || "your-upi-id"}\n\n`
    message += `Or you can use any UPI app like:\n`
    message += `• Google Pay\n`
    message += `• PhonePe\n`
    message += `• Paytm\n`
    message += `• BHIM\n\n`
    message += `Thanks! 😊\n\n`
    message += `_Sent via SplitKar - Smart Expense Splitting_`

    setPreviewMessage(message)
  }

  const validateForm = () => {
    if (!formData.recipientPhone) {
      setError("Recipient phone number is required")
      return false
    }

    if (!formData.amount || formData.amount <= 0) {
      setError("Amount must be greater than 0")
      return false
    }

    if (!formData.senderUpiId) {
      setError("Your UPI ID is required")
      return false
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    const cleanPhone = formData.recipientPhone.replace(/[^\d+]/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid phone number")
      return false
    }

    // Basic UPI ID validation
    const upiRegex = /^[\w.-]+@[\w.-]+$/
    if (!upiRegex.test(formData.senderUpiId)) {
      setError("Please enter a valid UPI ID")
      return false
    }

    setError("")
    return true
  }

  const generateWhatsAppUrl = () => {
    if (!validateForm()) {
      return null
    }

    // Clean phone number (remove spaces, dashes, etc.)
    let cleanPhone = formData.recipientPhone.replace(/[^\d+]/g, "")

    // Remove leading + if present
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1)
    }

    // Add country code if not present (assuming India +91 for now)
    if (cleanPhone.length === 10 && !cleanPhone.startsWith("91")) {
      cleanPhone = "91" + cleanPhone
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(previewMessage)

    // Generate WhatsApp URL
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  const handleSendReminder = () => {
    const whatsappUrl = generateWhatsAppUrl()
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank")
      onSent?.()
    }
  }

  // Generate preview on component mount
  React.useEffect(() => {
    generatePreview(formData)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            WhatsApp Payment Reminder
          </CardTitle>
          <CardDescription>Send a friendly payment reminder via WhatsApp with UPI details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <div className="relative">
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="Friend's name"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Recipient Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="recipientPhone"
                  name="recipientPhone"
                  placeholder="+91 9876543210"
                  value={formData.recipientPhone}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Due *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderUpiId">Your UPI ID *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="senderUpiId"
                  name="senderUpiId"
                  placeholder="your-upi@paytm"
                  value={formData.senderUpiId}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Expense Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseName">Expense Name</Label>
              <Input
                id="expenseName"
                name="expenseName"
                placeholder="Dinner at restaurant"
                value={formData.expenseName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="groupName"
                  name="groupName"
                  placeholder="College Friends"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderName">Your Name</Label>
            <Input
              id="senderName"
              name="senderName"
              placeholder="Your name"
              value={formData.senderName}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Message Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Message Preview</CardTitle>
          <CardDescription>This is how your WhatsApp message will look</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <MessageCircle className="w-3 h-3 mr-1" />
                WhatsApp Message
              </Badge>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{previewMessage}</pre>
          </div>

          <div className="mt-4 flex gap-3">
            <Button onClick={handleSendReminder} className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send via WhatsApp
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              This will open WhatsApp with the pre-filled message. You can edit it before sending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
