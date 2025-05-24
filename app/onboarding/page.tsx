"use client"
import dynamic from "next/dynamic"

// Dynamically import the client component to prevent SSR issues
const OnboardingClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading onboarding...</p>
      </div>
    </div>
  ),
})

export default function OnboardingPage() {
  return <OnboardingClientPage />
}
