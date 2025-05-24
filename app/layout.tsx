"use client"

import type React from "react"

import type { Metadata } from "next"
import "./globals.css"
import { initializeDatabase } from "@/lib/database"
import { useEffect } from "react"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    // Initialize database connection on app start
    initializeDatabase().catch(console.error)
  }, [])
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
