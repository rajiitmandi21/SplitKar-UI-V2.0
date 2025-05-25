"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard, MaterialCardContent, MaterialCardDescription, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SplitKarLogo, SplitKarIcon, SplitKarLogoCompact } from "@/components/ui/splitkar-logo"
import { Badge } from "@/components/ui/badge"
import { Zap, Bell, Users, IndianRupee, ArrowRight, Star, Heart, Coffee, Home, Wifi, Shield, Smartphone, TrendingUp, CheckCircle, Play, Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant UPI Links",
      description: "Generate payment links instantly for quick settlements",
      color: "primary"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Reminders",
      description: "AI-powered nudges that actually work",
      color: "secondary"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Group Management",
      description: "Manage multiple friend groups effortlessly",
      color: "tertiary"
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Multi-Currency",
      description: "Support for INR and international currencies",
      color: "success"
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "Finally, no more awkward money conversations with roommates! SplitKar makes everything transparent and fair.",
      rating: 5,
      avatar: "P"
    },
    {
      name: "Rahul Gupta",
      location: "Bangalore",
      text: "UPI integration makes settling bills super easy. Love the instant payment links feature!",
      rating: 5,
      avatar: "R"
    },
    {
      name: "Sneha Patel",
      location: "Delhi",
      text: "Perfect for our college group. Tracks everything automatically and sends smart reminders.",
      rating: 5,
      avatar: "S"
    },
  ]

  const useCases = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Flatmate Expenses",
      description: "Rent, electricity, WiFi - split everything fairly",
      gradient: "from-primary-light to-primary-container-light dark:from-primary-dark dark:to-primary-container-dark"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Friend Outings",
      description: "Restaurants, movies, trips - no more mental math",
      gradient: "from-secondary-light to-secondary-container dark:from-secondary to-secondary-container-dark"
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Recurring Bills",
      description: "Set up monthly splits for regular expenses",
      gradient: "from-tertiary to-tertiary-container dark:from-tertiary-dark dark:to-tertiary-container-dark"
    },
  ]

  const stats = [
    { value: "50K+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
    { value: "₹10Cr+", label: "Split Successfully", icon: <IndianRupee className="w-6 h-6" /> },
    { value: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> },
    { value: "4.8★", label: "App Rating", icon: <Star className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-300">
      {/* Enhanced Material Header */}
      <header className="sticky top-0 z-50 bg-surface-container/80 dark:bg-surface-container-dark/80 backdrop-blur-xl border-b border-outline-variant dark:border-outline-variant-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                      {/* Logo */}
          <div className="flex items-center space-x-3">
            <SplitKarIcon size="md" />
            <SplitKarLogoCompact />
          </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                How it Works
              </a>
              <a href="#testimonials" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                Reviews
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth" className="hidden sm:block">
                <MaterialButton variant="filled" size="md" elevation={2}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MaterialButton>
              </Link>
              
              {/* Mobile Menu Button */}
              <MaterialButton
                variant="text"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </MaterialButton>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-outline-variant dark:border-outline-variant-dark pt-4">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                  How it Works
                </a>
                <a href="#testimonials" className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 font-medium">
                  Reviews
                </a>
                <Link href="/auth">
                  <MaterialButton variant="filled" fullWidth className="mt-4">
                    Get Started
                  </MaterialButton>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-container-light/30 via-transparent to-secondary-container/30 dark:from-primary-container-dark/20 dark:to-secondary-container-dark/20"></div>
          <div className="rangoli-pattern absolute inset-0"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <MaterialCard elevation={2} className="bg-secondary-container dark:bg-secondary-container-dark border-0 px-6 py-3 rounded-full">
                <span className="text-on-secondary-container dark:text-on-secondary-container-dark font-semibold flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  India's Smartest Expense Buddy
                </span>
              </MaterialCard>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <SplitKarLogo size="xl" showRupee={true} />
              <h1 className="text-4xl md:text-6xl font-bold text-on-surface dark:text-on-surface-dark leading-tight font-poppins">
                Your{" "}
                <span className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary bg-clip-text text-transparent">
                  No-Drama
                </span>{" "}
                Expense Buddy
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-on-surface-variant dark:text-on-surface-variant-dark max-w-3xl mx-auto leading-relaxed">
                Split bills, track expenses, and settle debts effortlessly with India's most trusted expense sharing app.
              </p>
              <p className="text-lg md:text-xl text-tertiary dark:text-tertiary-dark font-semibold">
                Dosti ka hisaab, bilkul saaf! 🤝
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/auth">
                <MaterialButton variant="filled" size="lg" elevation={3} className="text-lg px-8 py-4">
                  Start Splitting
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MaterialButton>
              </Link>
              <Link href="/logo-demo">
                <MaterialButton variant="outlined" size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 w-5 h-5" />
                  Logo Demo
                </MaterialButton>
              </Link>
            </div>

            {/* Hero Illustration */}
            <div className="pt-12">
              <MaterialCard elevation={4} className="bg-surface-container-highest dark:bg-surface-container-highest-dark rounded-3xl p-8 mx-auto max-w-2xl border-0 shadow-2xl">
                <div className="grid grid-cols-3 gap-6 items-center">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-tertiary to-error rounded-full mx-auto flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-black/20">
                      <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <p className="text-on-surface dark:text-on-surface-dark font-semibold">Amit</p>
                  </div>
                  <div className="text-center space-y-4">
                    <MaterialCard elevation={2} className="bg-primary-container-light dark:bg-primary-container-dark rounded-2xl p-4 border-0">
                      <IndianRupee className="w-12 h-12 mx-auto text-on-primary-container-light dark:text-on-primary-container-dark" />
                    </MaterialCard>
                    <div>
                      <p className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">₹1,200</p>
                      <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark bg-surface-container dark:bg-surface-container-dark rounded-full px-3 py-1.5 font-medium inline-block">
                        Dinner Bill
                      </p>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-secondary-light to-primary-light dark:from-secondary to-primary-dark rounded-full mx-auto flex items-center justify-center shadow-lg ring-4 ring-white/20 dark:ring-black/20">
                      <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <p className="text-on-surface dark:text-on-surface-dark font-semibold">Priya</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <MaterialButton variant="filled" size="md" className="bg-success-500 hover:bg-success-600 text-white shadow-lg">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Pay ₹600 via UPI
                  </MaterialButton>
                </div>
              </MaterialCard>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface-container dark:bg-surface-container-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <MaterialCard key={index} elevation={2} className="text-center p-6 border-0 bg-surface dark:bg-surface-dark">
                <div className="w-12 h-12 bg-primary-container-light dark:bg-primary-container-dark rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-light dark:text-primary-dark">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-on-surface dark:text-on-surface-dark mb-2">{stat.value}</p>
                <p className="text-on-surface-variant dark:text-on-surface-variant-dark font-medium">{stat.label}</p>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-surface dark:bg-surface-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface dark:text-on-surface-dark font-poppins">
              Why Choose SplitKar?
            </h2>
            <p className="text-xl text-on-surface-variant dark:text-on-surface-variant-dark max-w-3xl mx-auto leading-relaxed">
              Built specifically for Indian users with features that actually matter in real-life scenarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MaterialCard
                key={index}
                elevation={activeFeature === index ? 4 : 2}
                className={cn(
                  "p-8 cursor-pointer transition-all duration-300 border-0 group hover:scale-105",
                  activeFeature === index && "ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark"
                )}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <MaterialCardContent className="p-0 text-center space-y-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                    feature.color === "primary" && "bg-gradient-to-br from-primary-light to-primary-container-light dark:from-primary-dark dark:to-primary-container-dark",
                    feature.color === "secondary" && "bg-gradient-to-br from-secondary-light to-secondary-container dark:from-secondary to-secondary-container-dark",
                    feature.color === "tertiary" && "bg-gradient-to-br from-tertiary to-tertiary-container dark:from-tertiary-dark dark:to-tertiary-container-dark",
                    feature.color === "success" && "bg-gradient-to-br from-success-500 to-success-600"
                  )}>
                    {feature.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-on-surface dark:text-on-surface-dark">{feature.title}</h3>
                    <p className="text-on-surface-variant dark:text-on-surface-variant-dark leading-relaxed">{feature.description}</p>
                  </div>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Use Cases */}
      <section className="py-20 bg-surface-container dark:bg-surface-container-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface dark:text-on-surface-dark font-poppins">
              Perfect for Every Situation
            </h2>
            <p className="text-xl text-on-surface-variant dark:text-on-surface-variant-dark max-w-2xl mx-auto">
              From daily expenses to special occasions, SplitKar adapts to your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <MaterialCard key={index} elevation={3} className="p-8 text-center border-0 group hover:scale-105 transition-all duration-300">
                <MaterialCardContent className="p-0 space-y-6">
                  <div className={cn("w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl bg-gradient-to-br", useCase.gradient)}>
                    {useCase.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-on-surface dark:text-on-surface-dark">{useCase.title}</h3>
                    <p className="text-on-surface-variant dark:text-on-surface-variant-dark leading-relaxed">{useCase.description}</p>
                  </div>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-20 bg-surface dark:bg-surface-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface dark:text-on-surface-dark font-poppins">
              Loved by Thousands
            </h2>
            <p className="text-xl text-on-surface-variant dark:text-on-surface-variant-dark max-w-2xl mx-auto">
              See what our users say about their SplitKar experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <MaterialCard key={index} elevation={3} className="p-8 border-0 bg-surface-container-highest dark:bg-surface-container-highest-dark">
                <MaterialCardContent className="p-0 space-y-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning-500 text-warning-500" />
                    ))}
                  </div>
                  <p className="text-on-surface dark:text-on-surface-dark leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface dark:text-on-surface-dark">{testimonial.name}</p>
                      <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">{testimonial.location}</p>
                    </div>
                  </div>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-container-light to-secondary-container dark:from-primary-container-dark dark:to-secondary-container-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-on-primary-container-light dark:text-on-primary-container-dark font-poppins">
              Ready to Split Smarter?
            </h2>
            <p className="text-xl text-on-primary-container-light dark:text-on-primary-container-dark leading-relaxed">
              Join thousands of users who've made expense splitting effortless. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth">
                <MaterialButton variant="filled" size="lg" elevation={3} className="text-lg px-8 py-4 bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MaterialButton>
              </Link>
              <MaterialButton variant="outlined" size="lg" className="text-lg px-8 py-4 border-2 border-on-primary-container-light dark:border-on-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark">
                Learn More
              </MaterialButton>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-surface-container-highest dark:bg-surface-container-highest-dark py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SplitKarIcon size="sm" />
                <SplitKarLogoCompact />
              </div>
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
                Making expense splitting effortless for millions of Indians.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark mb-4">Product</h4>
              <ul className="space-y-2 text-on-surface-variant dark:text-on-surface-variant-dark">
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark mb-4">Company</h4>
              <ul className="space-y-2 text-on-surface-variant dark:text-on-surface-variant-dark">
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark mb-4">Support</h4>
              <ul className="space-y-2 text-on-surface-variant dark:text-on-surface-variant-dark">
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-outline-variant dark:border-outline-variant-dark mt-12 pt-8 text-center">
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
              © 2025 SplitKar. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
