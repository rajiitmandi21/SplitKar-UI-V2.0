import { mockApiClient } from "./mock-api-client"

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class RealApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") {
    this.baseUrl = baseUrl
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          window.location.href = "/auth/login"
        }
        throw new Error(data.message || data.error || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // Auth methods
  async register(userData: {
    email: string
    name: string
    password: string
    phone?: string
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async getProfile() {
    return this.request("/auth/profile")
  }

  async updateProfile(updates: any) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
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
    return this.request("/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    })
  }

  async getUserGroups() {
    return this.request("/groups")
  }

  async getGroup(groupId: string) {
    return this.request(`/groups/${groupId}`)
  }

  async updateGroup(groupId: string, updates: any) {
    return this.request(`/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteGroup(groupId: string) {
    return this.request(`/groups/${groupId}`, {
      method: "DELETE",
    })
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    return this.request(`/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, role }),
    })
  }

  async removeGroupMember(groupId: string, userId: string) {
    return this.request(`/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    })
  }

  // Friends methods
  async getFriends() {
    return this.request("/friends")
  }

  // Expenses methods
  async getExpenses(groupId?: string) {
    const endpoint = groupId ? `/expenses?group_id=${groupId}` : "/expenses"
    return this.request(endpoint)
  }
}

// Factory function to get the appropriate API client
function createApiClient() {
  const useMockData = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"

  if (useMockData) {
    console.log("🎭 Using Mock API Client for frontend testing")
    return mockApiClient
  } else {
    console.log("🌐 Using Real API Client")
    return new RealApiClient()
  }
}

export const apiClient = createApiClient()
