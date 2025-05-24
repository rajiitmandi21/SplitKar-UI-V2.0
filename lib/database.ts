// Simple database connection utility for Next.js
let pool: any = null

export async function getDbConnection() {
  // Only create connection on server side
  if (typeof window !== "undefined") {
    throw new Error("Database connections should only be made on the server side")
  }

  if (!pool) {
    // Dynamic import to avoid bundling pg in client
    const { Pool } = await import("pg")

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required")
    }

    // Parse DATABASE_URL
    const url = new URL(databaseUrl)

    pool = new Pool({
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: Number(url.port) || 5432,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: url.searchParams.get("sslmode") === "require" ? { rejectUnauthorized: false } : false,
    })

    // Test connection
    try {
      await pool.query("SELECT NOW()")
      console.log("Database connected successfully")
    } catch (error) {
      console.error("Database connection failed:", error)
      throw error
    }
  }

  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = await getDbConnection()
  const result = await pool.query(text, params)
  return result
}

export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = await getDbConnection()
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
