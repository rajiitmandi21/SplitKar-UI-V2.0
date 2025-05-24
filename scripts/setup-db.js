// Database setup script
const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  // Check if DATABASE_URL is provided
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required")
    console.log("Format: postgres://user:password@host:port/database?sslmode=require")
    process.exit(1)
  }

  console.log("🔧 Setting up SplitKar database...")

  try {
    // Parse DATABASE_URL
    const url = process.env.DATABASE_URL
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

    // Create connection pool
    const pool = new Pool(config)

    // Test connection
    console.log("🔌 Testing database connection...")
    await pool.query("SELECT NOW()")
    console.log("✅ Database connection successful")

    // Read and execute schema
    console.log("📋 Creating database schema...")
    const schemaPath = path.join(__dirname, "..", "db", "schema.sql")

    if (!fs.existsSync(schemaPath)) {
      console.error("❌ Schema file not found at:", schemaPath)
      process.exit(1)
    }

    const schema = fs.readFileSync(schemaPath, "utf8")
    await pool.query(schema)
    console.log("✅ Database schema created successfully")

    // Verify tables were created
    console.log("🔍 Verifying table creation...")
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    const tables = tablesResult.rows.map((row) => row.table_name)
    console.log("📊 Created tables:", tables.join(", "))

    console.log("🎉 Database setup completed successfully!")
    console.log("\n📝 Next steps:")
    console.log("1. Start your application")
    console.log("2. Register the first user")
    console.log("3. Create your first group")
    console.log("4. Add some expenses")

    await pool.end()
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    console.log("\n🔧 Troubleshooting:")
    console.log("1. Check your DATABASE_URL format")
    console.log("2. Ensure the database exists")
    console.log("3. Verify connection permissions")
    console.log("4. Check network connectivity")
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
