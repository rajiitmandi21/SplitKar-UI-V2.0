import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Basic health check for frontend
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        frontend: "running",
        api: process.env.NEXT_PUBLIC_API_URL ? "configured" : "not_configured",
        mock_data: process.env.NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND === "true" ? "enabled" : "disabled",
      },
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      },
      { status: 503 },
    )
  }
}
