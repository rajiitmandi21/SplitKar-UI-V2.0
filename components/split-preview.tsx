"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight, CheckCircle, Share2, MessageSquare } from "lucide-react"

interface SplitPreviewProps {
  splits: { [key: string]: number }
  totalAmount: number
  description: string
  category: string
  paidBy: string
  members: Array<{ id: string; name: string }>
  onConfirm: () => void
  onShare: () => void
}

export function SplitPreview({
  splits,
  totalAmount,
  description,
  category,
  paidBy,
  members,
  onConfirm,
  onShare,
}: SplitPreviewProps) {
  const splitEntries = Object.entries(splits).filter(([_, amount]) => amount > 0)
  const isValid = Math.abs(Object.values(splits).reduce((sum, amount) => sum + amount, 0) - totalAmount) < 0.01

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-teal-800">
          <CheckCircle className="w-5 h-5" />
          <span>Split Preview</span>
          {isValid && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Valid
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expense Summary */}
        <div className="bg-white/60 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Description</span>
            <span className="font-medium">{description || "Untitled Expense"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Category</span>
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Paid By</span>
            <span className="font-medium capitalize">{paidBy}</span>
          </div>
        </div>

        {/* Split Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span className="font-medium text-teal-800">Split Breakdown</span>
          </div>

          {splitEntries.map(([memberId, amount]) => {
            const member = members.find((m) => m.id === memberId)
            if (!member) return null

            return (
              <div key={memberId} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-sm">
                      {member.name === "You" ? "Y" : member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">₹{amount.toFixed(2)}</span>
                  {memberId === paidBy && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Paid
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Settlement Summary */}
        <div className="bg-white/60 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Who Owes Whom</h4>
          <div className="space-y-2">
            {splitEntries
              .filter(([memberId]) => memberId !== paidBy)
              .map(([memberId, amount]) => {
                const member = members.find((m) => m.id === memberId)
                const payer = members.find((m) => m.id === paidBy)
                if (!member || !payer) return null

                return (
                  <div key={memberId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{member.name}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">{payer.name}</span>
                    </div>
                    <span className="font-bold text-red-600">₹{amount.toFixed(2)}</span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            disabled={!isValid}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Add Expense
          </Button>

          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Discuss
          </Button>
        </div>

        {!isValid && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-600">
              ⚠️ Split amounts don't match the total expense. Please adjust the split.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
