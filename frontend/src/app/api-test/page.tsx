"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface ApiResponse {
  status: number | null
  data: any | null
  responseTime: number | null
  error: string | null
}

const ApiTestPage = () => {
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    status: null,
    data: null,
    responseTime: null,
    error: null,
  })
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setApiResponse({ status: null, data: null, responseTime: null, error: null })
    const startTime = performance.now()

    try {
      const response = await fetch("/api/test")
      const endTime = performance.now()
      const responseTime = endTime - startTime

      const data = await response.json()

      setApiResponse({
        status: response.status,
        data: data,
        responseTime: responseTime,
        error: null,
      })
    } catch (error: any) {
      const endTime = performance.now()
      const responseTime = endTime - startTime
      setApiResponse({
        status: null,
        data: null,
        responseTime: responseTime,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">API Test Page</h1>
      <Button onClick={testApi} disabled={loading}>
        {loading ? "Loading..." : "Test API"}
      </Button>

      {apiResponse.status !== null && (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>API Response</CardTitle>
            <CardDescription>Details of the API response.</CardDescription>
          </CardHeader>
          <CardContent>
            {apiResponse.status !== null && (
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  {apiResponse.status >= 200 && apiResponse.status < 300 ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : apiResponse.status >= 400 && apiResponse.status < 500 ? (
                    <AlertTriangle className="text-yellow-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                  <p className="text-sm font-medium">Status Code:</p>
                  <Badge variant="secondary">{apiResponse.status}</Badge>
                </div>
              </div>
            )}

            {apiResponse.responseTime !== null && (
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="text-blue-500 h-5 w-5" />
                  <p className="text-sm font-medium">Response Time:</p>
                  <Badge variant="secondary">{apiResponse.responseTime.toFixed(2)} ms</Badge>
                </div>
              </div>
            )}

            {apiResponse.data && (
              <div className="mb-4">
                <p className="text-sm font-medium">Data:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(apiResponse.data, null, 2)}</pre>
              </div>
            )}

            {apiResponse.error && (
              <div className="mb-4">
                <p className="text-sm font-medium">Error:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm text-red-500">{apiResponse.error}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ApiTestPage
