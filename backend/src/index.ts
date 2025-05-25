import dotenv from "dotenv"
dotenv.config()

import { startServer } from "./server"

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
