// Shared API configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",

  // API Key for authentication
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || "dev-api-key-123",

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry attempts
  RETRY_ATTEMPTS: 3,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
}

// Helper to build full API URL
export function buildApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, "") // Remove trailing slashes
  const cleanEndpoint = endpoint.replace(/^\/+/, "") // Remove leading slashes
  const finalUrl = `${baseUrl}/${cleanEndpoint}`
  console.log('🔗 Building API URL:', { baseUrl, cleanEndpoint, finalUrl, configBaseUrl: API_CONFIG.BASE_URL })
  return finalUrl
}

// Helper to get auth headers
export function getApiHeaders(includeAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Add API key if available
  if (API_CONFIG.API_KEY) {
    headers["X-API-Key"] = API_CONFIG.API_KEY
  }

  // Add auth token if available and requested
  if (includeAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// Helper function to check if we're in mock mode
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true"
}

// Health check function
export async function checkApiHealth(): Promise<{ healthy: boolean; message: string }> {
  try {
    const response = await fetch(buildApiUrl("../health"), {
      method: "GET",
      headers: getApiHeaders(false),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        healthy: true,
        message: `API is healthy (Port: ${data.port || "unknown"})`,
      }
    } else {
      return {
        healthy: false,
        message: `API returned status ${response.status}`,
      }
    }
  } catch (error) {
    return {
      healthy: false,
      message: `Failed to connect to API: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
