"use server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const API_KEY = process.env.API_KEY

async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY || "",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || data.error || "API request failed" }
    }

    return data
  } catch (error) {
    console.error("Server action API error:", error)
    return { error: "Network error occurred" }
  }
}

export async function registerUser(userData: {
  email: string
  name: string
  password: string
  phone?: string
  upi_id?: string
}) {
  return makeApiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function loginUser(credentials: { email: string; password: string }) {
  return makeApiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function getUserProfile(token: string) {
  return makeApiRequest("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateUserProfile(token: string, updates: any) {
  return makeApiRequest("/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })
}

export async function createGroup(token: string, groupData: any) {
  return makeApiRequest("/groups", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(groupData),
  })
}

export async function getUserGroups(token: string) {
  return makeApiRequest("/groups", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getGroup(token: string, groupId: string) {
  return makeApiRequest(`/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateGroup(token: string, groupId: string, updates: any) {
  return makeApiRequest(`/groups/${groupId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })
}

export async function deleteGroup(token: string, groupId: string) {
  return makeApiRequest(`/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function addGroupMember(token: string, groupId: string, userId: string, role: string) {
  return makeApiRequest(`/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, role }),
  })
}

export async function removeGroupMember(token: string, groupId: string, userId: string) {
  return makeApiRequest(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getFriends(token: string) {
  return makeApiRequest("/friends", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getExpenses(token: string, groupId?: string) {
  const endpoint = groupId ? `/expenses?group_id=${groupId}` : "/expenses"
  return makeApiRequest(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function verifyEmail(token: string) {
  return makeApiRequest("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  })
}

export async function forgotPassword(email: string) {
  return makeApiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, password: string) {
  return makeApiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  })
}
