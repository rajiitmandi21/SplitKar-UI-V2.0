import { buildApiUrl, getApiHeaders } from "./config/api"

class ApiClient {
  private token: string | null = null

  constructor() {}

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  getToken() {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  clearToken() {
    this.setToken(null)
  }

  async login(email: string, password: string) {
    const response = await this.post("auth/login", { email, password })
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async verifyEmail(token: string) {
    return this.post("auth/verify-email", { token })
  }

  async register(userData: any) {
    const response = await this.post("auth/register", userData)
    if (response.token) {
      this.setToken(response.token)
    }
    return response
  }

  async getProfile() {
    return this.get("auth/profile")
  }

  async updateProfile(updates: any) {
    return this.put("auth/profile", updates)
  }

  async getDashboardData() {
    return this.get("dashboard")
  }

  async get(endpoint: string) {
    return this.makeRequest(endpoint, { method: "GET" })
  }

  async post(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.makeRequest(endpoint, { method: "DELETE" })
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()
    const headers = getApiHeaders(!!token)
    const url = buildApiUrl(endpoint)

    console.log('🔍 API Request:', {
      url,
      method: options.method || 'GET',
      headers,
      body: options.body
    })

    try {
      const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

    if (!response.ok) {
      const error = await response.json()
        console.error('❌ API Error:', error)
      throw new Error(error.message || "API request failed")
    }

      const data = await response.json()
      console.log('✅ API Success:', data)
      return data
    } catch (error) {
      console.error('🚨 Network Error:', error)
      throw error
    }
  }
}

const apiClient = new ApiClient();
export { apiClient };
