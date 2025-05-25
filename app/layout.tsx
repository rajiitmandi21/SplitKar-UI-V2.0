import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import ClientLayout from "./client-layout"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "SplitKar - Smart Expense Splitting",
  description: "Split expenses effortlessly with friends and family. Track, manage, and settle shared costs with ease.",
  keywords: "expense splitting, bill sharing, group expenses, money management, split bills",
  authors: [{ name: "SplitKar Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5A3F8B" },
    { media: "(prefers-color-scheme: dark)", color: "#D0BCFF" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
          <AuthProvider>
          <ThemeProvider>
            <ClientLayout>
            {children}
            </ClientLayout>
          </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  )
}
