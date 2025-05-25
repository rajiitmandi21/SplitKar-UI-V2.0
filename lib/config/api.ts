// Shared API configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  // API Key for authentication
  API_KEY: process.env.API_KEY || "",

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
}

// Helper to build full API URL
export function buildApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`
}

// Helper to get auth headers
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    ...API_CONFIG.DEFAULT_HEADERS,
    "X-API-Key": API_CONFIG.API_KEY,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}
