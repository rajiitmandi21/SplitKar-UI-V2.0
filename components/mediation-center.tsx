"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Gavel, MessageSquare, Clock, CheckCircle, FileText, Send, Bot, Scale } from "lucide-react"

interface MediationCenterProps {
  dispute: any
  onSubmitEvidence: (evidence: string) => void
  onAcceptResolution: (disputeId: string) => void
  onRejectResolution: (disputeId: string) => void
}

export function MediationCenter({
  dispute,
  onSubmitEvidence,
  onAcceptResolution,
  onRejectResolution,
}: MediationCenterProps) {
  const [evidence, setEvidence] = useState("")
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)

  const mediationSteps = [
    { id: 1, title: "Evidence Collection", status: "completed", description: "Gather all relevant information" },
    { id: 2, title: "Analysis", status: "in_progress", description: "Review dispute details and evidence" },
    { id: 3, title: "Resolution Proposal", status: "pending", description: "Propose fair solution" },
    { id: 4, title: "Final Decision", status: "pending", description: "Implement agreed resolution" },
  ]

  const aiInsights = [
    {
      type: "pattern",
      title: "Spending Pattern Analysis",
      insight: "Amit typically orders 40% more expensive items in group dinners based on historical data.",
      confidence: 85,
    },
    {
      type: "fairness",
      title: "Fairness Assessment",
      insight: "The proposed split aligns with actual consumption patterns and is 78% more fair than equal split.",
      confidence: 92,
    },
    {
      type: "precedent",
      title: "Group Precedent",
      insight: "This group has previously agreed to consumption-based splits in 3 out of 4 similar disputes.",
      confidence: 70,
    },
  ]

  const proposedResolution = {
    title: "Mediated Resolution",
    description: "Based on evidence and group patterns, here's the recommended fair split:",
    newSplit: {
      you: 250,
      priya: 250,
      amit: 450,
      sneha: 250,
    },
    reasoning: [
      "Amit ordered the most expensive items (₹450 worth)",
      "Shared appetizers split equally among all members",
      "Drinks consumed proportionally to main course orders",
      "Consistent with group's previous agreements",
    ],
    compensation: "Amit pays additional ₹150, others pay ₹50 less each",
  }

  const getStepStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Mediation Header */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Gavel className="w-5 h-5" />
            <span>Mediation in Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Mediator: AI Assistant</p>
              <p className="text-xs text-orange-600">Expected resolution: 24-48 hours</p>
            </div>
            <Badge className="bg-orange-100 text-orange-800">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mediation Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-500" />
            <span>Mediation Process</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mediationSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">{getStepIcon(step.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <Badge className={getStepStatus(step.status)}>{step.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-500" />
            <span>AI Analysis & Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900">{insight.title}</h4>
                  <Badge className="bg-purple-100 text-purple-800">{insight.confidence}% confidence</Badge>
                </div>
                <p className="text-sm text-purple-700">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-500" />
            <span>Submit Additional Evidence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showEvidenceForm ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-4">
                Have additional information that could help resolve this dispute?
              </p>
              <Button variant="outline" onClick={() => setShowEvidenceForm(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Add Evidence
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Provide any additional context, receipts, or information that could help resolve this dispute..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowEvidenceForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onSubmitEvidence(evidence)
                    setEvidence("")
                    setShowEvidenceForm(false)
                  }}
                  disabled={!evidence.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Evidence
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposed Resolution */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Gavel className="w-5 h-5" />
            <span>{proposedResolution.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-blue-700">{proposedResolution.description}</p>

          {/* New Split Breakdown */}
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-3">Recommended Split</h4>
            <div className="space-y-2">
              {Object.entries(proposedResolution.newSplit).map(([member, amount]) => {
                const originalAmount = dispute.originalSplit[member]
                const difference = amount - originalAmount
                return (
                  <div key={member} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                          {member === "you" ? "Y" : member.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium capitalize">{member}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">₹{amount}</span>
                      {difference !== 0 && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            difference > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {difference > 0 ? "+" : ""}₹{difference}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
            <ul className="space-y-1">
              {proposedResolution.reasoning.map((reason, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compensation Summary */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">{proposedResolution.compensation}</p>
          </div>

          {/* Resolution Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onRejectResolution(dispute.id)}
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              Reject Resolution
            </Button>
            <Button
              onClick={() => onAcceptResolution(dispute.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept Resolution
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discussion Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span>Mediation Discussion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dispute.comments?.map((comment: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                    {comment.member === "You" ? "Y" : comment.member.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.member}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.message}</p>
                </div>
              </div>
            ))}

            {/* Mediator Comments */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-purple-800">AI Mediator</span>
                  <span className="text-xs text-purple-600">2 hours ago</span>
                </div>
                <p className="text-sm text-purple-700">
                  Based on the evidence and group history, I've analyzed the consumption patterns and propose a fair
                  resolution. The recommended split considers actual consumption while maintaining group harmony.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
