"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface MaterialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5
  children: React.ReactNode
}

export function MaterialCard({
  elevation = 1,
  className,
  children,
  ...props
}: MaterialCardProps) {
  const elevationClasses = {
    0: "shadow-none",
    1: "shadow-md hover:shadow-lg transition-shadow duration-300",
    2: "shadow-lg hover:shadow-xl transition-shadow duration-300",
    3: "shadow-xl hover:shadow-2xl transition-shadow duration-300",
    4: "shadow-2xl hover:shadow-3xl transition-shadow duration-300",
    5: "shadow-3xl hover:shadow-4xl transition-shadow duration-300"
  }

  return (
    <div
      className={cn(
        "rounded-3xl bg-surface-container dark:bg-surface-container-dark",
        "border border-outline-variant dark:border-outline-variant-dark",
        "transition-all duration-300",
        elevationClasses[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function MaterialCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6 pb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function MaterialCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        "text-on-surface dark:text-on-surface-dark",
        "font-poppins",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function MaterialCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-on-surface-variant dark:text-on-surface-variant-dark",
        "leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function MaterialCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function MaterialCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 