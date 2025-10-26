# Migration Guide - Turborepo Monorepo

This document explains the changes made to convert this project into a Turborepo monorepo.

## What Changed?

### Directory Structure

**Before:**
```
nft-website-react/
├── backend/
├── frontend/
├── contract/
└── package.json
```

**After:**
```
nft-website-react/
├── apps/
│   ├── backend/         # @apps/backend
│   └── frontend/        # @apps/frontend
├── packages/
│   └── contract/        # @packages/contract
├── turbo.json
└── package.json
```

### Package Names

- `ice-water-fire-backend` → `@apps/backend`
- `ice-water-fire-frontend` → `@apps/frontend`
- `ice-water-fire-contract` → `@packages/contract`

### Scripts

**Root-level scripts (run from project root):**

| Old Command | New Command | Description |
|------------|-------------|-------------|
| `npm run dev:frontend` | `npm run dev` | Runs all workspaces in dev mode |
| `npm run dev:backend` | `npm run dev` | Runs all workspaces in dev mode |
| `npm run build:frontend` | `npm run build` | Builds all workspaces |
| `npm run build:backend` | `npm run build` | Builds all workspaces |
| `npm run compile:contracts` | `npm run compile:contracts` | Same (unchanged) |
| N/A | `npm run lint` | Lints all workspaces with Biome |
| N/A | `npm run format` | Formats all workspaces with Biome |

**Workspace-specific commands:**

```bash
# Run only frontend
npm run dev --workspace=@apps/frontend

# Run only backend
npm run dev --workspace=@apps/backend

# Build only frontend
npm run build --workspace=@apps/frontend

# Lint only backend
npm run lint --workspace=@apps/backend
```

### Linting & Formatting

**Changed from ESLint + Prettier to Biome**

- Faster performance (Rust-based)
- Unified linting and formatting
- Better monorepo support
- Stricter rules for code quality

### Configuration Files

**New files:**
- `turbo.json` - Turborepo pipeline configuration
- `apps/backend/biome.json` - Backend linting/formatting rules
- `apps/frontend/biome.json` - Frontend linting/formatting rules
- `.vscode/extensions.json` - Recommends Biome extension
- `.vscode/settings.json` - Auto-format on save

**Removed:**
- All `.eslintrc.*` files
- ESLint-related packages from package.json files

### Docker

**docker-compose.yml updated:**
- `context: ./backend` → `context: ./apps/backend`
- `context: ./frontend` → `context: ./apps/frontend`
- Volume paths updated accordingly

### Environment Variables

Each workspace keeps its own `.env` file in its directory:
- `apps/backend/.env`
- `apps/frontend/.env`
- `packages/contract/.env`

## Getting Started After Migration

### 1. Clean Install

```bash
# Install all dependencies
npm install
```

This single command installs dependencies for all workspaces.

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` in each workspace and fill in values:

```bash
cp apps/backend/env.example apps/backend/.env
cp apps/frontend/env.example apps/frontend/.env
cp packages/contract/env.example packages/contract/.env
```

### 3. Install VS Code Extension

Install the Biome extension:
- Extension ID: `biomejs.biome`
- Or open the project in VS Code and accept the recommended extension

### 4. Start Development

```bash
# Start all services
npm run dev
```

## Working with the Monorepo

### Adding Dependencies

```bash
# Add to specific workspace
npm install <package> --workspace=@apps/frontend
npm install <package> --workspace=@apps/backend
npm install <package> --workspace=@packages/contract

# Add dev dependency
npm install <package> --save-dev --workspace=@apps/frontend
```

### Running Commands

```bash
# Run script in specific workspace
npm run <script-name> --workspace=@apps/frontend

# Run script in all workspaces (via Turbo)
npm run dev
npm run build
npm run lint
npm run format
```

### Code Formatting

**Automatic (VS Code):**
- Format on save is enabled by default
- Press `Ctrl+Alt+F` (Windows/Linux) or `Cmd+Option+F` (Mac)

**Manual:**
```bash
# Format all workspaces
npm run format

# Format specific workspace
npm run format --workspace=@apps/frontend
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint --workspace=@apps/backend
```

## Biome Rules

The following rules are enforced:

1. **No spaces in import braces**
   ```typescript
   // ✅ Correct
   import {useState, useEffect} from 'react';
   
   // ❌ Wrong
   import { useState, useEffect } from 'react';
   ```

2. **Mandatory semicolons**
   ```typescript
   // ✅ Correct
   const x = 5;
   
   // ❌ Wrong (will error)
   const x = 5
   ```

3. **No unused variables/imports**
   ```typescript
   // ❌ Will error
   import {unused} from 'something';
   const unusedVar = 5;
   ```

4. **Auto-organize imports** - Imports are automatically sorted on format

## Benefits of New Structure

1. **Faster builds** - Turbo caches and parallelizes builds
2. **Better DX** - Single `npm install` for everything
3. **Consistent formatting** - Biome enforces rules across all code
4. **Easier CI/CD** - Single root-level commands
5. **Type safety** - Better TypeScript support across workspaces
6. **Workspace isolation** - Each app manages its own dependencies

## Troubleshooting

### Issue: "Cannot find package"
**Solution:** Run `npm install` from project root

### Issue: "Biome not formatting"
**Solution:** 
1. Install Biome extension in VS Code
2. Reload VS Code window
3. Check `.vscode/settings.json` is present

### Issue: "Turbo command not found"
**Solution:** Run `npm install` to install turbo at root level

### Issue: "Old node_modules causing issues"
**Solution:**
```bash
# Clean all node_modules
npm run clean
rm -rf node_modules
npm install
```

## Need Help?

- Check the [main README.md](./README.md) for detailed documentation
- Review [Turborepo documentation](https://turbo.build/repo/docs)
- Review [Biome documentation](https://biomejs.dev/)

