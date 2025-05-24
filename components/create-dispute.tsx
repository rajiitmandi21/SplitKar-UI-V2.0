"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Flag, Users, Calculator, Clock, FileText, Send } from "lucide-react"

interface CreateDisputeProps {
  expenseId: string
  expenseTitle: string
  expenseAmount: number
  currentSplit: { [key: string]: number }
  members: Array<{ id: string; name: string }>
  onDisputeCreated: (dispute: any) => void
}

export function CreateDispute({
  expenseId,
  expenseTitle,
  expenseAmount,
  currentSplit,
  members,
  onDisputeCreated,
}: CreateDisputeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [disputeType, setDisputeType] = useState<string>("")
  const [reason, setReason] = useState("")
  const [proposedSplit, setProposedSplit] = useState<{ [key: string]: number }>(currentSplit)
  const [excludedMembers, setExcludedMembers] = useState<string[]>([])
  const [priority, setPriority] = useState("medium")
  const [requestMediation, setRequestMediation] = useState(false)
  const [evidence, setEvidence] = useState("")

  const disputeTypes = [
    {
      id: "split_method",
      title: "Split Method",
      description: "Disagree with how the expense was split",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      id: "member_inclusion",
      title: "Member Inclusion",
      description: "Someone shouldn't be included or excluded",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "amount_verification",
      title: "Amount Verification",
      description: "Question the total expense amount",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "payment_responsibility",
      title: "Payment Responsibility",
      description: "Disagree with who should pay what",
      icon: <Clock className="w-5 h-5" />,
    },
  ]

  const handleProposedSplitChange = (memberId: string, amount: string) => {
    setProposedSplit((prev) => ({
      ...prev,
      [memberId]: Number.parseFloat(amount) || 0,
    }))
  }

  const handleMemberExclusion = (memberId: string, excluded: boolean) => {
    if (excluded) {
      setExcludedMembers((prev) => [...prev, memberId])
      setProposedSplit((prev) => {
        const newSplit = { ...prev }
        delete newSplit[memberId]
        return newSplit
      })
    } else {
      setExcludedMembers((prev) => prev.filter((id) => id !== memberId))
      setProposedSplit((prev) => ({
        ...prev,
        [memberId]: currentSplit[memberId] || 0,
      }))
    }
  }

  const autoBalanceSplit = () => {
    const includedMembers = members.filter((m) => !excludedMembers.includes(m.id))
    const equalAmount = expenseAmount / includedMembers.length

    const newSplit: { [key: string]: number } = {}
    includedMembers.forEach((member) => {
      newSplit[member.id] = equalAmount
    })
    setProposedSplit(newSplit)
  }

  const createDispute = () => {
    const dispute = {
      id: Date.now().toString(),
      expenseId,
      title: expenseTitle,
      amount: expenseAmount,
      description: `Dispute about ${disputeTypes.find((t) => t.id === disputeType)?.title.toLowerCase()}`,
      status: requestMediation ? "mediation" : "voting",
      priority,
      createdBy: "You",
      createdAt: "Just now",
      disputeType,
      originalSplit: currentSplit,
      proposedSplit,
      reason,
      evidence,
      votes: members.map((member) => ({
        member: member.name,
        vote: member.name === "You" ? "agree" : "pending",
        timestamp: member.name === "You" ? "Just now" : null,
      })),
      comments: [],
      group: "Current Group",
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      mediationRequested: requestMediation,
    }

    onDisputeCreated(dispute)
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setDisputeType("")
    setReason("")
    setProposedSplit(currentSplit)
    setExcludedMembers([])
    setPriority("medium")
    setRequestMediation(false)
    setEvidence("")
  }

  const totalProposed = Object.values(proposedSplit).reduce((sum, amount) => sum + amount, 0)
  const isValidSplit = Math.abs(totalProposed - expenseAmount) < 0.01

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="w-4 h-4 mr-2" />
          Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Create Dispute</span>
          </DialogTitle>
          <DialogDescription>
            Raise a concern about this expense. Your group members will vote to resolve the issue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expense Info */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{expenseTitle}</h4>
                  <p className="text-sm text-gray-600">Total: ₹{expenseAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Split</p>
                  <p className="font-semibold">₹{currentSplit.you || 0} (You)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Type */}
          <div>
            <Label className="text-base font-medium">What's the issue?</Label>
            <RadioGroup value={disputeType} onValueChange={setDisputeType} className="mt-3">
              <div className="grid grid-cols-1 gap-3">
                {disputeTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <label
                      htmlFor={type.id}
                      className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      {type.icon}
                      <div>
                        <p className="font-medium">{type.title}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Explain your concern</Label>
            <Textarea
              id="reason"
              placeholder="Describe why you disagree with the current split..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Member Inclusion (for member_inclusion disputes) */}
          {disputeType === "member_inclusion" && (
            <div>
              <Label className="text-base font-medium">Member Inclusion</Label>
              <div className="mt-3 space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                          {member.name === "You" ? "Y" : member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`exclude-${member.id}`}
                        checked={excludedMembers.includes(member.id)}
                        onCheckedChange={(checked) => handleMemberExclusion(member.id, checked as boolean)}
                      />
                      <Label htmlFor={`exclude-${member.id}`} className="text-sm">
                        Exclude
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposed Split (for split_method disputes) */}
          {disputeType === "split_method" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Proposed Split</Label>
                <Button variant="outline" size="sm" onClick={autoBalanceSplit}>
                  Auto Balance
                </Button>
              </div>
              <div className="space-y-3">
                {members
                  .filter((m) => !excludedMembers.includes(m.id))
                  .map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {member.name === "You" ? "Y" : member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">₹</span>
                        <Input
                          type="number"
                          value={proposedSplit[member.id] || ""}
                          onChange={(e) => handleProposedSplitChange(member.id, e.target.value)}
                          className="w-20 text-center"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div
                className={`mt-3 p-3 rounded-lg border ${
                  isValidSplit ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <p className="text-sm">
                  Total: ₹{totalProposed.toFixed(2)} / ₹{expenseAmount.toFixed(2)}
                  {!isValidSplit && (
                    <span className="ml-2 text-red-600">
                      (Difference: ₹{Math.abs(totalProposed - expenseAmount).toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Evidence */}
          <div>
            <Label htmlFor="evidence">Supporting Evidence (Optional)</Label>
            <Textarea
              id="evidence"
              placeholder="Add any receipts, screenshots, or additional context..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Priority & Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium">Priority</Label>
              <RadioGroup value={priority} onValueChange={setPriority} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Resolution</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mediation"
                    checked={requestMediation}
                    onCheckedChange={(checked) => setRequestMediation(checked as boolean)}
                  />
                  <Label htmlFor="mediation" className="text-sm">
                    Request immediate mediation
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={createDispute}
              disabled={!disputeType || !reason.trim() || (disputeType === "split_method" && !isValidSplit)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Create Dispute
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
