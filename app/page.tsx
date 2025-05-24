"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Bell, Users, IndianRupee, ArrowRight, Star, Heart, Coffee, Home, Wifi } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant UPI Links",
      description: "Generate payment links instantly for quick settlements",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Reminders",
      description: "AI-powered nudges that actually work",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Group Management",
      description: "Manage multiple friend groups effortlessly",
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Multi-Currency",
      description: "Support for INR and international currencies",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "Finally, no more awkward money conversations with roommates!",
      rating: 5,
    },
    {
      name: "Rahul Gupta",
      location: "Bangalore",
      text: "UPI integration makes settling bills super easy. Love it!",
      rating: 5,
    },
    {
      name: "Sneha Patel",
      location: "Delhi",
      text: "Perfect for our college group. Tracks everything automatically.",
      rating: 5,
    },
  ]

  const useCases = [
    {
      icon: <Home className="w-8 h-8 text-teal-500" />,
      title: "Flatmate Expenses",
      description: "Rent, electricity, WiFi - split everything fairly",
    },
    {
      icon: <Coffee className="w-8 h-8 text-orange-500" />,
      title: "Friend Outings",
      description: "Restaurants, movies, trips - no more mental math",
    },
    {
      icon: <Wifi className="w-8 h-8 text-indigo-500" />,
      title: "Recurring Bills",
      description: "Set up monthly splits for regular expenses",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SplitKar</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
              Reviews
            </a>
          </nav>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-teal-100 text-orange-700 border-orange-200">
            India's Smartest Expense Buddy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            SplitKar: Your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">No-Drama</span>{" "}
            Expense Buddy
          </h1>
          <p className="text-xl text-gray-600 mb-4">Split bills, track expenses, and settle debts effortlessly.</p>
          <p className="text-lg text-orange-600 mb-8 font-medium">Dosti ka hisaab, bilkul saaf! 🤝</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-lg px-8"
              >
                Start Splitting <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>

          {/* Hero Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-r from-teal-100 to-indigo-100 rounded-2xl p-8 mx-auto max-w-2xl">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <p className="text-sm text-gray-600">Amit</p>
                </div>
                <div className="text-center">
                  <IndianRupee className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-gray-900">₹1,200</p>
                  <p className="text-xs text-gray-500">Dinner Bill</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <p className="text-sm text-gray-600">Priya</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  Pay ₹600 via UPI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why SplitKar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for Indian users with features that actually matter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-teal-200"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-0 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perfect for Every Situation</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Users Across India</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-indigo-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Split Smart?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've made expense splitting effortless
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8">
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SplitKar</span>
              </div>
              <p className="text-gray-400">India's smartest expense splitting app. Dosti ka hisaab, bilkul saaf!</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>UPI Integration</li>
                <li>Smart Reminders</li>
                <li>Group Management</li>
                <li>Multi-Currency</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>FAQ</li>
                <li>Contact Support</li>
                <li>Feature Requests</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 SplitKar. Made with <Heart className="w-4 h-4 inline text-red-500" /> in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
