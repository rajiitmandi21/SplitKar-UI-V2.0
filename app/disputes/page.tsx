"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  AlertTriangle,
  Vote,
  MessageSquare,
  Clock,
  CheckCircle,
  Users,
  Gavel,
  IndianRupee,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Home,
} from "lucide-react"
import Link from "next/link"
import { EscalationSystem } from "@/components/escalation-system"

export default function DisputesPage() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null)

  const handleEscalation = (disputeId: string, reason: string, moderatorType: string) => {
    console.log(`Escalating dispute ${disputeId} to ${moderatorType}: ${reason}`)
    // Handle escalation logic here
  }

  const disputes = [
    {
      id: "1",
      expenseId: "exp_001",
      title: "Dinner at Cafe Coffee Day",
      amount: 1200,
      description: "Disagreement about who should pay more",
      status: "voting",
      priority: "medium",
      createdBy: "Amit",
      createdAt: "2 hours ago",
      disputeType: "split_method",
      originalSplit: { you: 300, priya: 300, amit: 300, sneha: 300 },
      proposedSplit: { you: 200, priya: 200, amit: 500, sneha: 300 },
      reason: "Amit ordered expensive items and should pay more",
      votes: [
        { member: "You", vote: "agree", timestamp: "1 hour ago" },
        { member: "Priya", vote: "agree", timestamp: "45 mins ago" },
        { member: "Sneha", vote: "pending", timestamp: null },
        { member: "Amit", vote: "disagree", timestamp: "30 mins ago" },
      ],
      comments: [
        {
          member: "You",
          message: "I agree, Amit did order the most expensive dish",
          timestamp: "1 hour ago",
        },
        {
          member: "Amit",
          message: "But we all shared the appetizers equally",
          timestamp: "45 mins ago",
        },
      ],
      group: "College Friends",
      deadline: "2024-01-15T18:00:00Z",
      mediationRequested: false,
    },
    {
      id: "2",
      expenseId: "exp_002",
      title: "Uber ride to airport",
      amount: 450,
      description: "Dispute about including Rohan who didn't travel",
      status: "mediation",
      priority: "high",
      createdBy: "Kavya",
      createdAt: "1 day ago",
      disputeType: "member_inclusion",
      originalSplit: { you: 90, priya: 90, rohan: 90, kavya: 90, arjun: 90 },
      proposedSplit: { you: 112.5, priya: 112.5, kavya: 112.5, arjun: 112.5 },
      reason: "Rohan didn't travel with us, shouldn't be included",
      votes: [
        { member: "You", vote: "agree", timestamp: "20 hours ago" },
        { member: "Priya", vote: "disagree", timestamp: "18 hours ago" },
        { member: "Rohan", vote: "disagree", timestamp: "16 hours ago" },
        { member: "Arjun", vote: "agree", timestamp: "14 hours ago" },
      ],
      comments: [
        {
          member: "Rohan",
          message: "I was planning to come but got sick last minute",
          timestamp: "16 hours ago",
        },
        {
          member: "Kavya",
          message: "But you didn't actually travel, so why should you pay?",
          timestamp: "15 hours ago",
        },
      ],
      group: "College Friends",
      deadline: "2024-01-14T12:00:00Z",
      mediationRequested: true,
      mediator: "AI Assistant",
    },
    {
      id: "3",
      expenseId: "exp_003",
      title: "Monthly WiFi Bill",
      amount: 1500,
      description: "Resolved - Equal split agreed",
      status: "resolved",
      priority: "low",
      createdBy: "Sneha",
      createdAt: "3 days ago",
      disputeType: "amount_verification",
      originalSplit: { you: 375, priya: 375, amit: 375, sneha: 375 },
      proposedSplit: { you: 375, priya: 375, amit: 375, sneha: 375 },
      reason: "Bill amount seems higher than usual",
      resolution: "Bill verified with receipt, amount correct",
      resolvedAt: "2 days ago",
      resolvedBy: "Group consensus",
      group: "Flatmates",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "voting":
        return "bg-blue-100 text-blue-800"
      case "mediation":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-orange-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const getVoteProgress = (votes: any[]) => {
    const totalVotes = votes.length
    const completedVotes = votes.filter((v) => v.vote !== "pending").length
    return (completedVotes / totalVotes) * 100
  }

  const getVoteResults = (votes: any[]) => {
    const agreeVotes = votes.filter((v) => v.vote === "agree").length
    const disagreeVotes = votes.filter((v) => v.vote === "disagree").length
    const pendingVotes = votes.filter((v) => v.vote === "pending").length

    return { agree: agreeVotes, disagree: disagreeVotes, pending: pendingVotes }
  }

  const filteredDisputes = disputes.filter((dispute) => {
    if (selectedTab === "active") return ["voting", "mediation"].includes(dispute.status)
    if (selectedTab === "voting") return dispute.status === "voting"
    if (selectedTab === "mediation") return dispute.status === "mediation"
    if (selectedTab === "resolved") return dispute.status === "resolved"
    return true
  })

  const selectedDisputeData = disputes.find((d) => d.id === selectedDispute)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Disputes & Mediation</h1>
                <p className="text-sm text-gray-500">Resolve expense disagreements fairly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Disputes List */}
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active">
                  Active{" "}
                  <Badge className="ml-1 text-xs">
                    {disputes.filter((d) => ["voting", "mediation"].includes(d.status)).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="voting">Voting</TabsTrigger>
                <TabsTrigger value="mediation">Mediation</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {filteredDisputes.length > 0 ? (
                    filteredDisputes.map((dispute) => {
                      const voteResults = getVoteResults(dispute.votes || [])
                      const voteProgress = getVoteProgress(dispute.votes || [])

                      return (
                        <Card
                          key={dispute.id}
                          className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${getPriorityColor(
                            dispute.priority,
                          )} ${selectedDispute === dispute.id ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                          onClick={() => setSelectedDispute(dispute.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                                  <h3 className="font-bold text-gray-900">{dispute.title}</h3>
                                  <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>By {dispute.createdBy}</span>
                                  <span>{dispute.createdAt}</span>
                                  <span>{dispute.group}</span>
                                  <span className="font-bold">₹{dispute.amount}</span>
                                </div>
                              </div>
                            </div>

                            {dispute.status === "voting" && dispute.votes && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="text-gray-600">Voting Progress</span>
                                  <span className="text-gray-600">
                                    {voteResults.agree + voteResults.disagree} / {dispute.votes.length} votes
                                  </span>
                                </div>
                                <Progress value={voteProgress} className="h-2 mb-2" />
                                <div className="flex items-center space-x-4 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <ThumbsUp className="w-3 h-3 text-green-600" />
                                    <span>{voteResults.agree} Agree</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ThumbsDown className="w-3 h-3 text-red-600" />
                                    <span>{voteResults.disagree} Disagree</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span>{voteResults.pending} Pending</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {dispute.status === "mediation" && (
                              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex items-center space-x-2">
                                  <Gavel className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-orange-800">Under Mediation</span>
                                </div>
                                <p className="text-xs text-orange-600 mt-1">
                                  Mediator: {dispute.mediator} • Deadline:{" "}
                                  {new Date(dispute.deadline!).toLocaleDateString()}
                                </p>
                              </div>
                            )}

                            {dispute.status === "resolved" && (
                              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-800">Resolved</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">{dispute.resolution}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {dispute.votes?.slice(0, 4).map((vote, index) => (
                                  <Avatar key={index} className="w-6 h-6 border-2 border-white">
                                    <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                      {vote.member === "You" ? "Y" : vote.member.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>

                              <div className="flex space-x-2">
                                {dispute.status === "voting" && (
                                  <Button size="sm" variant="outline">
                                    <Vote className="w-3 h-3 mr-1" />
                                    Vote
                                  </Button>
                                )}
                                {dispute.status === "mediation" && (
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    Discuss
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">No {selectedTab} disputes</h3>
                        <p className="text-sm text-gray-500">
                          {selectedTab === "resolved"
                            ? "No resolved disputes to show"
                            : "Great! No active disputes to resolve"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dispute Details Sidebar */}
          <div className="space-y-6">
            {selectedDisputeData ? (
              <>
                {/* Dispute Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <span>Dispute Details</span>
                      </div>
                      <Badge className={getStatusColor(selectedDisputeData.status)}>{selectedDisputeData.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedDisputeData.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedDisputeData.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-gray-900">₹{selectedDisputeData.amount}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Priority</p>
                        <p className="font-bold text-gray-900 capitalize">{selectedDisputeData.priority}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Reason for Dispute:</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedDisputeData.reason}</p>
                    </div>

                    {selectedDisputeData.status !== "resolved" && (
                      <div className="space-y-2">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
                          <Vote className="w-4 h-4 mr-2" />
                          Cast Your Vote
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Comment
                        </Button>
                        {!selectedDisputeData.mediationRequested && (
                          <Button variant="outline" className="w-full">
                            <Gavel className="w-4 h-4 mr-2" />
                            Request Mediation
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Split Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Split Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Original Split</p>
                        <div className="space-y-2">
                          {Object.entries(selectedDisputeData.originalSplit).map(([member, amount]) => (
                            <div key={member} className="flex justify-between text-sm">
                              <span className="capitalize">{member}</span>
                              <span>₹{amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Proposed Split</p>
                        <div className="space-y-2">
                          {Object.entries(selectedDisputeData.proposedSplit).map(([member, amount]) => {
                            const originalAmount = selectedDisputeData.originalSplit[member]
                            const difference = amount - originalAmount
                            return (
                              <div key={member} className="flex justify-between text-sm">
                                <span className="capitalize">{member}</span>
                                <div className="flex items-center space-x-2">
                                  <span>₹{amount}</span>
                                  {difference !== 0 && (
                                    <span className={`text-xs ${difference > 0 ? "text-red-600" : "text-green-600"}`}>
                                      ({difference > 0 ? "+" : ""}₹{difference})
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Voting Status */}
                {selectedDisputeData.votes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Voting Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDisputeData.votes.map((vote, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                                  {vote.member === "You" ? "Y" : vote.member.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{vote.member}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {vote.vote === "agree" && <ThumbsUp className="w-4 h-4 text-green-600" />}
                              {vote.vote === "disagree" && <ThumbsDown className="w-4 h-4 text-red-600" />}
                              {vote.vote === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
                              <span
                                className={`text-sm font-medium ${
                                  vote.vote === "agree"
                                    ? "text-green-600"
                                    : vote.vote === "disagree"
                                      ? "text-red-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {vote.vote === "pending" ? "Pending" : vote.vote}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments */}
                {selectedDisputeData.comments && selectedDisputeData.comments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDisputeData.comments.map((comment, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                  {comment.member === "You" ? "Y" : comment.member.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{comment.member}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Escalation System */}
                {selectedDisputeData && selectedDisputeData.status !== "resolved" && (
                  <EscalationSystem dispute={selectedDisputeData} onEscalate={handleEscalation} />
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Select a Dispute</h3>
                  <p className="text-sm text-gray-500">
                    Choose a dispute from the list to view details and take action
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 gap-1">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/groups">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Users className="w-5 h-5" />
              <span className="text-xs">Groups</span>
            </Button>
          </Link>
          <Link href="/friends">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <IndianRupee className="w-5 h-5" />
              <span className="text-xs">Friends</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="flex flex-col items-center py-2">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
