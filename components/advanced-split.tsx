"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  Percent,
  Calculator,
  Zap,
  Save,
  RotateCcw,
  TrendingUp,
  IndianRupee,
  UserMinus,
  UserPlus,
} from "lucide-react"

interface Member {
  id: string
  name: string
  avatar: string
  isIncluded: boolean
  amount?: number
  percentage?: number
  income?: number
  lastExpenseRatio?: number
}

interface SplitTemplate {
  id: string
  name: string
  type: "percentage" | "custom" | "ratio"
  splits: { [memberId: string]: number }
}

interface AdvancedSplitProps {
  totalAmount: number
  members: Member[]
  onSplitChange: (splits: { [memberId: string]: number }) => void
  groupId: string
}

export function AdvancedSplit({ totalAmount, members: initialMembers, onSplitChange, groupId }: AdvancedSplitProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [splitType, setSplitType] = useState<"equal" | "percentage" | "custom" | "ratio" | "smart">("equal")
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>({})
  const [percentageSplits, setPercentageSplits] = useState<{ [key: string]: number }>({})
  const [ratioSplits, setRatioSplits] = useState<{ [key: string]: number }>({})
  const [savedTemplates, setSavedTemplates] = useState<SplitTemplate[]>([])
  const [templateName, setTemplateName] = useState("")
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)

  // Mock data for smart suggestions
  const memberIncomes = {
    you: 50000,
    priya: 45000,
    amit: 60000,
    sneha: 40000,
  }

  const includedMembers = members.filter((m) => m.isIncluded)
  const includedCount = includedMembers.length

  // Calculate splits based on type
  const calculateSplits = () => {
    const splits: { [key: string]: number } = {}

    switch (splitType) {
      case "equal":
        const equalAmount = totalAmount / includedCount
        includedMembers.forEach((member) => {
          splits[member.id] = equalAmount
        })
        break

      case "percentage":
        includedMembers.forEach((member) => {
          const percentage = percentageSplits[member.id] || 0
          splits[member.id] = (totalAmount * percentage) / 100
        })
        break

      case "custom":
        includedMembers.forEach((member) => {
          splits[member.id] = customSplits[member.id] || 0
        })
        break

      case "ratio":
        const totalRatio = Object.values(ratioSplits).reduce((sum, ratio) => sum + ratio, 0)
        if (totalRatio > 0) {
          includedMembers.forEach((member) => {
            const ratio = ratioSplits[member.id] || 1
            splits[member.id] = (totalAmount * ratio) / totalRatio
          })
        }
        break

      case "smart":
        const totalIncome = includedMembers.reduce((sum, member) => {
          return sum + (memberIncomes[member.id as keyof typeof memberIncomes] || 40000)
        }, 0)
        includedMembers.forEach((member) => {
          const income = memberIncomes[member.id as keyof typeof memberIncomes] || 40000
          splits[member.id] = (totalAmount * income) / totalIncome
        })
        break
    }

    return splits
  }

  const currentSplits = calculateSplits()
  const totalSplit = Object.values(currentSplits).reduce((sum, amount) => sum + amount, 0)
  const difference = totalAmount - totalSplit
  const isValid = Math.abs(difference) < 0.01

  // Update parent component
  useEffect(() => {
    onSplitChange(currentSplits)
  }, [currentSplits, onSplitChange])

  const toggleMemberInclusion = (memberId: string) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, isIncluded: !member.isIncluded } : member)),
    )
  }

  const handlePercentageChange = (memberId: string, value: string) => {
    const percentage = Number.parseFloat(value) || 0
    setPercentageSplits((prev) => ({ ...prev, [memberId]: percentage }))
  }

  const handleCustomAmountChange = (memberId: string, value: string) => {
    const amount = Number.parseFloat(value) || 0
    setCustomSplits((prev) => ({ ...prev, [memberId]: amount }))
  }

  const handleRatioChange = (memberId: string, value: number[]) => {
    setRatioSplits((prev) => ({ ...prev, [memberId]: value[0] }))
  }

  const autoBalancePercentages = () => {
    const remainingPercentage = 100 - Object.values(percentageSplits).reduce((sum, p) => sum + p, 0)
    const unsetMembers = includedMembers.filter((m) => !percentageSplits[m.id])

    if (unsetMembers.length > 0) {
      const equalPercentage = remainingPercentage / unsetMembers.length
      const newSplits = { ...percentageSplits }
      unsetMembers.forEach((member) => {
        newSplits[member.id] = equalPercentage
      })
      setPercentageSplits(newSplits)
    }
  }

  const autoBalanceCustom = () => {
    const currentTotal = Object.values(customSplits).reduce((sum, amount) => sum + amount, 0)
    const remaining = totalAmount - currentTotal
    const unsetMembers = includedMembers.filter((m) => !customSplits[m.id])

    if (unsetMembers.length > 0 && remaining > 0) {
      const equalAmount = remaining / unsetMembers.length
      const newSplits = { ...customSplits }
      unsetMembers.forEach((member) => {
        newSplits[member.id] = equalAmount
      })
      setCustomSplits(newSplits)
    }
  }

  const saveTemplate = () => {
    if (!templateName.trim()) return

    const template: SplitTemplate = {
      id: Date.now().toString(),
      name: templateName,
      type: splitType as "percentage" | "custom" | "ratio",
      splits: splitType === "percentage" ? percentageSplits : splitType === "custom" ? customSplits : ratioSplits,
    }

    setSavedTemplates((prev) => [...prev, template])
    setTemplateName("")
    setShowTemplateDialog(false)
  }

  const loadTemplate = (template: SplitTemplate) => {
    setSplitType(template.type)
    if (template.type === "percentage") {
      setPercentageSplits(template.splits)
    } else if (template.type === "custom") {
      setCustomSplits(template.splits)
    } else {
      setRatioSplits(template.splits)
    }
  }

  const resetSplits = () => {
    setCustomSplits({})
    setPercentageSplits({})
    setRatioSplits({})
    setSplitType("equal")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Advanced Split Options</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Split Template</DialogTitle>
                  <DialogDescription>Save this split configuration for future use</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g., Dinner Split, Rent Split"
                    />
                  </div>
                  <Button onClick={saveTemplate} className="w-full">
                    Save Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={resetSplits}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Member Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Include Members</Label>
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  member.isIncluded ? "border-teal-200 bg-teal-50" : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => toggleMemberInclusion(member.id)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                    {member.name === "You" ? "Y" : member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium flex-1">{member.name}</span>
                {member.isIncluded ? (
                  <UserMinus className="w-4 h-4 text-teal-600" />
                ) : (
                  <UserPlus className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Split Type Selection */}
        <Tabs value={splitType} onValueChange={(value) => setSplitType(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="equal">Equal</TabsTrigger>
            <TabsTrigger value="percentage">%</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="ratio">Ratio</TabsTrigger>
            <TabsTrigger value="smart">Smart</TabsTrigger>
          </TabsList>

          {/* Equal Split */}
          <TabsContent value="equal" className="mt-4">
            <div className="space-y-3">
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-teal-700">Equal Split</p>
                  <Badge variant="secondary">{includedCount} members</Badge>
                </div>
                <p className="text-lg font-bold text-teal-800">
                  ₹{(totalAmount / includedCount).toFixed(2)} per person
                </p>
              </div>
              {includedMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                        {member.name === "You" ? "Y" : member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <span className="font-bold">₹{(totalAmount / includedCount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Percentage Split */}
          <TabsContent value="percentage" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Set percentage for each member</p>
                <Button variant="outline" size="sm" onClick={autoBalancePercentages}>
                  <Percent className="w-4 h-4 mr-2" />
                  Auto Balance
                </Button>
              </div>

              {includedMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                        {member.name === "You" ? "Y" : member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      placeholder="25"
                      value={percentageSplits[member.id] || ""}
                      onChange={(e) => handlePercentageChange(member.id, e.target.value)}
                      className="w-20 text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                    <span className="font-bold w-20 text-right">
                      ₹{(((percentageSplits[member.id] || 0) * totalAmount) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div
                className={`p-3 rounded-lg border ${
                  Math.abs(Object.values(percentageSplits).reduce((sum, p) => sum + p, 0) - 100) < 0.01
                    ? "border-green-200 bg-green-50"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <p className="text-sm">
                  Total:{" "}
                  {Object.values(percentageSplits)
                    .reduce((sum, p) => sum + p, 0)
                    .toFixed(1)}
                  %
                  {Math.abs(Object.values(percentageSplits).reduce((sum, p) => sum + p, 0) - 100) > 0.01 && (
                    <span className="ml-2 text-orange-600">
                      (Remaining: {(100 - Object.values(percentageSplits).reduce((sum, p) => sum + p, 0)).toFixed(1)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Custom Amount Split */}
          <TabsContent value="custom" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Set custom amount for each member</p>
                <Button variant="outline" size="sm" onClick={autoBalanceCustom}>
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Auto Balance
                </Button>
              </div>

              {includedMembers.map((member) => (
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
                    <span className="text-sm text-gray-500">₹</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={customSplits[member.id] || ""}
                      onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                      className="w-24 text-center"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              ))}

              <div
                className={`p-3 rounded-lg border ${
                  isValid ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Total: ₹{totalSplit.toFixed(2)} / ₹{totalAmount.toFixed(2)}
                  </p>
                  {isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                {!isValid && (
                  <p className="text-sm text-orange-600 mt-1">
                    {difference > 0
                      ? `Under-allocated: ₹${difference.toFixed(2)}`
                      : `Over-allocated: ₹${Math.abs(difference).toFixed(2)}`}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Ratio Split */}
          <TabsContent value="ratio" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Set ratio for each member (e.g., 2:1:1)</p>

              {includedMembers.map((member) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                          {member.name === "You" ? "Y" : member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm w-8">{ratioSplits[member.id] || 1}</span>
                      <span className="font-bold w-20 text-right">₹{(currentSplits[member.id] || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <Slider
                    value={[ratioSplits[member.id] || 1]}
                    onValueChange={(value) => handleRatioChange(member.id, value)}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  Ratio: {includedMembers.map((m) => ratioSplits[m.id] || 1).join(":")}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Smart Split */}
          <TabsContent value="smart" className="mt-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <p className="font-medium text-purple-800">AI-Powered Smart Split</p>
                </div>
                <p className="text-sm text-purple-600">
                  Split based on income levels and spending patterns for fairness
                </p>
              </div>

              {includedMembers.map((member) => {
                const income = memberIncomes[member.id as keyof typeof memberIncomes] || 40000
                const percentage =
                  (income /
                    includedMembers.reduce(
                      (sum, m) => sum + (memberIncomes[m.id as keyof typeof memberIncomes] || 40000),
                      0,
                    )) *
                  100

                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                          {member.name === "You" ? "Y" : member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <TrendingUp className="w-3 h-3" />
                          <span>₹{income.toLocaleString()}/month</span>
                          <span>({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold">₹{(currentSplits[member.id] || 0).toFixed(2)}</span>
                  </div>
                )
              })}

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  ✨ This split considers income levels to ensure fair contribution from everyone
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Saved Templates */}
        {savedTemplates.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Saved Templates</Label>
            <div className="grid grid-cols-2 gap-2">
              {savedTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start"
                  onClick={() => loadTemplate(template)}
                >
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{template.type} split</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Split Summary */}
        <div
          className={`p-4 rounded-lg border-2 ${isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Split Summary</p>
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Split Total:</span>
              <span className="font-bold">₹{totalSplit.toFixed(2)}</span>
            </div>
            {!isValid && (
              <div className="flex justify-between text-red-600">
                <span>Difference:</span>
                <span className="font-bold">₹{Math.abs(difference).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
