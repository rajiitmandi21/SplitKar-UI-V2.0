import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2DD4C4",
          50: "#E6FFFE",
          100: "#CCFFFC",
          200: "#99FFF9",
          300: "#66FFF6",
          400: "#33FFF3",
          500: "#2DD4C4",
          600: "#24A99D",
          700: "#1B7F76",
          800: "#12544E",
          900: "#092A27",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
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
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          50: "#FFF0F0",
          100: "#FFE1E1",
          200: "#FFC3C3",
          300: "#FFA5A5",
          400: "#FF8787",
          500: "#FF6B6B",
          600: "#CC5656",
          700: "#994040",
          800: "#662B2B",
          900: "#331515",
          foreground: "hsl(var(--accent-foreground))",
        },
        orange: {
          DEFAULT: "#FF8E53",
          50: "#FFF4F0",
          100: "#FFE9E1",
          200: "#FFD3C3",
          300: "#FFBDA5",
          400: "#FFA787",
          500: "#FF8E53",
          600: "#CC7242",
          700: "#995632",
          800: "#663921",
          900: "#331D11",
        },
        teal: {
          DEFAULT: "#2DD4C4",
          50: "#E6FFFE",
          100: "#CCFFFC",
          200: "#99FFF9",
          300: "#66FFF6",
          400: "#33FFF3",
          500: "#2DD4C4",
          600: "#24A99D",
          700: "#1B7F76",
          800: "#12544E",
          900: "#092A27",
        },
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
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
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
        "bounce-gentle": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        shimmer: {
          "0%": {
            "background-position": "-200% 0",
          },
          "100%": {
            "background-position": "200% 0",
          },
        },
        "pulse-green": {
          "0%": {
            "box-shadow": "0 0 0 0 rgba(34, 197, 94, 0.7)",
          },
          "70%": {
            "box-shadow": "0 0 0 10px rgba(34, 197, 94, 0)",
          },
          "100%": {
            "box-shadow": "0 0 0 0 rgba(34, 197, 94, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "bounce-gentle": "bounce-gentle 2s infinite",
        shimmer: "shimmer 1.5s infinite",
        "pulse-green": "pulse-green 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "rangoli-pattern":
          "radial-gradient(circle at 25% 25%, #2DD4C4 2px, transparent 2px), radial-gradient(circle at 75% 75%, #FF6B6B 2px, transparent 2px)",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
