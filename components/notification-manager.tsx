"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Mail,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  IndianRupee,
  Link as LinkIcon,
  Calendar,
  Bell
} from "lucide-react"

interface NotificationManagerProps {
  expenseData?: {
    id: string
    title: string
    amount: number
    currency: string
    groupName?: string
    participants: Array<{
      id: string
      name: string
      email: string
      amount: number
      hasPaid: boolean
    }>
  }
  onNotificationSent?: (data: any) => void
}

interface NotificationTemplate {
  id: string
  name: string
  type: 'reminder' | 'nudge'
  description: string
  defaultSubject: string
  icon: React.ReactNode
}

export default function NotificationManager({ expenseData, onNotificationSent }: NotificationManagerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState("")
  const [includePaymentLink, setIncludePaymentLink] = useState(true)
  const [scheduleDelay, setScheduleDelay] = useState(0) // 0 = send now
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const templates: NotificationTemplate[] = [
    {
      id: 'gentle-reminder',
      name: 'Gentle Reminder',
      type: 'reminder',
      description: 'Friendly payment reminder with payment link',
      defaultSubject: 'Payment Reminder',
      icon: <Mail className="w-4 h-4" />
    },
    {
      id: 'urgent-reminder',
      name: 'Urgent Reminder',
      type: 'reminder',
      description: 'More urgent payment reminder for overdue payments',
      defaultSubject: 'Urgent: Payment Required',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'friendly-nudge',
      name: 'Friendly Nudge',
      type: 'nudge',
      description: 'Gentle nudge for payments that are a few days overdue',
      defaultSubject: 'Friendly Payment Nudge',
      icon: <Bell className="w-4 h-4" />
    },
    {
      id: 'final-notice',
      name: 'Final Notice',
      type: 'nudge',
      description: 'Final notice for significantly overdue payments',
      defaultSubject: 'Final Payment Notice',
      icon: <Clock className="w-4 h-4" />
    }
  ]

  const unpaidParticipants = expenseData?.participants.filter(p => !p.hasPaid) || []

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    )
  }

  const selectAllUnpaid = () => {
    setSelectedParticipants(unpaidParticipants.map(p => p.id))
  }

  const clearSelection = () => {
    setSelectedParticipants([])
  }

  const generatePaymentLink = async (participantId: string, amount: number): Promise<string> => {
    try {
      const participant = expenseData?.participants.find(p => p.id === participantId)
      if (!participant) throw new Error('Participant not found')

      // Create UPI payment link for this participant
      const response = await fetch('/api/upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiId: 'expense-creator@upi', // Replace with actual UPI ID
          payeeName: 'Expense Creator', // Replace with actual name
          amount: amount,
          currency: expenseData?.currency || 'INR',
          message: `Payment for ${expenseData?.title}`,
          transactionNote: `${expenseData?.groupName ? `${expenseData.groupName} - ` : ''}${expenseData?.title}`,
          expenseId: expenseData?.id,
          createdBy: 'current-user-id', // Replace with actual user ID
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error)

      return result.data.shortUrl
    } catch (error) {
      console.error('Error generating payment link:', error)
      throw error
    }
  }

  const sendNotifications = async () => {
    if (!selectedTemplate || selectedParticipants.length === 0) {
      alert('Please select a template and at least one participant')
      return
    }

    setLoading(true)
    const notificationResults: any[] = []

    try {
      const template = templates.find(t => t.id === selectedTemplate)
      
      for (const participantId of selectedParticipants) {
        const participant = expenseData?.participants.find(p => p.id === participantId)
        if (!participant) continue

        try {
          // Generate payment link if enabled
          let paymentLink = ''
          if (includePaymentLink) {
            paymentLink = await generatePaymentLink(participantId, participant.amount)
          }

          // Send email notification
          const emailResponse = await fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: template?.type,
              recipientEmail: participant.email,
              recipientName: participant.name,
              senderName: 'Current User', // Replace with actual sender name
              amount: participant.amount,
              currency: expenseData?.currency || 'INR',
              expenseTitle: expenseData?.title,
              groupName: expenseData?.groupName,
              paymentLink: paymentLink,
              dueDate: null, // Add due date logic if needed
              daysSinceReminder: 3 // Calculate actual days if needed
            })
          })

          const emailResult = await emailResponse.json()
          
          notificationResults.push({
            participantId,
            participantName: participant.name,
            participantEmail: participant.email,
            success: emailResult.success,
            paymentLink: paymentLink,
            error: emailResult.error
          })

        } catch (error) {
          notificationResults.push({
            participantId,
            participantName: participant.name,
            participantEmail: participant.email,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      setResults(notificationResults)
      onNotificationSent?.(notificationResults)

    } catch (error) {
      console.error('Error sending notifications:', error)
      alert('Failed to send notifications')
    } finally {
      setLoading(false)
    }
  }

  if (!expenseData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Expense Selected</h3>
          <p className="text-gray-600">Select an expense to send payment reminders</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Expense Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            {expenseData.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold">₹{expenseData.amount.toFixed(2)} {expenseData.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unpaid Participants</p>
              <p className="text-xl font-bold text-red-600">{unpaidParticipants.length}</p>
            </div>
          </div>
          {expenseData.groupName && (
            <Badge variant="outline" className="mb-2">
              {expenseData.groupName}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Notification Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start gap-3">
                  {template.icon}
                  <div className="flex-1">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {template.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participant Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Recipients</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllUnpaid}>
                Select All Unpaid
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unpaidParticipants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedParticipants.includes(participant.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant.id)}
                    onChange={() => handleParticipantToggle(participant.id)}
                    className="rounded"
                  />
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-gray-600">{participant.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">₹{participant.amount.toFixed(2)}</p>
                  <Badge variant="destructive" className="text-xs">
                    Unpaid
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Include Payment Link</Label>
              <p className="text-sm text-gray-600">Generate UPI payment links for easy payment</p>
            </div>
            <Switch
              checked={includePaymentLink}
              onCheckedChange={setIncludePaymentLink}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal message to the notification..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Send Timing</Label>
            <Select value={scheduleDelay.toString()} onValueChange={(value) => setScheduleDelay(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Send Now</SelectItem>
                <SelectItem value="1">Send in 1 hour</SelectItem>
                <SelectItem value="24">Send in 1 day</SelectItem>
                <SelectItem value="72">Send in 3 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Send Button */}
      <Card>
        <CardContent className="p-6">
          <Button
            onClick={sendNotifications}
            disabled={loading || !selectedTemplate || selectedParticipants.length === 0}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Notifications...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to {selectedParticipants.length} Participant{selectedParticipants.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.participantName}</p>
                      <p className="text-sm text-gray-600">{result.participantEmail}</p>
                      {result.error && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {result.success && result.paymentLink && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Link Generated</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 