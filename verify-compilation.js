import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function verifyCompilation() {
  console.log("🔍 Verifying TypeScript Compilation...\n")

  try {
    // Check backend compilation
    console.log("📦 Backend TypeScript Compilation:")
    console.log("Running: cd backend && npm run build")

    const backendResult = await execAsync("cd backend && npm run build", {
      timeout: 30000,
      cwd: process.cwd(),
    })

    if (backendResult.stderr && !backendResult.stderr.includes("warning")) {
      console.log("❌ Backend compilation errors:")
      console.log(backendResult.stderr)
    } else {
      console.log("✅ Backend compiled successfully!")
      if (backendResult.stdout) {
        console.log(backendResult.stdout)
      }
    }
  } catch (error) {
    console.log("❌ Backend compilation failed:")
    console.log(error.message)

    // Let's check what specific errors we're getting
    if (error.stdout) {
      console.log("STDOUT:", error.stdout)
    }
    if (error.stderr) {
      console.log("STDERR:", error.stderr)
    }
  }

  try {
    // Check frontend compilation
    console.log("\n📦 Frontend TypeScript Compilation:")
    console.log("Running: cd frontend && npm run type-check")

    const frontendResult = await execAsync("cd frontend && npm run type-check", {
      timeout: 30000,
      cwd: process.cwd(),
    })

    if (frontendResult.stderr && !frontendResult.stderr.includes("warning")) {
      console.log("❌ Frontend compilation errors:")
      console.log(frontendResult.stderr)
    } else {
      console.log("✅ Frontend type checking passed!")
      if (frontendResult.stdout) {
        console.log(frontendResult.stdout)
      }
    }
  } catch (error) {
    console.log("❌ Frontend type checking failed:")
    console.log(error.message)

    if (error.stdout) {
      console.log("STDOUT:", error.stdout)
    }
    if (error.stderr) {
      console.log("STDERR:", error.stderr)
    }
  }

  // Let's also check if the tsconfig files are valid
  console.log("\n🔧 Checking TypeScript Configuration Files:")

  try {
    const fs = await import("fs")
    const path = await import("path")

    // Check backend tsconfig
    const backendTsConfig = fs.readFileSync("backend/tsconfig.json", "utf8")
    JSON.parse(backendTsConfig)
    console.log("✅ Backend tsconfig.json is valid JSON")

    // Check frontend tsconfig (Next.js should have one)
    try {
      const frontendTsConfig = fs.readFileSync("frontend/tsconfig.json", "utf8")
      JSON.parse(frontendTsConfig)
      console.log("✅ Frontend tsconfig.json is valid JSON")
    } catch (e) {
      console.log("⚠️  Frontend tsconfig.json not found or invalid")
    }
  } catch (error) {
    console.log("❌ Error checking tsconfig files:", error.message)
  }

  // Check package.json files
  console.log("\n📋 Checking Package.json Files:")

  try {
    const fs = await import("fs")

    const backendPkg = JSON.parse(fs.readFileSync("backend/package.json", "utf8"))
    console.log("✅ Backend package.json is valid")
    console.log(`   - TypeScript version: ${backendPkg.devDependencies?.typescript || "Not found"}`)

    const frontendPkg = JSON.parse(fs.readFileSync("frontend/package.json", "utf8"))
    console.log("✅ Frontend package.json is valid")
    console.log(`   - TypeScript version: ${frontendPkg.devDependencies?.typescript || "Not found"}`)
    console.log(`   - Next.js version: ${frontendPkg.dependencies?.next || "Not found"}`)
  } catch (error) {
    console.log("❌ Error checking package.json files:", error.message)
  }
}

verifyCompilation()
