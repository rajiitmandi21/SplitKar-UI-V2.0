import mockUsers from "@/data/mock-users.json"
import mockGroups from "@/data/mock-groups.json"
import mockExpenses from "@/data/mock-expenses.json"
import mockFriends from "@/data/mock-friends.json"

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock storage for session data
let currentUser: any = null
let authToken: string | null = null

class MockApiClient {
  private baseUrl = "mock://api"

  setToken(token: string) {
    authToken = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    authToken = null
    currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async mockRequest<T>(operation: () => T): Promise<T> {
    await delay(Math.random() * 500 + 200) // Random delay 200-700ms

    if (!authToken && currentUser === null) {
      // Check if we have a stored token
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("auth_token")
        if (storedToken) {
          authToken = storedToken
          // Find user by token (in real app, this would be decoded from JWT)
          const userId = storedToken.replace("mock_token_", "")
          currentUser = mockUsers.users.find((u) => u.id === userId) || null
        }
      }
    }

    return operation()
  }

  private requireAuth() {
    if (!currentUser) {
      throw new Error("Authentication required")
    }
  }

  // Auth methods
  async register(userData: {
    email: string
    name: string
    password: string
    phone?: string
  }) {
    return this.mockRequest(() => {
      // Check if user already exists
      const existingUser = mockUsers.users.find((u) => u.email === userData.email)
      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=10B981&color=fff`,
        role: "user",
        is_verified: false,
        created_at: new Date().toISOString(),
        stats: {
          total_groups: 0,
          total_friends: 0,
          total_expenses: 0,
          net_balance: 0,
        },
      }

      // Add to mock data (in memory only)
      mockUsers.users.push(newUser)
      mockUsers.credentials.push({
        email: userData.email,
        password: userData.password,
      })

      currentUser = newUser
      const token = `mock_token_${newUser.id}`
      this.setToken(token)

      return {
        user: newUser,
        token,
        message: "Registration successful",
      }
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.mockRequest(() => {
      const userCreds = mockUsers.credentials.find((c) => c.email === credentials.email)
      if (!userCreds || userCreds.password !== credentials.password) {
        throw new Error("Invalid email or password")
      }

      const user = mockUsers.users.find((u) => u.email === credentials.email)
      if (!user) {
        throw new Error("User not found")
      }

      currentUser = user
      const token = `mock_token_${user.id}`
      this.setToken(token)

      return {
        user,
        token,
        message: "Login successful",
      }
    })
  }

  async getProfile() {
    return this.mockRequest(() => {
      this.requireAuth()
      return {
        user: currentUser,
        stats: currentUser.stats,
      }
    })
  }

  async updateProfile(updates: any) {
    return this.mockRequest(() => {
      this.requireAuth()

      // Update current user
      Object.assign(currentUser, updates)

      // Update in mock data
      const userIndex = mockUsers.users.findIndex((u) => u.id === currentUser.id)
      if (userIndex !== -1) {
        Object.assign(mockUsers.users[userIndex], updates)
      }

      return {
        user: currentUser,
        message: "Profile updated successfully",
      }
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
    return this.mockRequest(() => {
      this.requireAuth()

      const newGroup = {
        id: `group-${Date.now()}`,
        name: groupData.name,
        description: groupData.description || "",
        icon: groupData.icon || "👥",
        color: groupData.color || "#10B981",
        currency: groupData.currency || "USD",
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        member_count: 1 + (groupData.member_ids?.length || 0),
        total_expenses: 0,
        user_balance: 0,
        members: [
          {
            user_id: currentUser.id,
            role: "admin",
            joined_at: new Date().toISOString(),
          },
          ...(groupData.member_ids || []).map((userId) => ({
            user_id: userId,
            role: "member",
            joined_at: new Date().toISOString(),
          })),
        ],
      }

      mockGroups.groups.push(newGroup)

      // Update user stats
      currentUser.stats.total_groups += 1

      return {
        group: newGroup,
        message: "Group created successfully",
      }
    })
  }

  async getUserGroups() {
    return this.mockRequest(() => {
      this.requireAuth()

      const userGroups = mockGroups.groups.filter((group) =>
        group.members.some((member) => member.user_id === currentUser.id),
      )

      return {
        groups: userGroups,
      }
    })
  }

  async getGroup(groupId: string) {
    return this.mockRequest(() => {
      this.requireAuth()

      const group = mockGroups.groups.find((g) => g.id === groupId)
      if (!group) {
        throw new Error("Group not found")
      }

      // Check if user is a member
      const isMember = group.members.some((member) => member.user_id === currentUser.id)
      if (!isMember) {
        throw new Error("Access denied: You are not a member of this group")
      }

      // Get group expenses
      const groupExpenses = mockExpenses.expenses.filter((e) => e.group_id === groupId)

      // Get member details
      const membersWithDetails = group.members.map((member) => {
        const userDetails = mockUsers.users.find((u) => u.id === member.user_id)
        return {
          ...member,
          user_details: userDetails
            ? {
                id: userDetails.id,
                name: userDetails.name,
                email: userDetails.email,
                avatar_url: userDetails.avatar_url,
              }
            : null,
        }
      })

      return {
        group: {
          ...group,
          members: membersWithDetails,
        },
        expenses: groupExpenses,
      }
    })
  }

  async updateGroup(groupId: string, updates: any) {
    return this.mockRequest(() => {
      this.requireAuth()

      const groupIndex = mockGroups.groups.findIndex((g) => g.id === groupId)
      if (groupIndex === -1) {
        throw new Error("Group not found")
      }

      const group = mockGroups.groups[groupIndex]

      // Check if user is admin
      const userMembership = group.members.find((m) => m.user_id === currentUser.id)
      if (!userMembership || userMembership.role !== "admin") {
        throw new Error("Access denied: Admin privileges required")
      }

      // Update group
      Object.assign(mockGroups.groups[groupIndex], updates, {
        updated_at: new Date().toISOString(),
      })

      return {
        group: mockGroups.groups[groupIndex],
        message: "Group updated successfully",
      }
    })
  }

  async deleteGroup(groupId: string) {
    return this.mockRequest(() => {
      this.requireAuth()

      const groupIndex = mockGroups.groups.findIndex((g) => g.id === groupId)
      if (groupIndex === -1) {
        throw new Error("Group not found")
      }

      const group = mockGroups.groups[groupIndex]

      // Check if user is admin
      const userMembership = group.members.find((m) => m.user_id === currentUser.id)
      if (!userMembership || userMembership.role !== "admin") {
        throw new Error("Access denied: Admin privileges required")
      }

      // Remove group
      mockGroups.groups.splice(groupIndex, 1)

      // Update user stats
      currentUser.stats.total_groups -= 1

      return {
        message: "Group deleted successfully",
      }
    })
  }

  async addGroupMember(groupId: string, userId: string, role = "member") {
    return this.mockRequest(() => {
      this.requireAuth()

      const group = mockGroups.groups.find((g) => g.id === groupId)
      if (!group) {
        throw new Error("Group not found")
      }

      // Check if user is admin
      const userMembership = group.members.find((m) => m.user_id === currentUser.id)
      if (!userMembership || userMembership.role !== "admin") {
        throw new Error("Access denied: Admin privileges required")
      }

      // Check if user is already a member
      const existingMember = group.members.find((m) => m.user_id === userId)
      if (existingMember) {
        throw new Error("User is already a member of this group")
      }

      // Add member
      group.members.push({
        user_id: userId,
        role,
        joined_at: new Date().toISOString(),
      })

      group.member_count += 1
      group.updated_at = new Date().toISOString()

      return {
        message: "Member added successfully",
      }
    })
  }

  async removeGroupMember(groupId: string, userId: string) {
    return this.mockRequest(() => {
      this.requireAuth()

      const group = mockGroups.groups.find((g) => g.id === groupId)
      if (!group) {
        throw new Error("Group not found")
      }

      // Check if user is admin or removing themselves
      const userMembership = group.members.find((m) => m.user_id === currentUser.id)
      if (!userMembership || (userMembership.role !== "admin" && currentUser.id !== userId)) {
        throw new Error("Access denied: Admin privileges required or can only remove yourself")
      }

      // Remove member
      const memberIndex = group.members.findIndex((m) => m.user_id === userId)
      if (memberIndex === -1) {
        throw new Error("User is not a member of this group")
      }

      group.members.splice(memberIndex, 1)
      group.member_count -= 1
      group.updated_at = new Date().toISOString()

      return {
        message: "Member removed successfully",
      }
    })
  }

  // Friends methods
  async getFriends() {
    return this.mockRequest(() => {
      this.requireAuth()

      const userFriends = mockFriends.friends.filter((f) => f.user_id === currentUser.id)
      const pendingRequests = mockFriends.pending_requests.filter((r) => r.to_user_id === currentUser.id)

      return {
        friends: userFriends,
        pending_requests: pendingRequests,
      }
    })
  }

  // Expenses methods
  async getExpenses(groupId?: string) {
    return this.mockRequest(() => {
      this.requireAuth()

      let expenses = mockExpenses.expenses

      if (groupId) {
        // Check if user is member of the group
        const group = mockGroups.groups.find((g) => g.id === groupId)
        if (!group || !group.members.some((m) => m.user_id === currentUser.id)) {
          throw new Error("Access denied: You are not a member of this group")
        }
        expenses = expenses.filter((e) => e.group_id === groupId)
      } else {
        // Only return expenses from groups user is a member of
        const userGroupIds = mockGroups.groups
          .filter((g) => g.members.some((m) => m.user_id === currentUser.id))
          .map((g) => g.id)
        expenses = expenses.filter((e) => userGroupIds.includes(e.group_id))
      }

      return {
        expenses,
      }
    })
  }
}

export const mockApiClient = new MockApiClient()
