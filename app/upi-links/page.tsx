"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Smartphone,
  Copy,
  Share,
  ExternalLink,
  BarChart3,
  Clock,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  Users,
  Globe,
  Calendar
} from "lucide-react"
import Link from "next/link"
import UPIPaymentGenerator from "@/components/upi-payment-generator"

interface UPIPaymentLink {
  id: string
  short_code: string
  upi_id: string
  payee_name: string
  amount?: number
  currency: string
  message?: string
  expense_title?: string
  group_name?: string
  creator_name?: string
  is_active: boolean
  expires_at?: string
  created_at: string
  click_count: number
  shortUrl: string
  upiUrl: string
}

interface Analytics {
  summary: {
    total_clicks: number
    unique_visitors: number
    active_days: number
    mobile_clicks: number
    desktop_clicks: number
    tablet_clicks: number
  }
  browsers: Array<{ browser: string; clicks: number }>
  dailyStats: Array<{ date: string; clicks: number; unique_visitors: number }>
  referrers: Array<{ referrer: string; clicks: number }>
}

export default function UPILinksPage() {
  const [activeTab, setActiveTab] = useState("links")
  const [links, setLinks] = useState<UPIPaymentLink[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchUPILinks()
    if (activeTab === "analytics") {
      fetchAnalytics()
    }
  }, [activeTab])

  const fetchUPILinks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/upi?userId=current-user-id') // Replace with actual user ID
      const result = await response.json()
      
      if (result.success) {
        setLinks(result.data)
      }
    } catch (error) {
      console.error('Error fetching UPI links:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/upi/analytics?userId=current-user-id&days=30')
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const deactivateLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/upi?id=${linkId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchUPILinks() // Refresh the list
      }
    } catch (error) {
      console.error('Error deactivating link:', error)
    }
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.payee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.upi_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && link.is_active) ||
                         (filterStatus === "inactive" && !link.is_active) ||
                         (filterStatus === "expired" && link.expires_at && new Date(link.expires_at) < new Date())
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/settle">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Settle
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UPI Payment Links</h1>
                <p className="text-gray-600">Manage and track your payment links</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links">My Links</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Links Management Tab */}
          <TabsContent value="links" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by payee name, UPI ID, or short code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("active")}
                    >
                      Active
                    </Button>
                    <Button
                      variant={filterStatus === "inactive" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("inactive")}
                    >
                      Inactive
                    </Button>
                    <Button
                      variant={filterStatus === "expired" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("expired")}
                    >
                      Expired
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links List */}
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment links...</p>
                  </CardContent>
                </Card>
              ) : filteredLinks.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No Payment Links Found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterStatus !== "all" 
                        ? "No links match your current filters" 
                        : "Create your first UPI payment link to get started"}
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Payment Link
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredLinks.map((link) => (
                  <Card key={link.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{link.payee_name}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                              {link.short_code}
                            </Badge>
                            {!link.is_active && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                            {isExpired(link.expires_at) && (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                Expired
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>UPI ID: {link.upi_id}</p>
                            {link.amount && (
                              <p>Amount: ₹{link.amount.toFixed(2)} {link.currency}</p>
                            )}
                            {link.message && (
                              <p>Message: {link.message}</p>
                            )}
                            {(link.expense_title || link.group_name) && (
                              <div className="flex gap-2 mt-2">
                                {link.expense_title && (
                                  <Badge variant="secondary" className="text-xs">
                                    Expense: {link.expense_title}
                                  </Badge>
                                )}
                                {link.group_name && (
                                  <Badge variant="secondary" className="text-xs">
                                    Group: {link.group_name}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{link.click_count} clicks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(link.created_at)}</span>
                            </div>
                          </div>
                          
                          {link.expires_at && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>Expires: {formatDate(link.expires_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(link.shortUrl, `short-${link.id}`)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {copied[`short-${link.id}`] ? 'Copied!' : 'Copy Link'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link.shortUrl, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: `Pay ${link.payee_name}`,
                                  url: link.shortUrl
                                })
                              } else {
                                copyToClipboard(link.shortUrl, `share-${link.id}`)
                              }
                            }}
                          >
                            <Share className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateLink(link.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Deactivate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Create New Link Tab */}
          <TabsContent value="create" className="space-y-6">
            <UPIPaymentGenerator
              defaultData={{
                createdBy: "current-user-id", // Replace with actual user ID
              }}
              onLinkCreated={(link) => {
                console.log("UPI payment link created:", link)
                fetchUPILinks() // Refresh the links list
                setActiveTab("links") // Switch to links tab
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analytics ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.summary.total_clicks.toLocaleString()}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.summary.unique_visitors.toLocaleString()}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Mobile Clicks</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.summary.mobile_clicks.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((analytics.summary.mobile_clicks / analytics.summary.total_clicks) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <Smartphone className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Days</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.summary.active_days}
                          </p>
                        </div>
                        <Calendar className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Details */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Top Browsers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Browsers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.browsers.map((browser, index) => (
                          <div key={browser.browser} className="flex items-center justify-between">
                            <span className="capitalize">{browser.browser}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${(browser.clicks / analytics.summary.total_clicks) * 100}%`
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{browser.clicks}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Referrers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Referrers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.referrers.slice(0, 5).map((referrer, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="truncate">{referrer.referrer}</span>
                            <span className="text-sm text-gray-600">{referrer.clicks}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                  <p className="text-gray-600">Create some payment links to see analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 