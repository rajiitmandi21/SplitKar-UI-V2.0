"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Shield,
  Users,
  Star,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Award,
  TrendingUp,
  MessageSquare,
  Gavel,
  UserCheck,
  Settings,
  Home,
  IndianRupee,
} from "lucide-react"
import Link from "next/link"

export default function ModeratorsPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showAddModerator, setShowAddModerator] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const moderators = [
    {
      id: "mod_001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      avatar: "RK",
      status: "active",
      level: "senior",
      specialization: ["financial_disputes", "group_dynamics"],
      stats: {
        totalCases: 45,
        resolvedCases: 42,
        successRate: 93.3,
        avgResolutionTime: "2.5 days",
        rating: 4.8,
        totalReviews: 38,
      },
      currentCases: 3,
      maxCases: 8,
      joinedDate: "2023-06-15",
      lastActive: "2 hours ago",
      languages: ["English", "Hindi", "Tamil"],
      certifications: ["Conflict Resolution", "Financial Mediation"],
      groups: ["College Friends", "Office Team", "Family Group"],
    },
    {
      id: "mod_002",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      avatar: "PS",
      status: "active",
      level: "expert",
      specialization: ["complex_splits", "recurring_disputes"],
      stats: {
        totalCases: 78,
        resolvedCases: 75,
        successRate: 96.2,
        avgResolutionTime: "1.8 days",
        rating: 4.9,
        totalReviews: 67,
      },
      currentCases: 5,
      maxCases: 10,
      joinedDate: "2023-03-20",
      lastActive: "30 minutes ago",
      languages: ["English", "Hindi", "Bengali"],
      certifications: ["Advanced Mediation", "Group Psychology", "Financial Ethics"],
      groups: ["Startup Team", "Travel Group", "Investment Club"],
    },
    {
      id: "mod_003",
      name: "Amit Patel",
      email: "amit.patel@email.com",
      avatar: "AP",
      status: "busy",
      level: "junior",
      specialization: ["simple_disputes", "payment_issues"],
      stats: {
        totalCases: 23,
        resolvedCases: 21,
        successRate: 91.3,
        avgResolutionTime: "3.2 days",
        rating: 4.6,
        totalReviews: 19,
      },
      currentCases: 6,
      maxCases: 6,
      joinedDate: "2023-09-10",
      lastActive: "1 day ago",
      languages: ["English", "Hindi", "Gujarati"],
      certifications: ["Basic Mediation"],
      groups: ["Friends Circle", "Roommates"],
    },
    {
      id: "mod_004",
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      avatar: "SR",
      status: "inactive",
      level: "senior",
      specialization: ["high_value_disputes", "business_expenses"],
      stats: {
        totalCases: 56,
        resolvedCases: 54,
        successRate: 96.4,
        avgResolutionTime: "2.1 days",
        rating: 4.7,
        totalReviews: 51,
      },
      currentCases: 0,
      maxCases: 8,
      joinedDate: "2023-04-05",
      lastActive: "1 week ago",
      languages: ["English", "Telugu", "Kannada"],
      certifications: ["Business Mediation", "High-Value Disputes"],
      groups: [],
    },
  ]

  const pendingApplications = [
    {
      id: "app_001",
      name: "Kavya Nair",
      email: "kavya.nair@email.com",
      experience: "3 years in conflict resolution",
      motivation: "I want to help groups resolve financial disputes fairly and maintain relationships.",
      appliedDate: "2024-01-10",
      status: "under_review",
      references: 2,
      certifications: ["Conflict Resolution Certificate"],
    },
    {
      id: "app_002",
      name: "Rohan Gupta",
      email: "rohan.gupta@email.com",
      experience: "5 years as a financial advisor",
      motivation: "My background in finance can help resolve complex expense disputes.",
      appliedDate: "2024-01-08",
      status: "interview_scheduled",
      references: 3,
      certifications: ["CFA", "Financial Planning"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-orange-100 text-orange-800"
      case "inactive":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-purple-100 text-purple-800"
      case "senior":
        return "bg-blue-100 text-blue-800"
      case "junior":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const filteredModerators = moderators.filter((moderator) => {
    const matchesSearch =
      moderator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      moderator.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || moderator.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const overviewStats = {
    totalModerators: moderators.length,
    activeModerators: moderators.filter((m) => m.status === "active").length,
    totalCasesHandled: moderators.reduce((sum, m) => sum + m.stats.totalCases, 0),
    avgSuccessRate: moderators.reduce((sum, m) => sum + m.stats.successRate, 0) / moderators.length,
    pendingApplications: pendingApplications.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/disputes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Moderator Management</h1>
                <p className="text-sm text-gray-500">Manage human moderators for complex disputes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showAddModerator} onOpenChange={setShowAddModerator}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Moderator
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Invite New Moderator</DialogTitle>
                    <DialogDescription>Invite a qualified person to become a dispute moderator</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input placeholder="moderator@email.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Specialization</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial_disputes">Financial Disputes</SelectItem>
                          <SelectItem value="group_dynamics">Group Dynamics</SelectItem>
                          <SelectItem value="complex_splits">Complex Splits</SelectItem>
                          <SelectItem value="high_value_disputes">High Value Disputes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personal Message</label>
                      <Textarea placeholder="Why would you like them to be a moderator?" rows={3} />
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={() => setShowAddModerator(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500">Send Invitation</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moderators">
              Moderators <Badge className="ml-1 text-xs">{overviewStats.activeModerators}</Badge>
            </TabsTrigger>
            <TabsTrigger value="applications">
              Applications <Badge className="ml-1 text-xs">{overviewStats.pendingApplications}</Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Moderators</p>
                      <p className="text-2xl font-bold text-gray-900">{overviewStats.totalModerators}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Moderators</p>
                      <p className="text-2xl font-bold text-gray-900">{overviewStats.activeModerators}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Gavel className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cases Handled</p>
                      <p className="text-2xl font-bold text-gray-900">{overviewStats.totalCasesHandled}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{overviewStats.avgSuccessRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Moderators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Top Performing Moderators</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moderators
                    .sort((a, b) => b.stats.successRate - a.stats.successRate)
                    .slice(0, 3)
                    .map((moderator, index) => (
                      <div key={moderator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-lg font-bold ${index === 0 ? "text-yellow-600" : index === 1 ? "text-gray-500" : "text-orange-600"}`}
                            >
                              #{index + 1}
                            </span>
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                                {moderator.avatar}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{moderator.name}</h4>
                            <p className="text-sm text-gray-600">{moderator.stats.totalCases} cases resolved</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{moderator.stats.successRate}%</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{moderator.stats.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderators Tab */}
          <TabsContent value="moderators" className="mt-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search moderators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Moderators Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModerators.map((moderator) => (
                <Card key={moderator.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                            {moderator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{moderator.name}</h3>
                          <p className="text-sm text-gray-600">{moderator.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getStatusColor(moderator.status)}>{moderator.status}</Badge>
                        <Badge className={getLevelColor(moderator.level)}>{moderator.level}</Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center bg-gray-50 p-3 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{moderator.stats.successRate}%</p>
                        <p className="text-xs text-gray-600">Success Rate</p>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{moderator.stats.totalCases}</p>
                        <p className="text-xs text-gray-600">Total Cases</p>
                      </div>
                    </div>

                    {/* Current Load */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Current Load</span>
                        <span className="text-gray-600">
                          {moderator.currentCases}/{moderator.maxCases}
                        </span>
                      </div>
                      <Progress value={(moderator.currentCases / moderator.maxCases) * 100} className="h-2" />
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {moderator.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{moderator.stats.rating}</span>
                        <span className="text-sm text-gray-500">({moderator.stats.totalReviews} reviews)</span>
                      </div>
                      <span className="text-sm text-gray-500">{moderator.lastActive}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <div className="space-y-6">
              {pendingApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{application.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{application.email}</p>
                        <Badge
                          className={
                            application.status === "under_review"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {application.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Applied: {application.appliedDate}</p>
                        <p>{application.references} references</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Experience</p>
                        <p className="text-sm text-gray-600">{application.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Motivation</p>
                        <p className="text-sm text-gray-600">{application.motivation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Certifications</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {application.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1">
                        Schedule Interview
                      </Button>
                      <Button variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50">
                        Reject
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Time Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moderators.map((moderator) => (
                      <div key={moderator.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {moderator.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{moderator.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{moderator.stats.avgResolutionTime}</p>
                          <p className="text-xs text-gray-500">avg time</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialization Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["financial_disputes", "group_dynamics", "complex_splits", "high_value_disputes"].map((spec) => {
                      const count = moderators.filter((m) => m.specialization.includes(spec)).length
                      const percentage = (count / moderators.length) * 100
                      return (
                        <div key={spec}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{spec.replace("_", " ")}</span>
                            <span>{count} moderators</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
