import express from "express"
import cors from "cors"
import { connectToDatabase } from "./services/database.service"
import { itemsRouter } from "./routes/items.router"
import groupRoutes from "./routes/groups"
import userRoutes from "./routes/users"
import authRoutes from "./routes/auth"
import testRoutes from "./routes/test"

const app = express()
const port = 8080

app.use(cors())
app.use(express.json())

connectToDatabase()
  .then(() => {
    app.use("/api/items", itemsRouter)
    app.use("/api/groups", groupRoutes)
    app.use("/api/users", userRoutes)
    app.use("/api/auth", authRoutes)
    app.use("/api/test", testRoutes)

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`)
    })
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error)
    process.exit(1)
  })
