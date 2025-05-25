"use client"

import React, { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface MaterialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'
  size?: 'sm' | 'md' | 'lg'
  elevation?: 0 | 1 | 2 | 3 | 4 | 5
  children: React.ReactNode
  fullWidth?: boolean
  loading?: boolean
}

export function MaterialButton({
  variant = 'filled',
  size = 'md',
  elevation = 1,
  className,
  children,
  disabled,
  onClick,
  fullWidth = false,
  loading = false,
  ...props
}: MaterialButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)

    onClick?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
      // Create ripple effect for keyboard activation
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.width / 2
      const y = rect.height / 2
      const id = Date.now()

      setRipples(prev => [...prev, { x, y, id }])

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id))
      }, 600)
    }
  }

  const baseClasses = cn(
    "relative overflow-hidden font-semibold transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "active:scale-95",
    fullWidth && "w-full",
    // Enhanced accessibility
    "focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark"
  )
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg min-h-[36px]",
    md: "px-6 py-3 text-base rounded-xl min-h-[44px]",
    lg: "px-8 py-4 text-lg rounded-2xl min-h-[52px]"
  }

  const elevationClasses = {
    0: "shadow-none",
    1: "shadow-md hover:shadow-lg active:shadow-md",
    2: "shadow-lg hover:shadow-xl active:shadow-lg",
    3: "shadow-xl hover:shadow-2xl active:shadow-xl",
    4: "shadow-2xl hover:shadow-3xl active:shadow-2xl",
    5: "shadow-3xl hover:shadow-4xl active:shadow-3xl"
  }

  const variantClasses = {
    filled: cn(
      "bg-primary-light text-on-primary-light",
      "dark:bg-primary-dark dark:text-on-primary-dark",
      "hover:bg-primary-light/90 dark:hover:bg-primary-dark/90",
      "active:bg-primary-light/80 dark:active:bg-primary-dark/80",
      "focus:ring-primary-light/50 dark:focus:ring-primary-dark/50"
    ),
    elevated: cn(
      "bg-surface-container-low text-primary-light",
      "dark:bg-surface-container-low-dark dark:text-primary-dark",
      "hover:bg-surface-container dark:hover:bg-surface-container-dark",
      "active:bg-surface-container-high dark:active:bg-surface-container-high-dark",
      "focus:ring-primary-light/50 dark:focus:ring-primary-dark/50"
    ),
    tonal: cn(
      "bg-secondary-container text-on-secondary-container",
      "dark:bg-secondary-container-dark dark:text-on-secondary-container-dark",
      "hover:bg-secondary-container/80 dark:hover:bg-secondary-container-dark/80",
      "active:bg-secondary-container/60 dark:active:bg-secondary-container-dark/60",
      "focus:ring-secondary-light/50 dark:focus:ring-secondary/50"
    ),
    outlined: cn(
      "border-2 border-outline text-primary-light bg-transparent",
      "dark:border-outline-dark dark:text-primary-dark",
      "hover:bg-primary-light/5 hover:border-primary-light",
      "dark:hover:bg-primary-dark/5 dark:hover:border-primary-dark",
      "active:bg-primary-light/10 dark:active:bg-primary-dark/10",
      "focus:ring-primary-light/50 dark:focus:ring-primary-dark/50"
    ),
    text: cn(
      "text-primary-light bg-transparent",
      "dark:text-primary-dark",
      "hover:bg-primary-light/5 dark:hover:bg-primary-dark/5",
      "active:bg-primary-light/10 dark:active:bg-primary-dark/10",
      "focus:ring-primary-light/50 dark:focus:ring-primary-dark/50"
    )
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        baseClasses,
        sizeClasses[size],
        elevationClasses[elevation],
        variantClasses[variant],
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Enhanced Ripple Effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={cn(
            "absolute rounded-full pointer-events-none",
            "bg-white/30 dark:bg-white/20",
            "animate-ping"
          )}
          style={{
            left: ripple.x - 12,
            top: ripple.y - 12,
            width: 24,
            height: 24,
            animationDuration: '0.6s',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
      
      {/* Button Content with Loading State */}
      <span className={cn(
        "relative z-10 flex items-center justify-center gap-2",
        "transition-opacity duration-200",
        loading && "opacity-70"
      )}>
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>

      {/* Enhanced Focus Ring for High Contrast Mode */}
      <span 
        className={cn(
          "absolute inset-0 rounded-[inherit] pointer-events-none",
          "ring-2 ring-transparent transition-all duration-200",
          "group-focus-visible:ring-current"
        )}
        aria-hidden="true"
      />
    </button>
  )
} 