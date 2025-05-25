"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MaterialButton } from './material-button'
import { MaterialCard } from './material-card'
import { ThemeToggle } from './theme-toggle'
import { SplitKarIcon, SplitKarLogoCompact } from './splitkar-logo'
import { cn } from '@/lib/utils'
import {
  Home,
  PieChart,
  Users,
  CreditCard,
  Settings,
  Bell,
  User,
  Menu,
  X,
  IndianRupee,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface NavigationItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string | number
}

const navigationItems: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />
  },
  {
    href: '/expenses',
    label: 'Expenses',
    icon: <IndianRupee className="w-5 h-5" />
  },
  {
    href: '/groups',
    label: 'Groups',
    icon: <Users className="w-5 h-5" />
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: <PieChart className="w-5 h-5" />
  },
  {
    href: '/settle',
    label: 'Settle',
    icon: <CreditCard className="w-5 h-5" />,
    badge: '3'
  }
]

interface MaterialNavigationProps {
  children: React.ReactNode
}

export function MaterialNavigation({ children }: MaterialNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-surface-container/95 dark:bg-surface-container-dark/95 backdrop-blur-xl border-b border-outline-variant dark:border-outline-variant-dark">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <MaterialButton
              variant="text"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </MaterialButton>
            
            <Link href="/" className="flex items-center space-x-3">
              <SplitKarIcon size="sm" />
              <SplitKarLogoCompact />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <MaterialButton
                    variant={isActive ? "tonal" : "text"}
                    size="md"
                    className={cn(
                      "relative",
                      isActive && "bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-error dark:bg-error-dark text-on-error dark:text-on-error-dark text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </MaterialButton>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <MaterialButton variant="text" size="sm">
              <Search className="w-5 h-5" />
            </MaterialButton>
            <MaterialButton variant="text" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error dark:bg-error-dark rounded-full"></span>
            </MaterialButton>
            <ThemeToggle />
            <MaterialButton variant="text" size="sm">
              <User className="w-5 h-5" />
            </MaterialButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant dark:border-outline-variant-dark">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <MaterialButton
                      variant={isActive ? "tonal" : "text"}
                      size="md"
                      fullWidth
                      className={cn(
                        "justify-start relative",
                        isActive && "bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 bg-error dark:bg-error-dark text-on-error dark:text-on-error-dark text-xs rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </MaterialButton>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container dark:bg-surface-container-dark border-t border-outline-variant dark:border-outline-variant-dark">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <MaterialButton
                  variant="text"
                  size="sm"
                  className={cn(
                    "flex-col h-16 w-full relative",
                    isActive && "text-primary-light dark:text-primary-dark"
                  )}
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-error dark:bg-error-dark text-on-error dark:text-on-error-dark text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-light dark:bg-primary-dark rounded-full"></div>
                  )}
                </MaterialButton>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-30">
        <Link href="/expenses/add">
          <MaterialButton
            variant="filled"
            size="lg"
            elevation={4}
            className="w-14 h-14 rounded-full bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark shadow-2xl hover:shadow-3xl"
          >
            <Plus className="w-6 h-6" />
          </MaterialButton>
        </Link>
      </div>
    </div>
  )
}

// Quick Actions Component
export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Link href="/expenses/add">
        <MaterialButton variant="filled" size="md" elevation={2}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </MaterialButton>
      </Link>
      <Link href="/groups/create">
        <MaterialButton variant="outlined" size="md">
          <Users className="w-4 h-4 mr-2" />
          Create Group
        </MaterialButton>
      </Link>
      <MaterialButton variant="tonal" size="md">
        <PieChart className="w-4 h-4 mr-2" />
        Analytics
      </MaterialButton>
      <MaterialButton variant="text" size="md">
        <Filter className="w-4 h-4 mr-2" />
        Filter
      </MaterialButton>
    </div>
  )
} 