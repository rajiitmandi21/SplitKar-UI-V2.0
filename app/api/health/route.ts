import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const apiKey = process.env.API_KEY
    const mockMode = process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: {
        api_url: apiUrl ? "configured" : "missing",
        api_key: apiKey ? "configured" : "missing",
        mock_mode: mockMode === "true",
      },
      version: "1.0.0",
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
