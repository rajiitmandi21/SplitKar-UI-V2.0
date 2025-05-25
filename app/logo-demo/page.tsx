"use client"

import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { SplitKarLogo, SplitKarIcon, SplitKarLogoCompact } from "@/components/ui/splitkar-logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MaterialButton } from "@/components/ui/material-button"
import { useRouter } from "next/navigation"

export default function LogoDemoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-on-surface dark:text-on-surface-dark">
            SplitKar Logo Showcase
          </h1>
          <div className="flex items-center gap-4">
            <MaterialButton 
              variant="outlined" 
              onClick={() => router.push('/')}
            >
              Back to Home
            </MaterialButton>
            <ThemeToggle />
          </div>
        </div>

        {/* Logo Sizes */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Logo Sizes
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Small</h3>
                <SplitKarLogo size="sm" showRupee={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Medium</h3>
                <SplitKarLogo size="md" showRupee={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Large</h3>
                <SplitKarLogo size="lg" showRupee={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Extra Large</h3>
                <SplitKarLogo size="xl" showRupee={true} />
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Logo with Tagline */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Logo with Tagline
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Medium with Tagline</h3>
                <SplitKarLogo size="md" showRupee={true} showTagline={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Large with Tagline</h3>
                <SplitKarLogo size="lg" showRupee={true} showTagline={true} />
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Compact Versions */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Compact Versions (for Navigation)
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Compact Logo</h3>
                <SplitKarLogoCompact />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Icon Small</h3>
                <SplitKarIcon size="sm" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">Icon Medium</h3>
                <SplitKarIcon size="md" />
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Interactive Demo */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Interactive Demo
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-8">
            <div className="text-center space-y-6">
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
                Hover over the logo to see the animation effects!
              </p>
              <div className="bg-surface-container dark:bg-surface-container-dark p-12 rounded-2xl">
                <SplitKarLogo 
                  size="xl" 
                  showRupee={true} 
                  showTagline={true}
                  onClick={() => alert('Logo clicked! 🎉')}
                />
              </div>
              <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                Click the logo to test the onClick functionality
              </p>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Animation Details */}
        <MaterialCard elevation={3} className="border-0 bg-primary-container-light dark:bg-primary-container-dark">
          <MaterialCardContent className="p-6">
            <h3 className="text-lg font-semibold text-on-primary-container-light dark:text-on-primary-container-dark mb-4">
              Animation Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-on-primary-container-light dark:text-on-primary-container-dark mb-2">
                  Hover Effects
                </h4>
                <ul className="space-y-1 text-on-primary-container-light dark:text-on-primary-container-dark opacity-90">
                  <li>• Color swap: Split (Coral → Mint), Kar (Mint → Coral)</li>
                  <li>• Gradient reversal on the slash</li>
                  <li>• Kar text slides right on hover</li>
                  <li>• Rupee symbol appears with bounce animation</li>
                  <li>• Motion hint line animates through slash</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-on-primary-container-light dark:text-on-primary-container-dark mb-2">
                  Responsive Design
                </h4>
                <ul className="space-y-1 text-on-primary-container-light dark:text-on-primary-container-dark opacity-90">
                  <li>• Multiple size variants (sm, md, lg, xl)</li>
                  <li>• Responsive text scaling</li>
                  <li>• Optional tagline and rupee symbol</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Dark mode compatibility</li>
                </ul>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Usage Examples */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Usage Examples
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark">Navigation Bar</h4>
              <div className="bg-surface-container dark:bg-surface-container-dark p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SplitKarIcon size="sm" />
                  <SplitKarLogoCompact />
                </div>
                <div className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                  Navigation items...
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark">Hero Section</h4>
              <div className="bg-surface-container dark:bg-surface-container-dark p-8 rounded-xl text-center">
                <SplitKarLogo size="xl" showRupee={true} />
                <p className="mt-4 text-on-surface-variant dark:text-on-surface-variant-dark">
                  Your No-Drama Expense Buddy
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-on-surface dark:text-on-surface-dark">Footer</h4>
              <div className="bg-surface-container dark:bg-surface-container-dark p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <SplitKarIcon size="sm" />
                  <SplitKarLogoCompact />
                </div>
                <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                  Making expense splitting effortless for millions of Indians.
                </p>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    </div>
  )
} 