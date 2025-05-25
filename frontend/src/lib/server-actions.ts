"use server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

// Helper function to make API requests
async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Add API key if available
  if (process.env.API_KEY) {
    defaultHeaders["X-API-Key"] = process.env.API_KEY
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth actions
export async function registerUser(userData: {
  email: string
  name: string
  password: string
  phone?: string
  upi_id?: string
}) {
  try {
    return await makeApiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    return await makeApiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

export async function getUserProfile(token: string) {
  try {
    return await makeApiRequest("/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get profile",
    }
  }
}

export async function updateUserProfile(token: string, updates: any) {
  try {
    return await makeApiRequest("/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

// Group actions
export async function createGroup(token: string, groupData: any) {
  try {
    return await makeApiRequest("/groups", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create group",
    }
  }
}

export async function getUserGroups(token: string) {
  try {
    return await makeApiRequest("/groups", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get groups",
    }
  }
}

export async function getGroup(token: string, groupId: string) {
  try {
    return await makeApiRequest(`/groups/${groupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get group",
    }
  }
}

export async function updateGroup(token: string, groupId: string, updates: any) {
  try {
    return await makeApiRequest(`/groups/${groupId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update group",
    }
  }
}

export async function deleteGroup(token: string, groupId: string) {
  try {
    return await makeApiRequest(`/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete group",
    }
  }
}

export async function addGroupMember(token: string, groupId: string, userId: string, role = "member") {
  try {
    return await makeApiRequest(`/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId, role }),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add member",
    }
  }
}

export async function removeGroupMember(token: string, groupId: string, userId: string) {
  try {
    return await makeApiRequest(`/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to remove member",
    }
  }
}

// Other actions
export async function getFriends(token: string) {
  try {
    return await makeApiRequest("/friends", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get friends",
    }
  }
}

export async function getExpenses(token: string, groupId?: string) {
  try {
    const endpoint = groupId ? `/expenses?group_id=${groupId}` : "/expenses"
    return await makeApiRequest(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get expenses",
    }
  }
}

export async function verifyEmail(token: string) {
  try {
    return await makeApiRequest(`/auth/verify?token=${token}`, {
      method: "GET",
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Email verification failed",
    }
  }
}

export async function forgotPassword(email: string) {
  try {
    return await makeApiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to send reset email",
    }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    return await makeApiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Password reset failed",
    }
  }
}
