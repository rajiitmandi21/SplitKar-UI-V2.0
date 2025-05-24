"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Users, Shield, Gavel, Send, Bot } from "lucide-react"

interface EscalationSystemProps {
  dispute: any
  onEscalate: (disputeId: string, reason: string, moderatorType: string) => void
}

export function EscalationSystem({ dispute, onEscalate }: EscalationSystemProps) {
  const [showEscalationDialog, setShowEscalationDialog] = useState(false)
  const [escalationReason, setEscalationReason] = useState("")
  const [selectedModeratorType, setSelectedModeratorType] = useState("")

  const escalationCriteria = [
    {
      id: "complexity",
      title: "High Complexity",
      description: "Multiple expense categories, complex calculations",
      triggered: dispute.complexity === "high",
      weight: 30,
    },
    {
      id: "amount",
      title: "High Value",
      description: "Dispute amount exceeds ₹10,000",
      triggered: dispute.amount > 10000,
      weight: 25,
    },
    {
      id: "participants",
      title: "Large Group",
      description: "More than 5 participants involved",
      triggered: dispute.participants?.length > 5,
      weight: 20,
    },
    {
      id: "deadlock",
      title: "Voting Deadlock",
      description: "Equal votes for and against after 48 hours",
      triggered: dispute.status === "deadlock",
      weight: 40,
    },
    {
      id: "appeals",
      title: "Multiple Appeals",
      description: "Resolution has been appealed more than once",
      triggered: dispute.appeals > 1,
      weight: 35,
    },
    {
      id: "emotional",
      title: "Emotional Intensity",
      description: "High emotional content in discussions",
      triggered: dispute.emotionalScore > 7,
      weight: 30,
    },
  ]

  const availableModerators = [
    {
      type: "financial_expert",
      title: "Financial Expert",
      description: "Specialized in complex financial disputes and calculations",
      availability: "2 hours",
      cost: "₹500",
    },
    {
      type: "group_dynamics",
      title: "Group Dynamics Specialist",
      description: "Expert in interpersonal conflicts and group psychology",
      availability: "4 hours",
      cost: "₹400",
    },
    {
      type: "senior_moderator",
      title: "Senior Moderator",
      description: "Experienced in high-stakes and complex disputes",
      availability: "1 hour",
      cost: "₹600",
    },
    {
      type: "legal_advisor",
      title: "Legal Advisor",
      description: "For disputes with potential legal implications",
      availability: "24 hours",
      cost: "₹800",
    },
  ]

  const triggeredCriteria = escalationCriteria.filter((c) => c.triggered)
  const escalationScore = triggeredCriteria.reduce((sum, c) => sum + c.weight, 0)
  const shouldEscalate = escalationScore >= 50

  const getEscalationLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "bg-red-100 text-red-800" }
    if (score >= 50) return { level: "High", color: "bg-orange-100 text-orange-800" }
    if (score >= 30) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Low", color: "bg-green-100 text-green-800" }
  }

  const escalationLevel = getEscalationLevel(escalationScore)

  const handleEscalate = () => {
    if (escalationReason.trim() && selectedModeratorType) {
      onEscalate(dispute.id, escalationReason, selectedModeratorType)
      setShowEscalationDialog(false)
      setEscalationReason("")
      setSelectedModeratorType("")
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800">Escalation Assessment</span>
          </div>
          <Badge className={escalationLevel.color}>{escalationLevel.level} Risk</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Escalation Score */}
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">Escalation Score</span>
            <span className="font-bold text-2xl text-orange-600">{escalationScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                escalationScore >= 80
                  ? "bg-red-500"
                  : escalationScore >= 50
                    ? "bg-orange-500"
                    : escalationScore >= 30
                      ? "bg-yellow-500"
                      : "bg-green-500"
              }`}
              style={{ width: `${Math.min(escalationScore, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Triggered Criteria */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Escalation Triggers</h4>
          <div className="space-y-2">
            {escalationCriteria.map((criteria) => (
              <div
                key={criteria.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  criteria.triggered ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${criteria.triggered ? "text-red-800" : "text-gray-700"}`}>
                    {criteria.title}
                  </p>
                  <p className={`text-xs ${criteria.triggered ? "text-red-600" : "text-gray-500"}`}>
                    {criteria.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${criteria.triggered ? "text-red-600" : "text-gray-500"}`}>
                    +{criteria.weight}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${criteria.triggered ? "bg-red-500" : "bg-gray-300"}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">AI Recommendation</span>
          </div>
          <p className="text-sm text-blue-700">
            {shouldEscalate
              ? "This dispute should be escalated to human moderation due to high complexity and risk factors."
              : "This dispute can likely be resolved through standard AI-assisted mediation."}
          </p>
        </div>

        {/* Escalation Actions */}
        {shouldEscalate && (
          <div className="space-y-3">
            <div className="bg-orange-100 p-3 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-800 mb-1">Escalation Recommended</p>
              <p className="text-xs text-orange-600">
                This dispute meets the criteria for human moderator intervention.
              </p>
            </div>

            <Dialog open={showEscalationDialog} onOpenChange={setShowEscalationDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Escalate to Human Moderator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Escalate Dispute to Human Moderator</DialogTitle>
                  <DialogDescription>
                    Select the appropriate moderator type and provide context for the escalation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Moderator Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select Moderator Type</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {availableModerators.map((moderator) => (
                        <div
                          key={moderator.type}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedModeratorType === moderator.type
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedModeratorType(moderator.type)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{moderator.title}</h4>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">{moderator.cost}</p>
                              <p className="text-xs text-gray-500">ETA: {moderator.availability}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{moderator.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escalation Reason */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Escalation Context</label>
                    <Textarea
                      placeholder="Provide additional context about why this dispute needs human intervention..."
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Escalation Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Escalation Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Dispute Amount</p>
                        <p className="font-medium">₹{dispute.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Participants</p>
                        <p className="font-medium">{dispute.participants?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Escalation Score</p>
                        <p className="font-medium text-orange-600">{escalationScore}/100</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Priority Level</p>
                        <p className="font-medium">{escalationLevel.level}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setShowEscalationDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEscalate}
                      disabled={!escalationReason.trim() || !selectedModeratorType}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Escalate Dispute
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Alternative Actions */}
        {!shouldEscalate && (
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Gavel className="w-4 h-4 mr-2" />
              Continue AI Mediation
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Request Group Discussion
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
