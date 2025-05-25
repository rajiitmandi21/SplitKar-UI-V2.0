"use client"

import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard, MaterialCardContent, MaterialCardDescription, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SplitKarLogo } from "@/components/ui/splitkar-logo"
import { CheckCircle, XCircle, AlertTriangle, Palette, Eye } from "lucide-react"

// Color contrast calculation function
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1: string, color2: string): number {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.substr(0, 2), 16)
  const g1 = parseInt(hex1.substr(2, 2), 16)
  const b1 = parseInt(hex1.substr(4, 2), 16)
  
  const r2 = parseInt(hex2.substr(0, 2), 16)
  const g2 = parseInt(hex2.substr(2, 2), 16)
  const b2 = parseInt(hex2.substr(4, 2), 16)
  
  const lum1 = getLuminance(r1, g1, b1)
  const lum2 = getLuminance(r2, g2, b2)
  
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

interface ColorTest {
  name: string
  foreground: string
  background: string
  usage: string
}

const lightModeTests: ColorTest[] = [
  { name: "Primary Button", foreground: "#FFFFFF", background: "#6750A4", usage: "Primary actions" },
  { name: "Secondary Button", foreground: "#1D192B", background: "#E8DEF8", usage: "Secondary actions" },
  { name: "Body Text", foreground: "#1C1B1F", background: "#FFFBFE", usage: "Main content" },
  { name: "Secondary Text", foreground: "#49454F", background: "#FFFBFE", usage: "Supporting text" },
  { name: "Outlined Button", foreground: "#6750A4", background: "#FFFBFE", usage: "Outlined actions" },
  { name: "Error Text", foreground: "#BA1A1A", background: "#FFFBFE", usage: "Error messages" },
  { name: "Success Text", foreground: "#10B981", background: "#FFFBFE", usage: "Success messages" },
  { name: "Warning Text", foreground: "#F59E0B", background: "#FFFBFE", usage: "Warning messages" },
]

const darkModeTests: ColorTest[] = [
  { name: "Primary Button", foreground: "#381E72", background: "#D0BCFF", usage: "Primary actions" },
  { name: "Secondary Button", foreground: "#E8DEF8", background: "#4A4458", usage: "Secondary actions" },
  { name: "Body Text", foreground: "#E6E1E5", background: "#1C1B1F", usage: "Main content" },
  { name: "Secondary Text", foreground: "#CAC4D0", background: "#1C1B1F", usage: "Supporting text" },
  { name: "Outlined Button", foreground: "#D0BCFF", background: "#1C1B1F", usage: "Outlined actions" },
  { name: "Error Text", foreground: "#FFB4AB", background: "#1C1B1F", usage: "Error messages" },
  { name: "Success Text", foreground: "#34D399", background: "#1C1B1F", usage: "Success messages" },
  { name: "Warning Text", foreground: "#FBBF24", background: "#1C1B1F", usage: "Warning messages" },
]

function ContrastTestCard({ test, isDark = false }: { test: ColorTest; isDark?: boolean }) {
  const ratio = getContrastRatio(test.foreground, test.background)
  const passesAA = ratio >= 4.5
  const passesAALarge = ratio >= 3
  const passesAAA = ratio >= 7
  const passesAAALarge = ratio >= 4.5

  return (
    <MaterialCard elevation={2} className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{test.name}</h3>
        <div className="flex items-center gap-2">
          {passesAA ? (
            <CheckCircle className="w-5 h-5 text-success-500" />
          ) : passesAALarge ? (
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          ) : (
            <XCircle className="w-5 h-5 text-error" />
          )}
          <span className="font-mono text-sm font-semibold">
            {ratio.toFixed(2)}:1
          </span>
        </div>
      </div>

      <div 
        className="p-4 rounded-xl border-2 border-outline dark:border-outline-dark"
        style={{ 
          backgroundColor: test.background,
          color: test.foreground,
          borderColor: isDark ? '#938F99' : '#79747E'
        }}
      >
        <p className="text-base font-medium mb-2">Sample Text (16px)</p>
        <p className="text-lg font-semibold mb-2">Large Text (18px)</p>
        <p className="text-sm">{test.usage}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-semibold text-on-surface dark:text-on-surface-dark">WCAG AA</h4>
          <div className="flex items-center gap-2">
            {passesAA ? (
              <CheckCircle className="w-4 h-4 text-success-500" />
            ) : (
              <XCircle className="w-4 h-4 text-error" />
            )}
            <span>Normal Text (4.5:1)</span>
          </div>
          <div className="flex items-center gap-2">
            {passesAALarge ? (
              <CheckCircle className="w-4 h-4 text-success-500" />
            ) : (
              <XCircle className="w-4 h-4 text-error" />
            )}
            <span>Large Text (3:1)</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-on-surface dark:text-on-surface-dark">WCAG AAA</h4>
          <div className="flex items-center gap-2">
            {passesAAA ? (
              <CheckCircle className="w-4 h-4 text-success-500" />
            ) : (
              <XCircle className="w-4 h-4 text-error" />
            )}
            <span>Normal Text (7:1)</span>
          </div>
          <div className="flex items-center gap-2">
            {passesAAALarge ? (
              <CheckCircle className="w-4 h-4 text-success-500" />
            ) : (
              <XCircle className="w-4 h-4 text-error" />
            )}
            <span>Large Text (4.5:1)</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-outline dark:border-outline-dark">
        <p className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark">
          <strong>Colors:</strong> {test.foreground} on {test.background}
        </p>
      </div>
    </MaterialCard>
  )
}

export default function ContrastTestPage() {
  const lightPassCount = lightModeTests.filter(test => getContrastRatio(test.foreground, test.background) >= 4.5).length
  const darkPassCount = darkModeTests.filter(test => getContrastRatio(test.foreground, test.background) >= 4.5).length

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-on-surface dark:text-on-surface-dark">
            Contrast Test Page
          </h1>
          <ThemeToggle />
        </div>

        {/* Text Contrast Tests */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Text Contrast Tests
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-6">
            {/* Primary Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                Primary Text (on-surface)
              </h3>
              <p className="text-on-surface dark:text-on-surface-dark">
                This is primary text that should have high contrast for readability. 
                It should meet WCAG AA standards with a contrast ratio of at least 4.5:1.
              </p>
            </div>

            {/* Secondary Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                Secondary Text (on-surface-variant)
              </h3>
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark">
                This is secondary text used for descriptions and less important content.
                It should still maintain good readability with proper contrast.
              </p>
            </div>

            {/* Primary Container Text */}
            <div className="bg-primary-container-light dark:bg-primary-container-dark p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-on-primary-container-light dark:text-on-primary-container-dark mb-2">
                Primary Container Text
              </h3>
              <p className="text-on-primary-container-light dark:text-on-primary-container-dark">
                Text on primary container background should be clearly visible.
              </p>
            </div>

            {/* Secondary Container Text */}
            <div className="bg-secondary-container dark:bg-secondary-container-dark p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-on-secondary-container dark:text-on-secondary-container-dark mb-2">
                Secondary Container Text
              </h3>
              <p className="text-on-secondary-container dark:text-on-secondary-container-dark">
                Text on secondary container background should be clearly visible.
              </p>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Button Contrast Tests */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Button Contrast Tests
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <MaterialButton variant="filled" size="lg">
                Primary Button
              </MaterialButton>
              <MaterialButton variant="outlined" size="lg">
                Secondary Button
              </MaterialButton>
              <MaterialButton variant="tonal" size="lg">
                Tonal Button
              </MaterialButton>
              <MaterialButton variant="text" size="lg">
                Text Button
              </MaterialButton>
            </div>

            {/* Button sizes */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                Button Sizes
              </h4>
              <div className="flex flex-wrap gap-4 items-center">
                <MaterialButton variant="filled" size="sm">
                  Small (14px)
                </MaterialButton>
                <MaterialButton variant="filled" size="md">
                  Medium (16px)
                </MaterialButton>
                <MaterialButton variant="filled" size="lg">
                  Large (18px)
                </MaterialButton>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Color Palette Display */}
        <MaterialCard elevation={3} className="border-0">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-on-surface dark:text-on-surface-dark">
              Color Palette
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-6">
            {/* Primary Colors */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                Primary Colors
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary-light text-on-primary-light p-4 rounded-xl text-center">
                  <div className="font-semibold">Primary Light</div>
                  <div className="text-sm">#5A3F8B</div>
                </div>
                <div className="bg-primary-container-light text-on-primary-container-light p-4 rounded-xl text-center">
                  <div className="font-semibold">Primary Container</div>
                  <div className="text-sm">#EADDFF</div>
                </div>
                <div className="bg-primary-dark text-on-primary-dark p-4 rounded-xl text-center">
                  <div className="font-semibold">Primary Dark</div>
                  <div className="text-sm">#D0BCFF</div>
                </div>
                <div className="bg-primary-container-dark text-on-primary-container-dark p-4 rounded-xl text-center">
                  <div className="font-semibold">Primary Container Dark</div>
                  <div className="text-sm">#4F378B</div>
                </div>
              </div>
            </div>

            {/* Surface Colors */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark">
                Surface Colors
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-surface text-on-surface p-4 rounded-xl text-center border border-outline">
                  <div className="font-semibold">Surface</div>
                  <div className="text-sm">#FFFBFE</div>
                </div>
                <div className="bg-surface-container text-on-surface p-4 rounded-xl text-center">
                  <div className="font-semibold">Surface Container</div>
                  <div className="text-sm">#F1ECF1</div>
                </div>
                <div className="bg-surface-container-highest text-on-surface p-4 rounded-xl text-center">
                  <div className="font-semibold">Surface Highest</div>
                  <div className="text-sm">#E6E0E6</div>
                </div>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>

        {/* Accessibility Information */}
        <MaterialCard elevation={3} className="border-0 bg-success-500/10">
          <MaterialCardContent className="p-6">
            <h3 className="text-lg font-semibold text-on-surface dark:text-on-surface-dark mb-4">
              WCAG Compliance Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-on-surface dark:text-on-surface-dark mb-2">WCAG AA Standards</h4>
                <ul className="space-y-1 text-on-surface-variant dark:text-on-surface-variant-dark">
                  <li>• Normal Text: 4.5:1 contrast ratio</li>
                  <li>• Large Text (18px+): 3:1 contrast ratio</li>
                  <li>• UI Components: 3:1 contrast ratio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-on-surface dark:text-on-surface-dark mb-2">WCAG AAA Standards</h4>
                <ul className="space-y-1 text-on-surface-variant dark:text-on-surface-variant-dark">
                  <li>• Normal Text: 7:1 contrast ratio</li>
                  <li>• Large Text (18px+): 4.5:1 contrast ratio</li>
                  <li>• Enhanced accessibility</li>
                </ul>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    </div>
  )
} 