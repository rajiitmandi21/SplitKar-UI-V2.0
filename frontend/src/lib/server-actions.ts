"use server"

import { revalidatePath } from "next/cache"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY || "",
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

export async function register(data: FormData) {
  try {
    const res = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function login(data: FormData) {
  try {
    const res = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getProfile() {
  try {
    const res = await apiCall("/auth/profile", {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function verifyEmail(token: string) {
  try {
    const res = await apiCall(`/auth/verify?token=${token}`, {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function forgotPassword(data: FormData) {
  try {
    const res = await apiCall("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function resetPassword(data: FormData) {
  try {
    const res = await apiCall("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function createGroup(data: FormData) {
  try {
    const res = await apiCall("/groups", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getGroups() {
  try {
    const res = await apiCall("/groups", {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getGroup(groupId: string) {
  try {
    const res = await apiCall(`/groups/${groupId}`, {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function updateGroup(groupId: string, data: FormData) {
  try {
    const res = await apiCall(`/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const res = await apiCall(`/groups/${groupId}`, {
      method: "DELETE",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function addGroupMember(groupId: string, userId: string) {
  try {
    const res = await apiCall(`/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getGroupMembers(groupId: string) {
  try {
    const res = await apiCall(`/groups/${groupId}/members`, {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function deleteGroupMember(groupId: string, userId: string) {
  try {
    const res = await apiCall(`/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function getFriends() {
  try {
    const res = await apiCall("/friends", {
      method: "GET",
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function createExpense(data: FormData) {
  try {
    const res = await apiCall("/expenses", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(data)),
    })
    revalidatePath("/")
    return res
  } catch (e: any) {
    return { error: e.message }
  }
}
