# Ice Water Fire - Blockchain Card Game Monorepo

A Turborepo monorepo for the Ice Water Fire blockchain card game, featuring a React frontend, Node.js backend, and Solidity smart contracts.

## 🏗️ Project Structure

```
ice-water-fire-monorepo/
├── apps/
│   ├── frontend/          # React + Vite frontend application
│   └── backend/           # Node.js + Express backend with WebSocket
├── packages/
│   └── contract/          # Solidity smart contracts (Hardhat)
├── turbo.json             # Turborepo configuration
└── package.json           # Root package.json with workspace config
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

### Installation

Clone the repository and install all dependencies:

```bash
git clone <repository-url>
cd nft-website-react
npm install
```

This single command will install dependencies for all workspaces (frontend, backend, and contract).

### Development

Start all workspaces in development mode:

```bash
npm run dev
```

This will concurrently start:
- Frontend dev server (Vite)
- Backend dev server (ts-node)

### Building

Build all workspaces:

```bash
npm run build
```

## 📦 Workspaces

### Frontend (`@apps/frontend`)

React application built with Vite, TypeScript, and Web3 integration.

**Location:** `apps/frontend/`

**Commands:**
```bash
# Run in development mode
npm run dev --workspace=@apps/frontend

# Build for production
npm run build --workspace=@apps/frontend

# Lint code
npm run lint --workspace=@apps/frontend

# Format code
npm run format --workspace=@apps/frontend
```

### Backend (`@apps/backend`)

Node.js backend with Express REST API and Socket.IO WebSocket server.

**Location:** `apps/backend/`

**Commands:**
```bash
# Run in development mode
npm run dev --workspace=@apps/backend

# Build
npm run build --workspace=@apps/backend

# Start production server
npm run start --workspace=@apps/backend

# Run tests
npm run test --workspace=@apps/backend
```

### Smart Contracts (`@packages/contract`)

Solidity smart contracts deployed with Hardhat.

**Location:** `packages/contract/`

**Commands:**
```bash
# Compile contracts
npm run compile:contracts

# Run tests
npm run test:contracts

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## 🧹 Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

### VS Code Setup

1. Install the Biome extension: `biomejs.biome`
2. The workspace is pre-configured to:
   - Use Biome as the default formatter
   - Format on save (Ctrl/Cmd + S)
   - Auto-fix issues on save

### Manual Linting/Formatting

```bash
# Lint all workspaces
npm run lint

# Format all workspaces
npm run format
```

### Biome Rules

- No spaces in import braces: `import {x} from 'y'`
- Mandatory semicolons (error level)
- Unused variables/imports treated as errors
- Auto-organize imports

## 🐳 Docker

Run the application with Docker:

```bash
# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# View logs
npm run docker:logs
```

## 📝 Adding Dependencies

Add a dependency to a specific workspace:

```bash
# Add to frontend
npm install <package-name> --workspace=@apps/frontend

# Add to backend
npm install <package-name> --workspace=@apps/backend

# Add to contract
npm install <package-name> --workspace=@packages/contract
```

Add a dev dependency:

```bash
npm install <package-name> --save-dev --workspace=@apps/frontend
```

## 🔧 Environment Variables

Each workspace has its own `.env` file:

- `apps/frontend/.env` - Frontend environment variables
- `apps/backend/.env` - Backend environment variables
- `packages/contract/.env` - Contract deployment variables

See `.env.example` files in each workspace for required variables.

## 📚 Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Wagmi + RainbowKit (Web3)
- Styled Components
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- TypeScript
- PostgreSQL (Kysely ORM)
- JWT Authentication

### Smart Contracts
- Solidity
- Hardhat
- OpenZeppelin Contracts
- Ethers.js v6

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run format`
4. Commit your changes
5. Push and create a pull request

## 📄 License

MIT
