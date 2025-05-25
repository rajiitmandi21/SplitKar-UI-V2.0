// API Debugging Utilities

export interface ApiDebugInfo {
  method: string
  url: string
  headers: HeadersInit
  body?: any
  response?: Response
  error?: Error
  duration: number
  timestamp: Date
}

class ApiDebugger {
  private static instance: ApiDebugger
  private debugMode = false
  private logs: ApiDebugInfo[] = []
  private maxLogs = 100

  private constructor() {
    // Check if debug mode is enabled
    if (typeof window !== "undefined") {
      this.debugMode = localStorage.getItem("API_DEBUG") === "true" || process.env.NODE_ENV === "development"
    }
  }

  static getInstance(): ApiDebugger {
    if (!ApiDebugger.instance) {
      ApiDebugger.instance = new ApiDebugger()
    }
    return ApiDebugger.instance
  }

  enableDebug() {
    this.debugMode = true
    if (typeof window !== "undefined") {
      localStorage.setItem("API_DEBUG", "true")
    }
    console.log("🐛 API Debugging Enabled")
  }

  disableDebug() {
    this.debugMode = false
    if (typeof window !== "undefined") {
      localStorage.removeItem("API_DEBUG")
    }
    console.log("🐛 API Debugging Disabled")
  }

  isDebugEnabled(): boolean {
    return this.debugMode
  }

  logRequest(info: Partial<ApiDebugInfo>) {
    if (!this.debugMode) return

    const logEntry: ApiDebugInfo = {
      method: info.method || "GET",
      url: info.url || "",
      headers: info.headers || {},
      body: info.body,
      response: info.response,
      error: info.error,
      duration: info.duration || 0,
      timestamp: info.timestamp || new Date(),
    }

    this.logs.unshift(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Console logging with styling
    const statusColor = info.response ? (info.response.ok ? "color: green" : "color: red") : "color: orange"

    console.group(`%c${info.method} %c${info.url}`, "font-weight: bold", statusColor)

    if (info.headers) {
      console.log("📋 Headers:", info.headers)
    }

    if (info.body) {
      console.log("📤 Request Body:", info.body)
    }

    if (info.response) {
      console.log(`📥 Response Status: ${info.response.status} ${info.response.statusText}`)
    }

    if (info.error) {
      console.error("❌ Error:", info.error)
    }

    console.log(`⏱️ Duration: ${info.duration}ms`)
    console.groupEnd()
  }

  getLogs(): ApiDebugInfo[] {
    return this.logs
  }

  clearLogs() {
    this.logs = []
    console.log("🧹 API Debug logs cleared")
  }

  // Helper to format headers for display
  formatHeaders(headers: HeadersInit): Record<string, string> {
    const formatted: Record<string, string> = {}

    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        formatted[key] = value
      })
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        formatted[key] = value
      })
    } else {
      Object.assign(formatted, headers)
    }

    return formatted
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Create a debug report
  generateReport(): string {
    const report = [
      "=== API Debug Report ===",
      `Generated: ${new Date().toISOString()}`,
      `Total Requests: ${this.logs.length}`,
      "",
      "Request Summary:",
      ...this.logs.map(
        (log, index) =>
          `${index + 1}. ${log.method} ${log.url} - ${
            log.response ? `${log.response.status}` : "Failed"
          } (${log.duration}ms)`,
      ),
      "",
      "Failed Requests:",
      ...this.logs
        .filter((log) => log.error || (log.response && !log.response.ok))
        .map(
          (log) => `- ${log.method} ${log.url}: ${log.error ? log.error.message : `Status ${log.response?.status}`}`,
        ),
    ]

    return report.join("\n")
  }
}

export const apiDebugger = ApiDebugger.getInstance()

// Browser console helpers
if (typeof window !== "undefined") {
  ;(window as any).apiDebug = {
    enable: () => apiDebugger.enableDebug(),
    disable: () => apiDebugger.disableDebug(),
    logs: () => apiDebugger.getLogs(),
    clear: () => apiDebugger.clearLogs(),
    report: () => console.log(apiDebugger.generateReport()),
    export: () => {
      const blob = new Blob([apiDebugger.exportLogs()], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `api-debug-${Date.now()}.json`
      a.click()
    },
  }

  console.log(
    "%c🐛 API Debugger Available",
    "color: blue; font-weight: bold",
    "\n\nUse these commands in console:\n" +
      "- apiDebug.enable()   : Enable debugging\n" +
      "- apiDebug.disable()  : Disable debugging\n" +
      "- apiDebug.logs()     : View all logs\n" +
      "- apiDebug.clear()    : Clear logs\n" +
      "- apiDebug.report()   : Generate report\n" +
      "- apiDebug.export()   : Download logs as JSON",
  )
}
