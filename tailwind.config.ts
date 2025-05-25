import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", "Monaco", "Courier New", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Primary Brand Color - Teal/Turquoise (Trust, Balance, Financial Clarity)
        primary: {
          DEFAULT: "#2DD4C4",
          50: "#E6FFFE",
          100: "#CCFFFC",
          200: "#99FFF9",
          300: "#66FFF6",
          400: "#33FFF3",
          500: "#2DD4C4", // Main brand color
          600: "#24A99D",
          700: "#1B7F76",
          800: "#12544E",
          900: "#092A27",
          950: "#041413",
          foreground: "hsl(var(--primary-foreground))",
        },

        // Secondary Brand Color - Indigo (Professional, Trustworthy)
        secondary: {
          DEFAULT: "#6366F1",
          50: "#F0F0FF",
          100: "#E0E1FF",
          200: "#C1C3FF",
          300: "#A2A5FF",
          400: "#8387FF",
          500: "#6366F1", // Secondary actions, links
          600: "#4F52C1",
          700: "#3B3E91",
          800: "#272960",
          900: "#131530",
          950: "#0A0B18",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // Accent Color - Coral Red (Attention, Warnings, Debts)
        accent: {
          DEFAULT: "#FF6B6B",
          50: "#FFF0F0",
          100: "#FFE1E1",
          200: "#FFC3C3",
          300: "#FFA5A5",
          400: "#FF8787",
          500: "#FF6B6B", // Debt indicators, warnings
          600: "#CC5656",
          700: "#994040",
          800: "#662B2B",
          900: "#331515",
          950: "#1A0B0B",
          foreground: "hsl(var(--accent-foreground))",
        },

        // Success Color - Emerald Green (Settlements, Positive Balances)
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // Settlement confirmations, positive balances
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },

        // Warning Color - Amber (Pending Actions, Notifications)
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Pending settlements, notifications
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },

        // Error/Destructive Color - Red (Errors, Deletions)
        destructive: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444", // Error states, delete actions
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // Orange - Warm accent for highlights
        orange: {
          DEFAULT: "#FF8E53",
          50: "#FFF4F0",
          100: "#FFE9E1",
          200: "#FFD3C3",
          300: "#FFBDA5",
          400: "#FFA787",
          500: "#FF8E53", // Expense categories, highlights
          600: "#CC7242",
          700: "#995632",
          800: "#663921",
          900: "#331D11",
          950: "#1A0E08",
        },

        // Teal - Alternative primary shade
        teal: {
          DEFAULT: "#2DD4C4",
          50: "#E6FFFE",
          100: "#CCFFFC",
          200: "#99FFF9",
          300: "#66FFF6",
          400: "#33FFF3",
          500: "#2DD4C4", // Matches primary
          600: "#24A99D",
          700: "#1B7F76",
          800: "#12544E",
          900: "#092A27",
          950: "#041413",
        },

        // Indigo - Matches secondary
        indigo: {
          DEFAULT: "#6366F1",
          50: "#F0F0FF",
          100: "#E0E1FF",
          200: "#C1C3FF",
          300: "#A2A5FF",
          400: "#8387FF",
          500: "#6366F1",
          600: "#4F52C1",
          700: "#3B3E91",
          800: "#272960",
          900: "#131530",
          950: "#0A0B18",
        },

        // Neutral Grays - Enhanced scale
        gray: {
          DEFAULT: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },

        // Semantic UI Colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Expense Category Colors
        category: {
          food: "#FF6B6B", // Coral red
          transport: "#4ECDC4", // Teal
          entertainment: "#45B7D1", // Blue
          shopping: "#96CEB4", // Mint green
          utilities: "#FFEAA7", // Light yellow
          healthcare: "#DDA0DD", // Plum
          education: "#98D8C8", // Seafoam
          travel: "#F7DC6F", // Gold
          other: "#BDC3C7", // Light gray
        },

        // Status Colors for Settlements
        settlement: {
          pending: "#F59E0B", // Amber
          confirmed: "#10B981", // Emerald
          rejected: "#EF4444", // Red
          processing: "#6366F1", // Indigo
        },

        // Balance Indicator Colors
        balance: {
          positive: "#10B981", // Green - you are owed money
          negative: "#FF6B6B", // Red - you owe money
          neutral: "#6B7280", // Gray - balanced
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },

      screens: {
        xs: "475px",
        "3xl": "1600px",
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },

      keyframes: {
        // Accordion animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Entrance animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        // Scale animations
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "scale-out": {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
        },

        // Bounce animations
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        // Loading animations
        shimmer: {
          "0%": {
            "background-position": "-200% 0",
          },
          "100%": {
            "background-position": "200% 0",
          },
        },
        "loading-dots": {
          "0%, 80%, 100%": {
            transform: "scale(0)",
          },
          "40%": {
            transform: "scale(1)",
          },
        },

        // Pulse animations for different states
        "pulse-green": {
          "0%": {
            "box-shadow": "0 0 0 0 rgba(16, 185, 129, 0.7)",
          },
          "70%": {
            "box-shadow": "0 0 0 10px rgba(16, 185, 129, 0)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 rgba(16, 185, 129, 0)",
          },
        },
        "pulse-red": {
          "0%": {
            "box-shadow": "0 0 0 0 rgba(239, 68, 68, 0.7)",
          },
          "70%": {
            "box-shadow": "0 0 0 10px rgba(239, 68, 68, 0)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 rgba(239, 68, 68, 0)",
          },
        },
        "pulse-amber": {
          "0%": {
            "box-shadow": "0 0 0 0 rgba(245, 158, 11, 0.7)",
          },
          "70%": {
            "box-shadow": "0 0 0 10px rgba(245, 158, 11, 0)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 rgba(245, 158, 11, 0)",
          },
        },

        // Slide animations
        "slide-in-right": {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },

        // Wiggle animation for errors
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },

        // Spin variations
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },

        // Notification animations
        "notification-enter": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%) scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
        },
        "notification-exit": {
          "0%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(100%) scale(0.8)",
          },
        },
      },

      animation: {
        // Accordion
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Entrance animations
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "fade-in-left": "fade-in-left 0.5s ease-out",
        "fade-in-right": "fade-in-right 0.5s ease-out",

        // Scale animations
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-in",

        // Bounce animations
        "bounce-gentle": "bounce-gentle 2s infinite",
        "bounce-in": "bounce-in 0.6s ease-out",

        // Loading animations
        shimmer: "shimmer 1.5s infinite",
        "loading-dots": "loading-dots 1.4s infinite ease-in-out both",

        // Pulse animations
        "pulse-green": "pulse-green 2s infinite",
        "pulse-red": "pulse-red 2s infinite",
        "pulse-amber": "pulse-amber 2s infinite",

        // Slide animations
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",

        // Utility animations
        wiggle: "wiggle 0.5s ease-in-out",
        "spin-slow": "spin-slow 3s linear infinite",

        // Notification animations
        "notification-enter": "notification-enter 0.3s ease-out",
        "notification-exit": "notification-exit 0.3s ease-in",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        // SplitKar specific patterns
        "rangoli-pattern":
          "radial-gradient(circle at 25% 25%, #2DD4C4 2px, transparent 2px), radial-gradient(circle at 75% 75%, #FF6B6B 2px, transparent 2px)",
        "expense-pattern":
          "linear-gradient(45deg, rgba(45, 212, 196, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(45, 212, 196, 0.1) 25%, transparent 25%)",
        "settlement-pattern": "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",

        // Gradient combinations for cards and sections
        "card-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "primary-gradient": "linear-gradient(135deg, #2DD4C4 0%, #24A99D 100%)",
        "secondary-gradient": "linear-gradient(135deg, #6366F1 0%, #4F52C1 100%)",
        "success-gradient": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "warning-gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "error-gradient": "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",

        // Shimmer effect for loading states
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
      },

      boxShadow: {
        // Custom shadows for different UI elements
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        expense: "0 2px 8px rgba(45, 212, 196, 0.15)",
        settlement: "0 2px 8px rgba(16, 185, 129, 0.15)",
        warning: "0 2px 8px rgba(245, 158, 11, 0.15)",
        error: "0 2px 8px rgba(239, 68, 68, 0.15)",
        "glow-primary": "0 0 20px rgba(45, 212, 196, 0.3)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.3)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },

      backdropBlur: {
        xs: "2px",
      },

      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        "colors-shadow": "color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow",
      },

      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
      },

      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for SplitKar specific utilities
    ({ addUtilities, theme }) => {
      const newUtilities = {
        // Balance indicator utilities
        ".balance-positive": {
          color: theme("colors.balance.positive"),
          backgroundColor: `${theme("colors.balance.positive")}10`,
        },
        ".balance-negative": {
          color: theme("colors.balance.negative"),
          backgroundColor: `${theme("colors.balance.negative")}10`,
        },
        ".balance-neutral": {
          color: theme("colors.balance.neutral"),
          backgroundColor: `${theme("colors.balance.neutral")}10`,
        },

        // Status indicator utilities
        ".status-pending": {
          color: theme("colors.settlement.pending"),
          backgroundColor: `${theme("colors.settlement.pending")}10`,
        },
        ".status-confirmed": {
          color: theme("colors.settlement.confirmed"),
          backgroundColor: `${theme("colors.settlement.confirmed")}10`,
        },
        ".status-rejected": {
          color: theme("colors.settlement.rejected"),
          backgroundColor: `${theme("colors.settlement.rejected")}10`,
        },

        // Glass morphism effect
        ".glass": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },

        // Scrollbar styling
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: `${theme("colors.gray.400")} ${theme("colors.gray.100")}`,
        },
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
        },
        ".scrollbar-thin::-webkit-scrollbar-track": {
          backgroundColor: theme("colors.gray.100"),
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          backgroundColor: theme("colors.gray.400"),
          borderRadius: "3px",
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme("colors.gray.500"),
        },
      }

      addUtilities(newUtilities)
    },
  ],
} satisfies Config

export default config
