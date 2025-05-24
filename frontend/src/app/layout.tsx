import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TestTube } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SplitKar - Smart Expense Splitting",
  description: "Split expenses easily with friends and groups",
}

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("bg-background", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        {isDemoMode && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link href="/demo">
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200 shadow-lg"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Demo Mode
              </Button>
            </Link>
          </div>
        )}
      </body>
    </html>
  )
}
