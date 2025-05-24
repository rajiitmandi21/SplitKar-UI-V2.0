// Client-side API service
class ApiClient {
  private baseUrl = "/api"

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // User methods
  async getUser(id: string) {
    return this.request(`/users?id=${id}`)
  }

  async createUser(userData: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Group methods
  async getUserGroups(userId: string) {
    return this.request(`/groups?userId=${userId}`)
  }

  async createGroup(groupData: any) {
    return this.request("/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    })
  }

  // Expense methods
  async getGroupExpenses(groupId: string) {
    return this.request(`/expenses?groupId=${groupId}`)
  }

  async getUserExpenses(userId: string) {
    return this.request(`/expenses?userId=${userId}`)
  }

  async createExpense(expenseData: any) {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify(expenseData),
    })
  }

  // Dashboard data
  async getDashboardData(userId: string) {
    try {
      const [groupsResponse, expensesResponse] = await Promise.all([
        this.getUserGroups(userId),
        this.getUserExpenses(userId),
      ])

      return {
        groups: groupsResponse.groups || [],
        expenses: expensesResponse.expenses || [],
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      return { groups: [], expenses: [] }
    }
  }
}

export const apiClient = new ApiClient()
