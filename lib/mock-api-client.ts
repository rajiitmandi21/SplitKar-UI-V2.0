import mockUsers from "../data/mock-users.json"
import mockGroups from "../data/mock-groups.json"
import mockExpenses from "../data/mock-expenses.json"
import mockFriends from "../data/mock-friends.json"

class MockApiClient {
  private token: string | null = null
  private currentUser: any = null

  constructor() {
    this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (this.token) {
      // Find user by token (in mock, token is just user ID)
      this.currentUser = mockUsers.find((user) => user.id === this.token)
    }
  }

  setToken(token: string) {
    this.token = token
    this.currentUser = mockUsers.find((user) => user.id === token)
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private requireAuth() {
    if (!this.token || !this.currentUser) {
      throw new Error("Authentication required")
    }
  }

  // Auth methods
  async register(userData: {
    email: string
    name: string
    password: string
    phone?: string
    upi_id?: string
  }) {
    await this.delay()

    // Check if email already exists
    const existingUser = mockUsers.find((user) => user.email === userData.email)
    if (existingUser) {
      throw new Error("Email already registered")
    }

    // Check if UPI ID already exists
    if (userData.upi_id) {
      const existingUpi = mockUsers.find((user) => user.upi_id === userData.upi_id)
      if (existingUpi) {
        throw new Error("UPI ID already registered")
      }
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      upi_id: userData.upi_id || null,
      avatar: null,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // In mock mode, auto-verify and login
    newUser.is_verified = true
    this.setToken(newUser.id)

    return {
      message: "Registration successful",
      user: newUser,
      token: newUser.id,
    }
  }

  async login(credentials: { email: string; password: string }) {
    await this.delay()

    const user = mockUsers.find((u) => u.email === credentials.email)
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // In mock mode, any password works for demo accounts
    this.setToken(user.id)

    return {
      message: "Login successful",
      user,
      token: user.id,
    }
  }

  async getProfile() {
    await this.delay()
    this.requireAuth()
    return { user: this.currentUser }
  }

  async updateProfile(updates: any) {
    await this.delay()
    this.requireAuth()

    // Check UPI ID uniqueness if being updated
    if (updates.upi_id && updates.upi_id !== this.currentUser.upi_id) {
      const existingUpi = mockUsers.find((user) => user.upi_id === updates.upi_id && user.id !== this.currentUser.id)
      if (existingUpi) {
        throw new Error("UPI ID already in use")
      }
    }

    // Update current user
    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return {
      message: "Profile updated successfully",
      user: this.currentUser,
    }
  }

  // Group methods
  async createGroup(groupData: any) {
    await this.delay()
    this.requireAuth()

    const newGroup = {
      id: `group_${Date.now()}`,
      name: groupData.name,
      description: groupData.description || null,
      icon: groupData.icon || "👥",
      color: groupData.color || "#3B82F6",
      currency: groupData.currency || "₹",
      created_by: this.currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      members: [
        {
          user_id: this.currentUser.id,
          role: "admin",
          joined_at: new Date().toISOString(),
        },
      ],
    }

    return {
      message: "Group created successfully",
      group: newGroup,
    }
  }

  async getUserGroups() {
    await this.delay()
    this.requireAuth()

    // Filter groups where user is a member
    const userGroups = mockGroups.filter((group) =>
      group.members.some((member) => member.user_id === this.currentUser.id),
    )

    return { groups: userGroups }
  }

  async getGroup(groupId: string) {
    await this.delay()
    this.requireAuth()

    const group = mockGroups.find((g) => g.id === groupId)
    if (!group) {
      throw new Error("Group not found")
    }

    // Check if user is a member
    const isMember = group.members.some((member) => member.user_id === this.currentUser.id)
    if (!isMember) {
      throw new Error("Access denied")
    }

    return { group }
  }

  async updateGroup(groupId: string, updates: any) {
    await this.delay()
    this.requireAuth()

    const group = mockGroups.find((g) => g.id === groupId)
    if (!group) {
      throw new Error("Group not found")
    }

    // Check if user is admin
    const userMembership = group.members.find((member) => member.user_id === this.currentUser.id)
    if (!userMembership || userMembership.role !== "admin") {
      throw new Error("Admin access required")
    }

    return {
      message: "Group updated successfully",
      group: { ...group, ...updates, updated_at: new Date().toISOString() },
    }
  }

  async deleteGroup(groupId: string) {
    await this.delay()
    this.requireAuth()

    const group = mockGroups.find((g) => g.id === groupId)
    if (!group) {
      throw new Error("Group not found")
    }

    // Check if user is admin
    const userMembership = group.members.find((member) => member.user_id === this.currentUser.id)
    if (!userMembership || userMembership.role !== "admin") {
      throw new Error("Admin access required")
    }

    return { message: "Group deleted successfully" }
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    await this.delay()
    this.requireAuth()

    return {
      message: "Member added successfully",
      member: {
        user_id: userId,
        role,
        joined_at: new Date().toISOString(),
      },
    }
  }

  async removeGroupMember(groupId: string, userId: string) {
    await this.delay()
    this.requireAuth()

    return { message: "Member removed successfully" }
  }

  // Friends methods
  async getFriends() {
    await this.delay()
    this.requireAuth()

    // Filter friends for current user
    const userFriends = mockFriends.filter(
      (friendship) => friendship.user_id === this.currentUser.id || friendship.friend_id === this.currentUser.id,
    )

    return { friends: userFriends }
  }

  // Expenses methods
  async getExpenses(groupId?: string) {
    await this.delay()
    this.requireAuth()

    let expenses = mockExpenses

    if (groupId) {
      expenses = expenses.filter((expense) => expense.group_id === groupId)
    }

    // Filter expenses where user is involved
    const userExpenses = expenses.filter(
      (expense) =>
        expense.paid_by === this.currentUser.id ||
        expense.splits.some((split) => split.user_id === this.currentUser.id),
    )

    return { expenses: userExpenses }
  }

  // Email verification methods
  async verifyEmail(token: string) {
    await this.delay()
    return { message: "Email verified successfully" }
  }

  async forgotPassword(email: string) {
    await this.delay()
    return { message: "Password reset email sent" }
  }

  async resetPassword(token: string, password: string) {
    await this.delay()
    return { message: "Password reset successfully" }
  }
}

export const mockApiClient = new MockApiClient()
