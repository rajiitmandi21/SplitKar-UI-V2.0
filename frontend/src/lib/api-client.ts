import { mockApiClient } from "./mock-api-client"
import * as serverActions from "./server-actions"

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class RealApiClient {
  private token: string | null = null

  constructor() {
    this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private handleResponse(response: any) {
    if (response.error) {
      if (response.error.includes("Unauthorized") || response.error.includes("Invalid token")) {
        this.clearToken()
        window.location.href = "/auth/login"
      }
      throw new Error(response.error)
    }
    return response
  }

  // Auth methods
  async register(userData: {
    email: string
    name: string
    password: string
    phone?: string
    upi_id?: string
  }) {
    const response = await serverActions.registerUser(userData)
    return this.handleResponse(response)
  }

  async login(credentials: { email: string; password: string }) {
    const response = await serverActions.loginUser(credentials)

    if (response.token) {
      this.setToken(response.token)
    }

    return this.handleResponse(response)
  }

  async getProfile() {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.getUserProfile(this.token)
    return this.handleResponse(response)
  }

  async updateProfile(updates: any) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.updateUserProfile(this.token, updates)
    return this.handleResponse(response)
  }

  // Group methods
  async createGroup(groupData: {
    name: string
    description?: string
    icon?: string
    color?: string
    currency?: string
    member_ids?: string[]
  }) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.createGroup(this.token, groupData)
    return this.handleResponse(response)
  }

  async getUserGroups() {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.getUserGroups(this.token)
    return this.handleResponse(response)
  }

  async getGroup(groupId: string) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.getGroup(this.token, groupId)
    return this.handleResponse(response)
  }

  async updateGroup(groupId: string, updates: any) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.updateGroup(this.token, groupId, updates)
    return this.handleResponse(response)
  }

  async deleteGroup(groupId: string) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.deleteGroup(this.token, groupId)
    return this.handleResponse(response)
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.addGroupMember(this.token, groupId, userId, role)
    return this.handleResponse(response)
  }

  async removeGroupMember(groupId: string, userId: string) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.removeGroupMember(this.token, groupId, userId)
    return this.handleResponse(response)
  }

  // Friends methods
  async getFriends() {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.getFriends(this.token)
    return this.handleResponse(response)
  }

  // Expenses methods
  async getExpenses(groupId?: string) {
    if (!this.token) {
      throw new Error("No authentication token")
    }
    const response = await serverActions.getExpenses(this.token, groupId)
    return this.handleResponse(response)
  }

  // Email verification methods
  async verifyEmail(token: string) {
    const response = await serverActions.verifyEmail(token)
    return this.handleResponse(response)
  }

  async forgotPassword(email: string) {
    const response = await serverActions.forgotPassword(email)
    return this.handleResponse(response)
  }

  async resetPassword(token: string, password: string) {
    const response = await serverActions.resetPassword(token, password)
    return this.handleResponse(response)
  }
}

// Factory function to get the appropriate API client
function createApiClient() {
  const useMockData = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  if (useMockData) {
    console.log("🎭 Using Mock API Client for frontend testing")
    return mockApiClient
  } else {
    console.log("🌐 Using Real API Client with Server Actions")
    return new RealApiClient()
  }
}

export const apiClient = createApiClient()
