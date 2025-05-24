import { Pool } from "pg"

// Parse DATABASE_URL environment variable
function parsePostgresUrl(url: string) {
  const match = url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/)
  if (!match) {
    throw new Error("Invalid DATABASE_URL format")
  }

  const [, user, password, host, port, database, params] = match
  const config = {
    user,
    password,
    host,
    port: Number.parseInt(port),
    database,
    ssl: params?.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
  }

  return config
}

// Create connection pool
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required")
}

const config = parsePostgresUrl(databaseUrl)
export const pool = new Pool(config)

// Test connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database")
})

pool.on("error", (err) => {
  console.error("Database connection error:", err)
})

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Database initialization
export async function initializeDatabase() {
  try {
    // Test connection
    await query("SELECT NOW()")
    console.log("Database connection successful")

    // You can add schema creation here if needed
    // const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'db/schema.sql'), 'utf8')
    // await query(schemaSQL)

    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}

// Close pool (for cleanup)
export async function closeDatabase() {
  await pool.end()
}
