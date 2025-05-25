"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SplitKarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  showRupee?: boolean
  className?: string
  onClick?: () => void
}

export function SplitKarLogo({ 
  size = 'md', 
  showTagline = false, 
  showRupee = true,
  className,
  onClick 
}: SplitKarLogoProps) {
  const sizeClasses = {
    sm: {
      text: 'text-xl md:text-2xl',
      slash: 'w-2 h-8 mx-1',
      tagline: 'text-xs',
      rupee: 'text-sm top-[-8px] right-[-8px]'
    },
    md: {
      text: 'text-2xl md:text-3xl',
      slash: 'w-3 h-10 mx-2',
      tagline: 'text-sm',
      rupee: 'text-base top-[-10px] right-[-10px]'
    },
    lg: {
      text: 'text-3xl md:text-4xl',
      slash: 'w-4 h-12 mx-2',
      tagline: 'text-base',
      rupee: 'text-lg top-[-12px] right-[-12px]'
    },
    xl: {
      text: 'text-4xl md:text-5xl lg:text-6xl',
      slash: 'w-4 h-16 mx-3',
      tagline: 'text-lg',
      rupee: 'text-xl top-[-15px] right-[-15px]'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={cn("inline-block text-center", className)}>
      <div 
        className={cn(
          "flex items-center justify-center relative cursor-pointer group transition-all duration-300",
          onClick && "hover:scale-105"
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
      >
        {/* Split Text */}
        <span className={cn(
          currentSize.text,
          "font-bold transition-colors duration-400 ease-in-out",
          "text-[#EA5455] group-hover:text-[#00B8A9]" // Coral to Mint
        )}>
          Split
        </span>

        {/* Animated Slash */}
        <div className={cn(
          currentSize.slash,
          "bg-gradient-to-b from-[#EA5455] to-[#00B8A9]",
          "transform skew-x-[-15deg] transition-all duration-400 ease-in-out relative",
          "group-hover:bg-gradient-to-b group-hover:from-[#00B8A9] group-hover:to-[#EA5455]",
          "group-hover:skew-x-[-10deg] group-hover:scale-105"
        )}>
          {/* Motion hint line */}
          <div className={cn(
            "absolute left-1/2 top-[-10%] w-0.5 h-0 bg-[#EA5455]",
            "opacity-0 transition-all duration-300 ease-out transform -translate-x-1/2",
            "group-hover:h-[120%] group-hover:opacity-70 group-hover:bg-[#00B8A9]"
          )} />
        </div>

        {/* Kar Text */}
        <span className={cn(
          currentSize.text,
          "font-bold transition-all duration-400 ease-in-out inline-block",
          "text-[#00B8A9] group-hover:text-[#EA5455] group-hover:translate-x-2" // Mint to Coral
        )}>
          Kar
        </span>

        {/* Rupee Symbol */}
        {showRupee && (
          <div className={cn(
            currentSize.rupee,
            "text-[#00B8A9] absolute transition-opacity duration-400 ease-in-out",
            "opacity-0 group-hover:opacity-100 animate-bounce",
            "pointer-events-none select-none"
          )}>
            ₹
          </div>
        )}
      </div>

      {/* Tagline */}
      {showTagline && (
        <div className={cn(
          currentSize.tagline,
          "font-light text-[#2D4059] dark:text-on-surface-variant-dark mt-1",
          "transition-colors duration-300"
        )}>
          Kitne Aadmi The? Sabne SplitKar Kiya!
        </div>
      )}
    </div>
  )
}

// Compact version for navigation bars
export function SplitKarLogoCompact({ 
  className,
  onClick 
}: { 
  className?: string
  onClick?: () => void 
}) {
  return (
    <SplitKarLogo 
      size="sm" 
      showTagline={false} 
      showRupee={false}
      className={className}
      onClick={onClick}
    />
  )
}

// Icon version for favicons and small spaces
export function SplitKarIcon({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={cn(
      sizeClasses[size],
      "relative flex items-center justify-center rounded-2xl",
      "bg-gradient-to-br from-[#EA5455] to-[#00B8A9]",
      "shadow-lg transition-transform duration-300 hover:scale-110",
      className
    )}>
      <span className="text-white font-bold text-lg">₹</span>
    </div>
  )
} 