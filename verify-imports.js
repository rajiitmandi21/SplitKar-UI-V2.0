import { promises as fs } from "fs"
import path from "path"

async function verifyImports() {
  console.log("🔍 Verifying Module Imports...\n")

  const issues = []

  // Define project structure
  const projectPaths = {
    backend: "backend/src",
    frontend: "frontend/src",
  }

  // Common import patterns to check
  const importPatterns = {
    // Relative imports
    relative: /from\s+['"]\.\.?\/[^'"]+['"]/g,
    // Absolute imports with @
    absolute: /from\s+['"]@\/[^'"]+['"]/g,
    // Node modules
    nodeModules: /from\s+['"][^./][^'"]*['"]/g,
    // All imports
    all: /(?:import|from)\s+['"]([^'"]+)['"]/g,
  }

  async function checkFile(filePath, content) {
    const fileIssues = []
    const imports = [...content.matchAll(importPatterns.all)]

    for (const match of imports) {
      const importPath = match[1]

      // Skip node_modules imports for now
      if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
        continue
      }

      // Check relative imports
      if (importPath.startsWith(".")) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath)
        const possibleExtensions = ["", ".ts", ".tsx", ".js", ".jsx"]

        let exists = false
        for (const ext of possibleExtensions) {
          try {
            await fs.access(resolvedPath + ext)
            exists = true
            break
          } catch {}
        }

        if (!exists) {
          // Check if it's a directory with index file
          for (const ext of ["/index.ts", "/index.tsx", "/index.js"]) {
            try {
              await fs.access(resolvedPath + ext)
              exists = true
              break
            } catch {}
          }
        }

        if (!exists) {
          fileIssues.push(`❌ Missing file: ${importPath} (resolved to ${resolvedPath})`)
        }
      }

      // Check absolute imports (@/ paths)
      if (importPath.startsWith("@/")) {
        const relativePath = importPath.replace("@/", "")
        let basePath = ""

        if (filePath.includes("frontend")) {
          basePath = "frontend/src"
        } else if (filePath.includes("backend")) {
          basePath = "backend/src"
        }

        if (basePath) {
          const resolvedPath = path.join(basePath, relativePath)
          const possibleExtensions = ["", ".ts", ".tsx", ".js", ".jsx"]

          let exists = false
          for (const ext of possibleExtensions) {
            try {
              await fs.access(resolvedPath + ext)
              exists = true
              break
            } catch {}
          }

          if (!exists) {
            fileIssues.push(`❌ Missing absolute import: ${importPath} (resolved to ${resolvedPath})`)
          }
        }
      }
    }

    return fileIssues
  }

  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          await scanDirectory(fullPath)
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          try {
            const content = await fs.readFile(fullPath, "utf-8")
            const fileIssues = await checkFile(fullPath, content)

            if (fileIssues.length > 0) {
              issues.push({
                file: fullPath,
                issues: fileIssues,
              })
            }
          } catch (error) {
            console.log(`⚠️  Could not read file: ${fullPath}`)
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not scan directory: ${dir}`)
    }
  }

  // Check backend imports
  console.log("📁 Checking Backend Imports...")
  try {
    await scanDirectory("backend/src")
  } catch (error) {
    console.log("⚠️  Backend directory not found or inaccessible")
  }

  // Check frontend imports
  console.log("📁 Checking Frontend Imports...")
  try {
    await scanDirectory("frontend/src")
  } catch (error) {
    console.log("⚠️  Frontend directory not found or inaccessible")
  }

  // Check specific known problematic imports
  console.log("\n🔍 Checking Known Import Issues...")

  const knownIssues = [
    {
      file: "frontend/src/app/api-test/page.tsx",
      expectedImports: ["@/components/ui/button", "@/components/ui/card", "@/components/ui/badge"],
    },
    {
      file: "frontend/src/app/auth/forgot-password/page.tsx",
      expectedImports: [
        "@/components/ui/card",
        "@/components/ui/button",
        "@/components/ui/input",
        "@/components/ui/label",
        "@/components/ui/alert",
      ],
    },
    {
      file: "backend/src/controllers/groupController.ts",
      expectedImports: ["../utils/logger"],
    },
  ]

  for (const check of knownIssues) {
    try {
      const content = await fs.readFile(check.file, "utf-8")
      console.log(`\n📄 ${check.file}:`)

      for (const expectedImport of check.expectedImports) {
        if (content.includes(`from "${expectedImport}"`)) {
          console.log(`  ✅ ${expectedImport}`)
        } else {
          console.log(`  ❌ Missing: ${expectedImport}`)
        }
      }
    } catch (error) {
      console.log(`  ⚠️  File not found: ${check.file}`)
    }
  }

  // Report results
  console.log("\n📊 Import Verification Results:")
  console.log("================================")

  if (issues.length === 0) {
    console.log("✅ All imports appear to be correct!")
  } else {
    console.log(`❌ Found ${issues.length} files with import issues:\n`)

    for (const issue of issues) {
      console.log(`📄 ${issue.file}:`)
      for (const problem of issue.issues) {
        console.log(`  ${problem}`)
      }
      console.log("")
    }
  }

  // Check tsconfig.json path mappings
  console.log("\n🔧 Checking TypeScript Path Mappings...")

  try {
    const frontendTsConfig = JSON.parse(await fs.readFile("frontend/tsconfig.json", "utf-8"))
    console.log("Frontend tsconfig.json paths:")
    if (frontendTsConfig.compilerOptions?.paths) {
      for (const [alias, paths] of Object.entries(frontendTsConfig.compilerOptions.paths)) {
        console.log(`  ${alias} → ${paths}`)
      }
    } else {
      console.log("  ⚠️  No path mappings found")
    }
  } catch (error) {
    console.log("  ❌ Could not read frontend tsconfig.json")
  }

  try {
    const backendTsConfig = JSON.parse(await fs.readFile("backend/tsconfig.json", "utf-8"))
    console.log("\nBackend tsconfig.json paths:")
    if (backendTsConfig.compilerOptions?.paths) {
      for (const [alias, paths] of Object.entries(backendTsConfig.compilerOptions.paths)) {
        console.log(`  ${alias} → ${paths}`)
      }
    } else {
      console.log("  ⚠️  No path mappings found")
    }
  } catch (error) {
    console.log("  ❌ Could not read backend tsconfig.json")
  }

  console.log("\n🎯 Recommendations:")
  console.log("===================")
  console.log("1. Ensure all @/ imports have corresponding files in src/")
  console.log("2. Check that tsconfig.json has correct path mappings")
  console.log("3. Verify all relative imports point to existing files")
  console.log("4. Make sure UI components are in frontend/src/components/ui/")
  console.log("5. Check that all dependencies are installed in package.json")
}

verifyImports().catch(console.error)
