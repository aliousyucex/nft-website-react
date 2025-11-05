# Quick Start Guide

Get up and running with the Ice Water Fire monorepo in 3 steps.

## Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

Check your versions:
```bash
node --version
npm --version
```

## Step 1: Install Dependencies

From the project root, run:

```bash
npm install
```

This installs all dependencies for all workspaces (frontend, backend, and contract).

**Expected output:** Installation should complete without errors. You'll see packages being installed for the root, @apps/backend, @apps/frontend, and @packages/contract.

## Step 2: Set Up Environment Variables

Copy the example environment files and configure them:

```bash
# Backend
cp apps/backend/env.example apps/backend/.env
# Edit apps/backend/.env with your values

# Frontend
cp apps/frontend/env.example apps/frontend/.env
# Edit apps/frontend/.env with your values

# Contract (optional, only needed for deployment)
cp packages/contract/env.example packages/contract/.env
# Edit packages/contract/.env with your deployment keys
```

## Step 3: Start Development

```bash
npm run dev
```

This starts both the frontend and backend in development mode.

**Expected output:**
- Backend server starts on http://localhost:5000
- Frontend dev server starts on http://localhost:5173 (or next available port)

## VS Code Setup (Recommended)

1. Open the project in VS Code
2. Install the recommended extension when prompted (Biome)
3. Reload VS Code
4. Code formatting and linting will now work automatically!

**Keyboard shortcuts:**
- Format document: `Ctrl+Alt+F` (Windows/Linux) or `Cmd+Option+F` (Mac)
- Format on save: Enabled by default

## Common Commands

### Development
```bash
# Start all workspaces
npm run dev

# Start only frontend
npm run dev --workspace=@apps/frontend

# Start only backend
npm run dev --workspace=@apps/backend
```

### Building
```bash
# Build all workspaces
npm run build

# Build only frontend
npm run build --workspace=@apps/frontend
```

### Code Quality
```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

### Smart Contracts
```bash
# Compile contracts
npm run compile:contracts

# Run contract tests
npm run test:contracts

# Deploy to testnet
npm run deploy:testnet
```

### Docker
```bash
# Start with Docker
npm run docker:up

# Stop Docker containers
npm run docker:down

# View logs
npm run docker:logs
```

## Adding Packages

Install a package to a specific workspace:

```bash
# Add to frontend
npm install <package-name> --workspace=@apps/frontend

# Add to backend
npm install <package-name> --workspace=@apps/backend

# Add dev dependency
npm install <package-name> --save-dev --workspace=@apps/frontend
```

Examples:
```bash
npm install axios --workspace=@apps/frontend
npm install express-validator --workspace=@apps/backend
npm install --save-dev @types/node --workspace=@apps/backend
```

## Project Structure

```
nft-website-react/
├── apps/
│   ├── backend/           # Node.js backend (Port 5000)
│   │   ├── src/
│   │   ├── biome.json     # Backend linting rules
│   │   └── package.json
│   └── frontend/          # React frontend (Port 5173)
│       ├── src/
│       ├── biome.json     # Frontend linting rules
│       └── package.json
├── packages/
│   └── contract/          # Solidity smart contracts
│       ├── contracts/
│       └── package.json
├── turbo.json             # Turborepo config
└── package.json           # Root workspace config
```

## Troubleshooting

### Port already in use
If port 5000 or 5173 is already in use:
- Stop the process using that port
- Or modify the port in the respective workspace's configuration

### Biome not working in VS Code
1. Install the Biome extension: `biomejs.biome`
2. Reload VS Code window
3. Check that `.vscode/settings.json` exists

### Clean install needed
Remove all node_modules and reinstall:
```bash
# Clean everything
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Reinstall
npm install
```

## Next Steps

- Read the [README.md](./README.md) for detailed documentation
- Read the [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) to understand what changed
- Check the [howTos](./howTos/) directory for specific guides

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation in the `howTos/` directory
3. Check the README.md for more details

Happy coding! 🚀

