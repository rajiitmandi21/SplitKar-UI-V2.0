"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  IndianRupee,
  ArrowLeft,
  Camera,
  Upload,
  Users,
  Coffee,
  Car,
  Home,
  ShoppingCart,
  Utensils,
  Plane,
  Gamepad2,
  Check,
} from "lucide-react"
import Link from "next/link"

export default function AddExpensePage() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("food")
  const [selectedGroup, setSelectedGroup] = useState("flatmates")
  const [splitType, setSplitType] = useState("equal")
  const [paidBy, setPaidBy] = useState("you")
  const [generateUpiLink, setGenerateUpiLink] = useState(true)
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>({})

  const categories = [
    { id: "food", name: "Food & Dining", icon: <Utensils className="w-5 h-5" />, color: "bg-orange-500" },
    { id: "transport", name: "Transport", icon: <Car className="w-5 h-5" />, color: "bg-blue-500" },
    { id: "home", name: "Home & Utilities", icon: <Home className="w-5 h-5" />, color: "bg-green-500" },
    { id: "shopping", name: "Shopping", icon: <ShoppingCart className="w-5 h-5" />, color: "bg-purple-500" },
    { id: "entertainment", name: "Entertainment", icon: <Gamepad2 className="w-5 h-5" />, color: "bg-pink-500" },
    { id: "travel", name: "Travel", icon: <Plane className="w-5 h-5" />, color: "bg-indigo-500" },
    { id: "chai", name: "Chai with Friends", icon: <Coffee className="w-5 h-5" />, color: "bg-amber-500" },
  ]

  const groups = [
    { id: "flatmates", name: "Flatmates", members: ["You", "Priya", "Amit", "Sneha"] },
    { id: "college", name: "College Friends", members: ["You", "Rohan", "Kavya", "Arjun", "Meera", "Siddharth"] },
    { id: "office", name: "Office Team", members: ["You", "Rajesh", "Anita", "Vikram"] },
  ]

  const selectedGroupData = groups.find((g) => g.id === selectedGroup)
  const memberCount = selectedGroupData?.members.length || 0
  const equalSplit = amount ? (Number.parseFloat(amount) / memberCount).toFixed(2) : "0"

  const handleCustomSplitChange = (member: string, value: string) => {
    setCustomSplits((prev) => ({
      ...prev,
      [member]: Number.parseFloat(value) || 0,
    }))
  }

  const totalCustomSplit = Object.values(customSplits).reduce((sum, val) => sum + val, 0)
  const remainingAmount = amount ? Number.parseFloat(amount) - totalCustomSplit : 0

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
                <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
                <p className="text-sm text-gray-500">Split a new expense with friends</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
              Save & Notify
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Amount & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative mt-1">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`flex items-center justify-start space-x-2 h-auto p-3 ${
                        selectedCategory === category.id ? category.color : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon}
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bill Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Bill
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Add receipt for automatic amount detection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGroup === group.id
                        ? "border-teal-200 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-sm text-gray-500">{group.members.length} members</p>
                      </div>
                    </div>
                    {selectedGroup === group.id && <Check className="w-5 h-5 text-teal-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Paid By */}
          <Card>
            <CardHeader>
              <CardTitle>Paid By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {selectedGroupData?.members.map((member, index) => (
                  <Button
                    key={member}
                    variant={paidBy === member.toLowerCase().replace(" ", "") ? "default" : "outline"}
                    className="flex items-center space-x-2 h-auto p-3"
                    onClick={() => setPaidBy(member.toLowerCase().replace(" ", ""))}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                        {member === "You" ? "Y" : member.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Split Options */}
          <Card>
            <CardHeader>
              <CardTitle>Split Options</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={splitType} onValueChange={setSplitType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="equal">Equal</TabsTrigger>
                  <TabsTrigger value="percentage">Percentage</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>

                <TabsContent value="equal" className="mt-4">
                  <div className="space-y-3">
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                      <p className="text-sm text-teal-700 mb-2">Equal Split</p>
                      <p className="text-lg font-bold text-teal-800">₹{equalSplit} per person</p>
                    </div>
                    {selectedGroupData?.members.map((member) => (
                      <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {member === "You" ? "Y" : member.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member}</span>
                        </div>
                        <span className="font-bold">₹{equalSplit}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="percentage" className="mt-4">
                  <div className="space-y-3">
                    {selectedGroupData?.members.map((member) => (
                      <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {member === "You" ? "Y" : member.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input type="number" placeholder="25" className="w-16 text-center" />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="mt-4">
                  <div className="space-y-3">
                    {selectedGroupData?.members.map((member) => (
                      <div key={member} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                              {member === "You" ? "Y" : member.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">₹</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={customSplits[member] || ""}
                            onChange={(e) => handleCustomSplitChange(member, e.target.value)}
                            className="w-20 text-center"
                          />
                        </div>
                      </div>
                    ))}
                    {amount && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-700">
                          Remaining: ₹{remainingAmount.toFixed(2)}
                          {remainingAmount !== 0 && (
                            <span className="ml-2 text-red-600">
                              {remainingAmount > 0 ? "(Under-allocated)" : "(Over-allocated)"}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* UPI Integration */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">Generate UPI Payment Links</p>
                  <p className="text-sm text-green-600">Auto-create payment links for instant settlement</p>
                </div>
                <Switch checked={generateUpiLink} onCheckedChange={setGenerateUpiLink} />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {amount && description && (
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader>
                <CardTitle className="text-teal-800">Expense Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-teal-700">Total Amount:</span>
                    <span className="font-bold text-teal-800">₹{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-700">Description:</span>
                    <span className="font-bold text-teal-800">{description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-700">Group:</span>
                    <span className="font-bold text-teal-800">{selectedGroupData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-700">Split Type:</span>
                    <span className="font-bold text-teal-800 capitalize">{splitType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
