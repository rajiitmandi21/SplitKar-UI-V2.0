# Git Guidelines for SplitKar

## Files to Commit ✅

### Lock Files (IMPORTANT - Always Commit)
- `package-lock.json` - Ensures exact dependency versions
- `yarn.lock` - If using Yarn instead of npm
- `pnpm-lock.yaml` - If using pnpm

### Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `postcss.config.js` - PostCSS configuration

### Source Code
- All `.ts`, `.tsx`, `.js`, `.jsx` files
- All `.css`, `.scss` files
- All `.md` documentation files
- All `.sql` schema files

## Files to NEVER Commit ❌

### Environment Files
- `.env` - Contains secrets and API keys
- `.env.local` - Local development overrides
- `.env.production` - Production secrets

### Build Outputs
- `node_modules/` - Dependencies (use package-lock.json instead)
- `.next/` - Next.js build output
- `dist/` - Compiled JavaScript
- `build/` - Production builds

### IDE and OS Files
- `.vscode/` - VS Code settings (unless shared team settings)
- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows system files

## Why package-lock.json is Important

### ✅ Benefits of Committing package-lock.json:
1. **Reproducible Builds** - Everyone gets exact same dependency versions
2. **Security** - Prevents supply chain attacks from version drift
3. **Debugging** - Easier to track down dependency-related issues
4. **CI/CD** - Faster and more reliable deployments

### ❌ Problems if you ignore package-lock.json:
1. **Version Drift** - Different developers get different dependency versions
2. **"Works on my machine"** - Hard to reproduce bugs
3. **Security Risks** - Newer versions might have vulnerabilities
4. **Slower Installs** - npm has to resolve dependencies every time

## Best Practices

### For Applications (like SplitKar):
- ✅ Always commit `package-lock.json`
- ✅ Use `npm ci` in production/CI instead of `npm install`
- ✅ Regularly update dependencies with `npm update`

### For Libraries/Packages:
- ❌ Usually ignore `package-lock.json` 
- ✅ Let consumers resolve their own dependency tree
- ✅ Use broader version ranges in `package.json`

## Commands

\`\`\`bash
# Install exact versions from lock file (production/CI)
npm ci

# Install and update lock file (development)
npm install

# Update dependencies and lock file
npm update

# Check for outdated packages
npm outdated

# Audit for security vulnerabilities
npm audit
