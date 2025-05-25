"use server"

import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Mock authentication - replace with actual API call
  if (email && password) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    redirect("/dashboard")
  }

  throw new Error("Invalid credentials")
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Mock registration - replace with actual API call
  if (name && email && password) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful registration
    redirect("/onboarding")
  }

  throw new Error("Registration failed")
}

export async function createGroupAction(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // Mock group creation - replace with actual API call
  if (name) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful group creation
    redirect("/groups")
  }

  throw new Error("Failed to create group")
}

export async function addExpenseAction(formData: FormData) {
  const title = formData.get("title") as string
  const amount = formData.get("amount") as string
  const groupId = formData.get("groupId") as string

  // Mock expense creation - replace with actual API call
  if (title && amount && groupId) {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful expense creation
    redirect("/dashboard")
  }

  throw new Error("Failed to add expense")
}
