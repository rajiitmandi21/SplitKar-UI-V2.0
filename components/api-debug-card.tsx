"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Terminal, Bug, Network, AlertCircle } from "lucide-react"

export function ApiDebugCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          Quick API Debugging Reference
        </CardTitle>
        <CardDescription>Essential commands and tips for debugging API issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Console Commands */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Browser Console Commands
          </h3>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm space-y-1">
            <div className="text-green-400"># Enable API debugging</div>
            <div>apiDebug.enable()</div>
            <div className="text-green-400 mt-2"># View recent API calls</div>
            <div>apiDebug.logs()</div>
            <div className="text-green-400 mt-2"># Generate debug report</div>
            <div>apiDebug.report()</div>
            <div className="text-green-400 mt-2"># Export logs to file</div>
            <div>apiDebug.export()</div>
          </div>
        </div>

        {/* Network Tab Checklist */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Network className="w-4 h-4" />
            Network Tab Checklist
          </h3>
          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Open DevTools (F12) before making requests</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Go to Network tab</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Enable "Preserve log" checkbox</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Filter by "Fetch/XHR"</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Look for red entries (failed requests)</span>
            </label>
          </div>
        </div>

        {/* Status Codes */}
        <div className="space-y-2">
          <h3 className="font-semibold">Common Status Codes</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100">
                200
              </Badge>
              <span>Success</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100">
                201
              </Badge>
              <span>Created</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100">
                400
              </Badge>
              <span>Bad Request</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100">
                401
              </Badge>
              <span>Unauthorized</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100">
                404
              </Badge>
              <span>Not Found</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100">
                500
              </Badge>
              <span>Server Error</span>
            </div>
          </div>
        </div>

        {/* Quick Fixes */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Fix:</strong> If you see "Failed to fetch", check if your backend is running on port 5000
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
