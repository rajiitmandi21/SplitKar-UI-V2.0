"use client"

import React, { useState, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
  errorText?: string
  variant?: 'filled' | 'outlined'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const MaterialInput = forwardRef<HTMLInputElement, MaterialInputProps>(
  ({
    label,
    helperText,
    error = false,
    errorText,
    variant = 'outlined',
    startIcon,
    endIcon,
    showPasswordToggle = false,
    className,
    type = 'text',
    disabled = false,
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const baseClasses = cn(
      "w-full transition-all duration-200 ease-out",
      "text-on-surface dark:text-on-surface-dark",
      "placeholder:text-on-surface-variant dark:placeholder:text-on-surface-variant-dark",
      disabled && "opacity-60 cursor-not-allowed"
    )

    const containerClasses = cn(
      "relative group",
      className
    )

    const inputClasses = cn(
      baseClasses,
      variant === 'outlined' ? [
        "h-14 px-4 pt-6 pb-2",
        "bg-surface dark:bg-surface-dark",
        "border-2 rounded-xl",
        "focus:outline-none",
        error 
          ? "border-error dark:border-error-dark" 
          : focused 
            ? "border-primary-light dark:border-primary-dark" 
            : "border-outline dark:border-outline-dark hover:border-on-surface dark:hover:border-on-surface-dark",
      ] : [
        "h-14 px-4 pt-6 pb-2",
        "bg-surface-container-highest dark:bg-surface-container-highest-dark",
        "border-0 border-b-2 rounded-t-xl",
        "focus:outline-none",
        error 
          ? "border-b-error dark:border-b-error-dark" 
          : focused 
            ? "border-b-primary-light dark:border-b-primary-dark" 
            : "border-b-outline dark:border-b-outline-dark hover:border-b-on-surface dark:hover:border-b-on-surface-dark",
      ],
      startIcon && "pl-12",
      (endIcon || showPasswordToggle) && "pr-12"
    )

    const labelClasses = cn(
      "absolute left-4 transition-all duration-200 ease-out pointer-events-none",
      "text-on-surface-variant dark:text-on-surface-variant-dark",
      startIcon && "left-12",
      (focused || hasValue) ? [
        "top-2 text-xs font-medium",
        error 
          ? "text-error dark:text-error-dark" 
          : focused 
            ? "text-primary-light dark:text-primary-dark" 
            : "text-on-surface-variant dark:text-on-surface-variant-dark"
      ] : [
        "top-1/2 -translate-y-1/2 text-base",
        "text-on-surface-variant dark:text-on-surface-variant-dark"
      ]
    )

    const helperTextClasses = cn(
      "mt-1 text-xs",
      error 
        ? "text-error dark:text-error-dark" 
        : "text-on-surface-variant dark:text-on-surface-variant-dark"
    )

    return (
      <div className={containerClasses}>
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant-dark">
              {startIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              props.onBlur?.(e)
            }}
            onChange={handleInputChange}
            disabled={disabled}
            {...props}
          />

          {/* Label */}
          {label && (
            <label className={labelClasses}>
              {label}
            </label>
          )}

          {/* End Icon or Password Toggle */}
          {(endIcon || showPasswordToggle) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant dark:text-on-surface-variant-dark hover:text-on-surface dark:hover:text-on-surface-dark transition-colors p-1 rounded-lg hover:bg-surface-container dark:hover:bg-surface-container-dark"
                  disabled={disabled}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              ) : endIcon ? (
                <div className="text-on-surface-variant dark:text-on-surface-variant-dark">
                  {endIcon}
                </div>
              ) : null}
            </div>
          )}

          {/* Focus Ring */}
          {variant === 'outlined' && (
            <div className={cn(
              "absolute inset-0 rounded-xl pointer-events-none transition-all duration-200",
              focused && !error && "ring-2 ring-primary-light/20 dark:ring-primary-dark/20"
            )} />
          )}
        </div>

        {/* Helper Text */}
        {(helperText || errorText) && (
          <div className={helperTextClasses}>
            {error && errorText ? errorText : helperText}
          </div>
        )}
      </div>
    )
  }
)

MaterialInput.displayName = "MaterialInput"

// Textarea variant
interface MaterialTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: boolean
  errorText?: string
  variant?: 'filled' | 'outlined'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const MaterialTextarea = forwardRef<HTMLTextAreaElement, MaterialTextareaProps>(
  ({
    label,
    helperText,
    error = false,
    errorText,
    variant = 'outlined',
    startIcon,
    endIcon,
    className,
    disabled = false,
    rows = 4,
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const baseClasses = cn(
      "w-full transition-all duration-200 ease-out resize-none",
      "text-on-surface dark:text-on-surface-dark",
      "placeholder:text-on-surface-variant dark:placeholder:text-on-surface-variant-dark",
      disabled && "opacity-60 cursor-not-allowed"
    )

    const containerClasses = cn(
      "relative group",
      className
    )

    const textareaClasses = cn(
      baseClasses,
      variant === 'outlined' ? [
        "px-4 pt-6 pb-2",
        "bg-surface dark:bg-surface-dark",
        "border-2 rounded-xl",
        "focus:outline-none",
        error 
          ? "border-error dark:border-error-dark" 
          : focused 
            ? "border-primary-light dark:border-primary-dark" 
            : "border-outline dark:border-outline-dark hover:border-on-surface dark:hover:border-on-surface-dark",
      ] : [
        "px-4 pt-6 pb-2",
        "bg-surface-container-highest dark:bg-surface-container-highest-dark",
        "border-0 border-b-2 rounded-t-xl",
        "focus:outline-none",
        error 
          ? "border-b-error dark:border-b-error-dark" 
          : focused 
            ? "border-b-primary-light dark:border-b-primary-dark" 
            : "border-b-outline dark:border-b-outline-dark hover:border-b-on-surface dark:hover:border-b-on-surface-dark",
      ],
      startIcon && "pl-12",
      endIcon && "pr-12"
    )

    const labelClasses = cn(
      "absolute left-4 transition-all duration-200 ease-out pointer-events-none",
      "text-on-surface-variant dark:text-on-surface-variant-dark",
      startIcon && "left-12",
      (focused || hasValue) ? [
        "top-2 text-xs font-medium",
        error 
          ? "text-error dark:text-error-dark" 
          : focused 
            ? "text-primary-light dark:text-primary-dark" 
            : "text-on-surface-variant dark:text-on-surface-variant-dark"
      ] : [
        "top-6 text-base",
        "text-on-surface-variant dark:text-on-surface-variant-dark"
      ]
    )

    const helperTextClasses = cn(
      "mt-1 text-xs",
      error 
        ? "text-error dark:text-error-dark" 
        : "text-on-surface-variant dark:text-on-surface-variant-dark"
    )

    return (
      <div className={containerClasses}>
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className="absolute left-4 top-6 text-on-surface-variant dark:text-on-surface-variant-dark">
              {startIcon}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={ref}
            rows={rows}
            className={textareaClasses}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              props.onBlur?.(e)
            }}
            onChange={handleTextareaChange}
            disabled={disabled}
            {...props}
          />

          {/* Label */}
          {label && (
            <label className={labelClasses}>
              {label}
            </label>
          )}

          {/* End Icon */}
          {endIcon && (
            <div className="absolute right-4 top-6 text-on-surface-variant dark:text-on-surface-variant-dark">
              {endIcon}
            </div>
          )}

          {/* Focus Ring */}
          {variant === 'outlined' && (
            <div className={cn(
              "absolute inset-0 rounded-xl pointer-events-none transition-all duration-200",
              focused && !error && "ring-2 ring-primary-light/20 dark:ring-primary-dark/20"
            )} />
          )}
        </div>

        {/* Helper Text */}
        {(helperText || errorText) && (
          <div className={helperTextClasses}>
            {error && errorText ? errorText : helperText}
          </div>
        )}
      </div>
    )
  }
)

MaterialTextarea.displayName = "MaterialTextarea" 