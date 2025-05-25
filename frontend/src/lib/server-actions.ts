"use server"

import { redirect } from "next/navigation"

// Mock API base URL - replace with actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "API call failed")
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
    const response = await apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Registration failed" }
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" }
  }
}

export async function getUserProfile(token: string) {
  try {
    const response = await apiCall("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to get profile" }
  }
}

export async function updateUserProfile(token: string, updates: any) {
  try {
    const response = await apiCall("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

export async function verifyEmail(token: string) {
  try {
    const response = await apiCall("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Email verification failed" }
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await apiCall("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Password reset request failed" }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const response = await apiCall("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Password reset failed" }
  }
}

// Group actions
export async function createGroup(token: string, groupData: any) {
  try {
    const response = await apiCall("/api/groups", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create group" }
  }
}

export async function getUserGroups(token: string) {
  try {
    const response = await apiCall("/api/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to get groups" }
  }
}

export async function getGroup(token: string, groupId: string) {
  try {
    const response = await apiCall(`/api/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to get group" }
  }
}

export async function updateGroup(token: string, groupId: string, updates: any) {
  try {
    const response = await apiCall(`/api/groups/${groupId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update group" }
  }
}

export async function deleteGroup(token: string, groupId: string) {
  try {
    const response = await apiCall(`/api/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete group" }
  }
}

export async function addGroupMember(token: string, groupId: string, userId: string, role = "member") {
  try {
    const response = await apiCall(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, role }),
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to add group member" }
  }
}

export async function removeGroupMember(token: string, groupId: string, userId: string) {
  try {
    const response = await apiCall(`/api/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to remove group member" }
  }
}

// Friends actions
export async function getFriends(token: string) {
  try {
    const response = await apiCall("/api/friends", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to get friends" }
  }
}

// Expenses actions
export async function getExpenses(token: string, groupId?: string) {
  try {
    const endpoint = groupId ? `/api/expenses?groupId=${groupId}` : "/api/expenses"
    const response = await apiCall(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to get expenses" }
  }
}

// Form actions for Next.js forms
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = await loginUser({ email, password })

  if (result.error) {
    throw new Error(result.error)
  }

  redirect("/dashboard")
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const upi_id = formData.get("upi_id") as string

  const result = await registerUser({ name, email, password, phone, upi_id })

  if (result.error) {
    throw new Error(result.error)
  }

  redirect("/onboarding")
}

export async function createGroupAction(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // This would need the auth token in a real implementation
  // For now, just redirect
  if (name) {
    redirect("/groups")
  }

  throw new Error("Failed to create group")
}

export async function addExpenseAction(formData: FormData) {
  const title = formData.get("title") as string
  const amount = formData.get("amount") as string
  const groupId = formData.get("groupId") as string

  // This would need the auth token in a real implementation
  // For now, just redirect
  if (title && amount && groupId) {
    redirect("/dashboard")
  }

  throw new Error("Failed to add expense")
}
