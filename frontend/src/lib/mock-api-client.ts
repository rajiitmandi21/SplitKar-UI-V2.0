export class MockApiClient {
  private currentUser = {
    id: "mock-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
  }
  private mockToken = "mock-auth-token"

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
