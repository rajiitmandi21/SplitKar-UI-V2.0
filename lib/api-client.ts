import { buildApiUrl, getAuthHeaders } from "./config/api"

class ApiClient {
  private token: string | null = null

  constructor() {}

  setToken(token: string | null) {
    this.token = token
  }

  getToken() {
    return this.token
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
    const headers = getAuthHeaders(token)

    const response = await fetch(buildApiUrl(endpoint), {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "API request failed")
    }

    return response.json()
  }
}

export default ApiClient
