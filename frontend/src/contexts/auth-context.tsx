"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  role: string
  is_verified: boolean
  created_at: string
}

interface UserStats {
  total_groups: number
  total_friends: number
  total_expenses: number
  net_balance: number
}

interface AuthContextType {
  user: User | null
  stats: UserStats | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateProfile: (updates: any) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        apiClient.setToken(token)
        const response = await apiClient.getProfile()
        setUser(response.user)
        setStats(response.stats)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.user)
      await refreshProfile()
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData)
      setUser(response.user)
      await refreshProfile()
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
    setStats(null)
  }

  const updateProfile = async (updates: any) => {
    try {
      const response = await apiClient.updateProfile(updates)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile()
      setUser(response.user)
      setStats(response.stats)
    } catch (error) {
      console.error("Failed to refresh profile:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
