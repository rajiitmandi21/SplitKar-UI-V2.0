"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { MaterialButton } from "./material-button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle case where theme context might not be available
  let theme = 'light'
  let toggleTheme = () => {}
  
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
    toggleTheme = themeContext.toggleTheme
  } catch (error) {
    // Fallback to manual theme handling if context is not available
    const handleToggle = () => {
      const isDark = document.documentElement.classList.contains('dark')
      document.documentElement.classList.toggle('dark', !isDark)
      localStorage.setItem('theme', isDark ? 'light' : 'dark')
    }
    toggleTheme = handleToggle
    theme = typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <MaterialButton
        variant="outlined"
        size="sm"
        className="w-10 h-10 p-0"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" />
      </MaterialButton>
    )
  }

  return (
    <MaterialButton
      variant="outlined"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </MaterialButton>
  )
} 