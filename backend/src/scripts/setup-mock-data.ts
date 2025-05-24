import { mockDataService } from "../utils/mock-data"

async function main() {
  try {
    console.log("🎭 Starting mock data setup...")

    const result = await mockDataService.setupMockData()

    console.log("\n🎉 Mock data setup completed successfully!")
    console.log("\n📋 Demo Accounts:")
    console.log("👤 Regular User: user@demo.com / password123")
    console.log("👑 Admin User: admin@demo.com / password123")
    console.log("👥 Other Users: alice@demo.com, bob@demo.com, charlie@demo.com / password123")

    console.log("\n📊 Data Summary:")
    console.log(`✅ Users: ${result.users.length}`)
    console.log(`✅ Groups: ${result.groups.length}`)
    console.log(`✅ Expenses: ${result.expenses.length}`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Mock data setup failed:", error)
    process.exit(1)
  }
}

main()
