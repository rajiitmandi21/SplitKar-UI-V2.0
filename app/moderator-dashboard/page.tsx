"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle,
  FileText,
  Gavel,
  Users,
  TrendingUp,
  Star,
  Send,
  Eye,
  Scale,
  Settings,
  Home,
  IndianRupee,
} from "lucide-react"
import Link from "next/link"

export default function ModeratorDashboard() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null)
  const [resolution, setResolution] = useState("")
  const [showResolutionDialog, setShowResolutionDialog] = useState(false)

  const moderatorInfo = {
    name: "Rajesh Kumar",
    level: "Senior Moderator",
    rating: 4.8,
    totalCases: 45,
    successRate: 93.3,
    currentLoad: 3,
    maxLoad: 8,
    specializations: ["Financial Disputes", "Group Dynamics"],
  }

  const assignedDisputes = [
    {
      id: "disp_001",
      title: "Restaurant Bill Split Disagreement",
      group: "College Friends",
      amount: 2400,
      priority: "high",
      status: "analysis",
      assignedDate: "2024-01-12",
      deadline: "2024-01-15",
      complexity: "medium",
      participants: ["Amit", "Priya", "Sneha", "Rohan"],
      description: "Disagreement about who should pay more based on what they ordered",
      evidence: [
        { type: "receipt", description: "Restaurant bill showing individual orders" },
        { type: "testimony", description: "Amit claims he shared appetizers equally" },
        { type: "history", description: "Previous group agreements on similar situations" },
      ],
      timeline: [
        { date: "2024-01-12 10:00", event: "Dispute escalated to human moderation", actor: "System" },
        { date: "2024-01-12 10:15", event: "Assigned to Rajesh Kumar", actor: "System" },
        { date: "2024-01-12 11:30", event: "Initial evidence review completed", actor: "Rajesh Kumar" },
        { date: "2024-01-12 14:20", event: "Additional evidence requested", actor: "Rajesh Kumar" },
      ],
      aiAnalysis: {
        recommendation: "Split based on actual consumption with shared items divided equally",
        confidence: 78,
        factors: ["Order values", "Sharing patterns", "Group history"],
      },
    },
    {
      id: "disp_002",
      title: "Vacation Expense Dispute",
      group: "Travel Buddies",
      amount: 15000,
      priority: "high",
      status: "pending_resolution",
      assignedDate: "2024-01-10",
      deadline: "2024-01-14",
      complexity: "high",
      participants: ["Kavya", "Arjun", "Neha", "Vikram", "Sanya"],
      description: "Complex dispute involving accommodation, transport, and activity costs",
      evidence: [
        { type: "receipts", description: "Multiple receipts for different expense categories" },
        { type: "booking_confirmations", description: "Hotel and activity booking details" },
        { type: "group_chat", description: "WhatsApp conversations about expense agreements" },
      ],
      timeline: [
        { date: "2024-01-10 09:00", event: "Dispute escalated to human moderation", actor: "System" },
        { date: "2024-01-10 09:30", event: "Assigned to Rajesh Kumar", actor: "System" },
        { date: "2024-01-10 15:45", event: "Evidence analysis completed", actor: "Rajesh Kumar" },
        { date: "2024-01-11 10:00", event: "Participant interviews conducted", actor: "Rajesh Kumar" },
        { date: "2024-01-12 16:30", event: "Resolution proposal drafted", actor: "Rajesh Kumar" },
      ],
      aiAnalysis: {
        recommendation: "Proportional split based on participation in each activity",
        confidence: 85,
        factors: ["Participation levels", "Booking responsibilities", "Benefit distribution"],
      },
    },
    {
      id: "disp_003",
      title: "Office Lunch Order Mix-up",
      group: "Office Team",
      amount: 800,
      priority: "medium",
      status: "information_gathering",
      assignedDate: "2024-01-13",
      deadline: "2024-01-16",
      complexity: "low",
      participants: ["Deepak", "Ritu", "Manish"],
      description: "Confusion about who ordered what when orders got mixed up",
      evidence: [
        { type: "order_history", description: "Food delivery app order details" },
        { type: "payment_record", description: "Who paid for the order initially" },
      ],
      timeline: [
        { date: "2024-01-13 14:00", event: "Dispute escalated to human moderation", actor: "System" },
        { date: "2024-01-13 14:15", event: "Assigned to Rajesh Kumar", actor: "System" },
      ],
      aiAnalysis: {
        recommendation: "Equal split due to insufficient evidence of individual orders",
        confidence: 60,
        factors: ["Order confusion", "Limited evidence", "Small amount"],
      },
    },
  ]

  const resolvedDisputes = [
    {
      id: "disp_004",
      title: "Gym Membership Split",
      group: "Fitness Group",
      amount: 5000,
      resolution: "Split based on actual usage frequency",
      resolvedDate: "2024-01-08",
      satisfaction: 4.6,
      participants: ["Raj", "Simran", "Karan"],
    },
    {
      id: "disp_005",
      title: "Internet Bill Dispute",
      group: "Flatmates",
      amount: 1200,
      resolution: "Equal split with usage monitoring agreement",
      resolvedDate: "2024-01-05",
      satisfaction: 4.8,
      participants: ["Ankit", "Pooja", "Rahul", "Meera"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analysis":
        return "bg-blue-100 text-blue-800"
      case "pending_resolution":
        return "bg-orange-100 text-orange-800"
      case "information_gathering":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-600"
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

  const selectedDisputeData = assignedDisputes.find((d) => d.id === selectedDispute)

  const handleSubmitResolution = () => {
    // Handle resolution submission
    setShowResolutionDialog(false)
    setResolution("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/moderators">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Moderator Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your assigned disputes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{moderatorInfo.name}</p>
                <p className="text-sm text-gray-500">{moderatorInfo.level}</p>
              </div>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">RK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Moderator Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-lg">{moderatorInfo.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-bold text-lg text-gray-900">{moderatorInfo.totalCases}</p>
                  <p className="text-xs text-gray-600">Total Cases</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-bold text-lg text-green-600">{moderatorInfo.successRate}%</p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-bold text-lg text-blue-600">
                    {moderatorInfo.currentLoad}/{moderatorInfo.maxLoad}
                  </p>
                  <p className="text-xs text-gray-600">Current Load</p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  Active Cases <Badge className="ml-1 text-xs">{assignedDisputes.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Active Cases */}
              <TabsContent value="active" className="mt-6">
                <div className="space-y-4">
                  {assignedDisputes.map((dispute) => (
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
                              <Shield className="w-5 h-5 text-blue-500" />
                              <h3 className="font-bold text-gray-900">{dispute.title}</h3>
                              <Badge className={getStatusColor(dispute.status)}>
                                {dispute.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{dispute.group}</span>
                              <span>₹{dispute.amount}</span>
                              <span>{dispute.participants.length} participants</span>
                              <span>Due: {dispute.deadline}</span>
                            </div>
                          </div>
                          <Badge
                            className={`${dispute.priority === "high" ? "bg-red-100 text-red-800" : dispute.priority === "medium" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}
                          >
                            {dispute.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {dispute.participants.slice(0, 4).map((participant, index) => (
                              <Avatar key={index} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs">
                                  {participant.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                            {dispute.status === "pending_resolution" && (
                              <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-500">
                                    <Gavel className="w-3 h-3 mr-1" />
                                    Resolve
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Submit Resolution</DialogTitle>
                                    <DialogDescription>
                                      Provide your final resolution for this dispute
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Resolution Type</label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select resolution type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="split_adjustment">Split Adjustment</SelectItem>
                                          <SelectItem value="equal_split">Equal Split</SelectItem>
                                          <SelectItem value="consumption_based">Consumption Based</SelectItem>
                                          <SelectItem value="custom_arrangement">Custom Arrangement</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Resolution Details</label>
                                      <Textarea
                                        placeholder="Explain your resolution decision and reasoning..."
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        rows={6}
                                      />
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                      <h4 className="font-medium text-blue-800 mb-2">AI Recommendation</h4>
                                      <p className="text-sm text-blue-700 mb-2">
                                        {selectedDisputeData?.aiAnalysis.recommendation}
                                      </p>
                                      <p className="text-xs text-blue-600">
                                        Confidence: {selectedDisputeData?.aiAnalysis.confidence}%
                                      </p>
                                    </div>
                                    <div className="flex space-x-3">
                                      <Button
                                        variant="outline"
                                        onClick={() => setShowResolutionDialog(false)}
                                        className="flex-1"
                                      >
                                        Save Draft
                                      </Button>
                                      <Button
                                        onClick={handleSubmitResolution}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500"
                                      >
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Resolution
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resolved Cases */}
              <TabsContent value="resolved" className="mt-6">
                <div className="space-y-4">
                  {resolvedDisputes.map((dispute) => (
                    <Card key={dispute.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <h3 className="font-bold text-gray-900">{dispute.title}</h3>
                              <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{dispute.resolution}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{dispute.group}</span>
                              <span>₹{dispute.amount}</span>
                              <span>Resolved: {dispute.resolvedDate}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{dispute.satisfaction}</span>
                            </div>
                            <p className="text-xs text-gray-500">Satisfaction</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Resolution Speed</span>
                            <span>2.1 days avg</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Satisfaction Score</span>
                            <span>4.8/5.0</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Success Rate</span>
                            <span>93.3%</span>
                          </div>
                          <Progress value={93.3} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Case Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["Financial Disputes", "Group Dynamics", "Payment Issues", "Complex Splits"].map(
                          (type, index) => {
                            const values = [15, 12, 8, 10]
                            const percentage = (values[index] / 45) * 100
                            return (
                              <div key={type}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{type}</span>
                                  <span>{values[index]} cases</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            )
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dispute Details Sidebar */}
          <div className="space-y-6">
            {selectedDisputeData ? (
              <>
                {/* Case Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Scale className="w-5 h-5 text-blue-500" />
                      <span>Case Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedDisputeData.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedDisputeData.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-gray-900">₹{selectedDisputeData.amount}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Complexity</p>
                        <p className="font-bold text-gray-900 capitalize">{selectedDisputeData.complexity}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Participants</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDisputeData.participants.map((participant, index) => (
                          <Badge key={index} variant="outline">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Deadline</p>
                      <p className="text-sm font-medium text-red-600">{selectedDisputeData.deadline}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span>Evidence</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDisputeData.evidence.map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-sm capitalize">{item.type.replace("_", " ")}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      <span>AI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommendation</p>
                        <p className="text-sm text-gray-600">{selectedDisputeData.aiAnalysis.recommendation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Confidence</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedDisputeData.aiAnalysis.confidence} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{selectedDisputeData.aiAnalysis.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Key Factors</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDisputeData.aiAnalysis.factors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDisputeData.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.event}</p>
                            <p className="text-xs text-gray-500">
                              {event.actor} • {event.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Select a Case</h3>
                  <p className="text-sm text-gray-500">
                    Choose a dispute from your active cases to view details and take action
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
