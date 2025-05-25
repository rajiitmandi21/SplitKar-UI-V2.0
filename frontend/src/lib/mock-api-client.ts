// Mock API client for development/testing
interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  role: string
  is_verified: boolean
  created_at: string
  stats: {
    total_groups: number
    total_friends: number
    total_expenses: number
    net_balance: number
  }
}

interface Group {
  id: string
  name: string
  description: string
  member_count: number
  total_expenses: number
  user_balance: number
  created_at: string
}

class MockApiClient {
  private token: string | null = null
  private currentUser: User | null = null

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

  clearToken() {
    this.setToken(null)
  }

  // Simulate API delay
  private async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Mock user data
  private getMockUser(email: string): User {
    return {
      id: "mock-user-" + Math.random().toString(36).substr(2, 9),
      email,
      name: email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      phone: "+1234567890",
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
      stats: {
        total_groups: 2,
        total_friends: 5,
        total_expenses: 12,
        net_balance: 150.75,
      },
    }
  }

  async register(userData: {
    email: string
    name: string
    password: string
    phone?: string
    upi_id?: string
  }) {
    await this.delay()

    console.log("📧 Mock Email: Registration verification email sent to", userData.email)

    const user = this.getMockUser(userData.email)
    this.currentUser = user
    this.setToken("mock-token-" + user.id)

    return {
      user,
      token: this.token,
      message: "Registration successful! Check your email for verification.",
    }
  }

  async login(credentials: { email: string; password: string }) {
    await this.delay()

    const user = this.getMockUser(credentials.email)
    this.currentUser = user
    this.setToken("mock-token-" + user.id)

    return {
      user,
      token: this.token,
      message: "Login successful!",
    }
  }

  async getProfile() {
    await this.delay()

    if (!this.token) {
      throw new Error("No authentication token")
    }

    if (!this.currentUser) {
      this.currentUser = this.getMockUser("demo@example.com")
    }

    return {
      user: this.currentUser,
      stats: this.currentUser.stats,
    }
  }

  async updateProfile(updates: any) {
    await this.delay()

    if (!this.currentUser) {
      throw new Error("No user logged in")
    }

    this.currentUser = { ...this.currentUser, ...updates }

    return {
      user: this.currentUser,
      message: "Profile updated successfully",
    }
  }

  async getUserGroups() {
    await this.delay()

    const mockGroups: Group[] = [
      {
        id: "group-1",
        name: "College Friends",
        description: "Our college group expenses",
        member_count: 4,
        total_expenses: 1250.5,
        user_balance: 75.25,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "group-2",
        name: "Roommates",
        description: "Apartment shared expenses",
        member_count: 3,
        total_expenses: 850.75,
        user_balance: -45.5,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    return {
      groups: mockGroups,
      message: "Groups retrieved successfully",
    }
  }

  async createGroup(groupData: any) {
    await this.delay()

    const newGroup: Group = {
      id: "group-" + Math.random().toString(36).substr(2, 9),
      name: groupData.name,
      description: groupData.description || "",
      member_count: 1,
      total_expenses: 0,
      user_balance: 0,
      created_at: new Date().toISOString(),
    }

    return {
      group: newGroup,
      message: "Group created successfully",
    }
  }

  async getGroup(groupId: string) {
    await this.delay()

    return {
      group: {
        id: groupId,
        name: "Mock Group",
        description: "A mock group for testing",
        member_count: 3,
        total_expenses: 500,
        user_balance: 25,
        created_at: new Date().toISOString(),
      },
    }
  }

  async updateGroup(groupId: string, updates: any) {
    await this.delay()
    return { message: "Group updated successfully" }
  }

  async deleteGroup(groupId: string) {
    await this.delay()
    return { message: "Group deleted successfully" }
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    await this.delay()
    return { message: "Member added successfully" }
  }

  async removeGroupMember(groupId: string, userId: string) {
    await this.delay()
    return { message: "Member removed successfully" }
  }

  async getFriends() {
    await this.delay()

    return {
      friends: [
        {
          id: "friend-1",
          name: "John Doe",
          email: "john@example.com",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          status: "accepted",
        },
      ],
    }
  }

  async getExpenses(groupId?: string) {
    await this.delay()

    return {
      expenses: [
        {
          id: "expense-1",
          title: "Dinner at Restaurant",
          amount: 120.5,
          category: "food",
          date: new Date().toISOString(),
          created_by: "user-1",
        },
      ],
    }
  }

  async verifyEmail(token: string) {
    await this.delay()

    console.log("📧 Mock Email: Email verification completed for token:", token)

    return {
      message: "Email verified successfully!",
      verified: true,
    }
  }

  async forgotPassword(email: string) {
    await this.delay()

    console.log("📧 Mock Email: Password reset email sent to", email)

    return {
      message: "Password reset email sent! Check your inbox.",
    }
  }

  async resetPassword(token: string, password: string) {
    await this.delay()

    return {
      message: "Password reset successfully!",
    }
  }
}

export const mockApiClient = new MockApiClient()
