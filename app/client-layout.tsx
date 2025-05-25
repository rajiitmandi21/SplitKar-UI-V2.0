"use client"

import { usePathname } from "next/navigation"
import { MaterialNavigation } from "@/components/ui/material-navigation"

// Pages that should not use the navigation layout
const noNavPages = [
  "/auth",
  "/auth/login", 
  "/auth/register",
  "/auth/verify",
  "/onboarding",
  "/test-contrast",
  "/test-api-config",
  "/test-auth",
  "/test-email",
  "/verify-deployment"
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldUseNavigation = !noNavPages.includes(pathname) && pathname !== "/"

  if (shouldUseNavigation) {
    return (
      <MaterialNavigation>
        {children}
      </MaterialNavigation>
    )
  }

  return <>{children}</>
} 