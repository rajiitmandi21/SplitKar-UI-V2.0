"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThumbsUp, ThumbsDown, Clock, Vote, AlertCircle, CheckCircle, Gavel, XCircle } from "lucide-react"

interface DisputeVotingProps {
  dispute: any
  currentUser: string
  onVote: (disputeId: string, vote: "agree" | "disagree", comment?: string) => void
  onRequestMediation: (disputeId: string) => void
}

export function DisputeVoting({ dispute, currentUser, onVote, onRequestMediation }: DisputeVotingProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<"agree" | "disagree" | null>(null)
  const [comment, setComment] = useState("")
  const [showMediationDialog, setShowMediationDialog] = useState(false)

  const userVote = dispute.votes?.find((v: any) => v.member === currentUser)
  const hasVoted = userVote && userVote.vote !== "pending"

  const voteResults = {
    agree: dispute.votes?.filter((v: any) => v.vote === "agree").length || 0,
    disagree: dispute.votes?.filter((v: any) => v.vote === "disagree").length || 0,
    pending: dispute.votes?.filter((v: any) => v.vote === "pending").length || 0,
  }

  const totalVotes = dispute.votes?.length || 0
  const completedVotes = voteResults.agree + voteResults.disagree
  const voteProgress = totalVotes > 0 ? (completedVotes / totalVotes) * 100 : 0

  const handleVote = () => {
    if (selectedVote) {
      onVote(dispute.id, selectedVote, comment.trim() || undefined)
      setIsVoting(false)
      setSelectedVote(null)
      setComment("")
    }
  }

  const getVoteOutcome = () => {
    if (completedVotes === totalVotes) {
      const majority = Math.ceil(totalVotes / 2)
      if (voteResults.agree >= majority) return "approved"
      if (voteResults.disagree >= majority) return "rejected"
    }
    return "pending"
  }

  const outcome = getVoteOutcome()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="w-5 h-5 text-blue-500" />
            <span>Voting Status</span>
          </div>
          <Badge
            className={
              outcome === "approved"
                ? "bg-green-100 text-green-800"
                : outcome === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }
          >
            {outcome === "pending" ? "In Progress" : outcome}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vote Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Voting Progress</span>
            <span className="text-gray-600">
              {completedVotes} / {totalVotes} votes
            </span>
          </div>
          <Progress value={voteProgress} className="h-3 mb-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-800">{voteResults.agree}</span>
              </div>
              <p className="text-xs text-green-600">Agree</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                <span className="font-bold text-red-800">{voteResults.disagree}</span>
              </div>
              <p className="text-xs text-red-600">Disagree</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-gray-700">{voteResults.pending}</span>
              </div>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        {/* Individual Votes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Member Votes</h4>
          <div className="space-y-3">
            {dispute.votes?.map((vote: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                      {vote.member === "You" ? "Y" : vote.member.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{vote.member}</span>
                    {vote.timestamp && <p className="text-xs text-gray-500">{vote.timestamp}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {vote.vote === "agree" && (
                    <>
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Agree</span>
                    </>
                  )}
                  {vote.vote === "disagree" && (
                    <>
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Disagree</span>
                    </>
                  )}
                  {vote.vote === "pending" && (
                    <>
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Pending</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Actions */}
        {!hasVoted && dispute.status === "voting" && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Cast Your Vote</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant={selectedVote === "agree" ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedVote === "agree" ? "bg-green-500 hover:bg-green-600" : ""
                  }`}
                  onClick={() => setSelectedVote("agree")}
                >
                  <ThumbsUp className="w-6 h-6" />
                  <span>Agree</span>
                  <span className="text-xs opacity-75">Support the proposed change</span>
                </Button>
                <Button
                  variant={selectedVote === "disagree" ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedVote === "disagree" ? "bg-red-500 hover:bg-red-600" : ""
                  }`}
                  onClick={() => setSelectedVote("disagree")}
                >
                  <ThumbsDown className="w-6 h-6" />
                  <span>Disagree</span>
                  <span className="text-xs opacity-75">Keep the original split</span>
                </Button>
              </div>

              <div className="mb-4">
                <Textarea
                  placeholder="Add a comment to explain your vote (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleVote}
                  disabled={!selectedVote}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Submit Vote
                </Button>
                <Dialog open={showMediationDialog} onOpenChange={setShowMediationDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Gavel className="w-4 h-4 mr-2" />
                      Request Mediation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Mediation</DialogTitle>
                      <DialogDescription>
                        If you feel this dispute needs neutral intervention, you can request mediation. This will pause
                        voting and bring in a mediator to help resolve the issue.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-orange-800">What happens next?</span>
                        </div>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• Voting will be paused</li>
                          <li>• A neutral mediator will review the case</li>
                          <li>• All parties will be contacted for input</li>
                          <li>• A fair resolution will be proposed</li>
                        </ul>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setShowMediationDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            onRequestMediation(dispute.id)
                            setShowMediationDialog(false)
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Request Mediation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}

        {/* Already Voted */}
        {hasVoted && (
          <div className="border-t pt-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">You voted: {userVote.vote}</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Thank you for participating! Waiting for other members to vote.
              </p>
            </div>
          </div>
        )}

        {/* Outcome */}
        {outcome !== "pending" && (
          <div className="border-t pt-4">
            <div
              className={`p-4 rounded-lg border ${
                outcome === "approved" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {outcome === "approved" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${outcome === "approved" ? "text-green-800" : "text-red-800"}`}>
                  {outcome === "approved" ? "Dispute Approved" : "Dispute Rejected"}
                </span>
              </div>
              <p className={`text-sm ${outcome === "approved" ? "text-green-600" : "text-red-600"}`}>
                {outcome === "approved"
                  ? "The proposed changes will be applied to the expense."
                  : "The original split will remain unchanged."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
