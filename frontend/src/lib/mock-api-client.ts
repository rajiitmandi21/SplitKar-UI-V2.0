export class MockApiClient {
  private currentUser = {
    id: "mock-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    name: "Test User",
    phone: "123-456-7890",
    upi_id: "testuser@upi",
  }

  private mockToken = "mock-auth-token"

  private mockGroups = [
    {
      id: "mock-group-1",
      name: "Mock Group A",
      description: "This is mock group A",
      icon: "🤝",
      color: "#FF5733",
      currency: "USD",
      member_ids: ["mock-user-id", "mock-friend-1-id", "mock-friend-2-id"],
      members: [
        {
          id: "mock-user-id",
          name: "Test User",
          role: "admin",
        },
        {
          id: "mock-friend-1-id",
          name: "Mock Friend 1",
          role: "member",
        },
        {
          id: "mock-friend-2-id",
          name: "Mock Friend 2",
          role: "member",
        },
      ],
    },
    {
      id: "mock-group-2",
      name: "Mock Group B",
      description: "This is mock group B",
      icon: "✈️",
      color: "#33FF57",
      currency: "EUR",
      member_ids: ["mock-user-id"],
      members: [
        {
          id: "mock-user-id",
          name: "Test User",
          role: "admin",
        },
      ],
    },
  ]

  private mockExpenses = [
    {
      id: "mock-expense-1",
      description: "Mock Dinner",
      amount: 50.0,
      groupId: "mock-group-1",
      paidBy: "mock-user-id",
      participants: ["mock-user-id", "mock-friend-1-id"],
      date: new Date().toISOString(),
    },
    {
      id: "mock-expense-2",
      description: "Mock Transport",
      amount: 20.0,
      groupId: "mock-group-1",
      paidBy: "mock-friend-1-id",
      participants: ["mock-user-id", "mock-friend-1-id", "mock-friend-2-id"],
      date: new Date().toISOString(),
    },
  ]

  private mockFriends = [
    {
      id: "mock-friend-1-id",
      name: "Mock Friend 1",
      email: "friend1@example.com",
    },
    {
      id: "mock-friend-2-id",
      name: "Mock Friend 2",
      email: "friend2@example.com",
    },
  ]

  async register(userData: any) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock register", userData)
    return { message: "Mock registration successful", user: this.currentUser, token: this.mockToken }
  }

  async login(credentials: { email: string; password: string }) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock login", credentials)
    if (credentials.email === this.currentUser.email && credentials.password === "password") {
      return { message: "Mock login successful", user: this.currentUser, token: this.mockToken }
    } else {
      throw new Error("Invalid mock credentials")
    }
  }

  async getProfile() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock getProfile")
    return { user: this.currentUser }
  }

  async updateProfile(updates: any) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock updateProfile", updates)
    // In a real mock, you'd update currentUser
    this.currentUser = { ...this.currentUser, ...updates }
    return { message: "Mock profile update successful", user: this.currentUser }
  }

  async createGroup(groupData: any) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock createGroup", groupData)
    const newGroup = { ...groupData, id: `mock-group-${this.mockGroups.length + 1}`, members: [{ id: this.currentUser.id, name: this.currentUser.name, role: "admin" }] }
    this.mockGroups.push(newGroup as any) // Simplified type for mock
    return { message: "Mock group creation successful", group: newGroup }
  }

  async getUserGroups() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock getUserGroups")
    return { groups: this.mockGroups }
  }

  async getGroup(groupId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock getGroup", groupId)
    const group = this.mockGroups.find((g) => g.id === groupId)
    if (group) {
      return { group }
    } else {
      throw new Error("Mock group not found")
    }
  }

  async updateGroup(groupId: string, updates: any) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock updateGroup", groupId, updates)
    const groupIndex = this.mockGroups.findIndex((g) => g.id === groupId)
    if (groupIndex !== -1) {
      this.mockGroups[groupIndex] = { ...this.mockGroups[groupIndex], ...updates }
      return { message: "Mock group update successful", group: this.mockGroups[groupIndex] }
    } else {
      throw new Error("Mock group not found for update")
    }
  }

  async deleteGroup(groupId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock deleteGroup", groupId)
    const initialLength = this.mockGroups.length
    this.mockGroups = this.mockGroups.filter((g) => g.id !== groupId)
    if (this.mockGroups.length < initialLength) {
      return { message: "Mock group deletion successful" }
    } else {
      throw new Error("Mock group not found for deletion")
    }
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock addGroupMember", groupId, userId, role)
    const group = this.mockGroups.find((g) => g.id === groupId)
    if (group) {
      // In a real mock, you'd add a user object. Using ID for simplicity.
      if (!group.member_ids.includes(userId)) {
        group.member_ids.push(userId)
        group.members.push({ id: userId, name: `Mock User ${userId.slice(-4)}`, role }) // Simplified user mock
      }
      return { message: "Mock member added successfully", group }
    } else {
      throw new Error("Mock group not found for adding member")
    }
  }

  async removeGroupMember(groupId: string, userId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock removeGroupMember", groupId, userId)
    const group = this.mockGroups.find((g) => g.id === groupId)
    if (group) {
      group.member_ids = group.member_ids.filter((id) => id !== userId)
      group.members = group.members.filter((member) => member.id !== userId)
      return { message: "Mock member removed successfully", group }
    } else {
      throw new Error("Mock group not found for removing member")
    }
  }

  async getFriends() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock getFriends")
    return { friends: this.mockFriends }
  }

  async getExpenses(groupId?: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Mock getExpenses", groupId)
    if (groupId) {
      return { expenses: this.mockExpenses.filter(exp => exp.groupId === groupId) }
    } else {
      return { expenses: this.mockExpenses }
    }
  }

  async verifyEmail(token: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!token) {
      throw new Error("Invalid verification token")
    }

    // In mock mode, always succeed
    return {
      message: "Email verified successfully! Welcome to SplitKar!",
      user: this.currentUser,
      token: this.mockToken,
    }
  }

  async forgotPassword(email: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      message: "If an account with that email exists, we've sent a password reset link.",
    }
  }

  async resetPassword(token: string, password: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!token || !password) {
      throw new Error("Token and password are required")
    }

    return {
      message: "Password reset successfully. You can now login with your new password.",
    }
  }
}
