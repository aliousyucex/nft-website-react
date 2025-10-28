# Ice Water Fire - Complete Setup Guide

This guide will walk you through setting up the complete Ice Water Fire game from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 22+** installed ([Download](https://nodejs.org/))
- [ ] **PostgreSQL 15+** installed ([Guide](./POSTGRESQL_SETUP.md))
- [ ] **Git** installed
- [ ] **Code editor** (VS Code recommended)
- [ ] **MetaMask** or Web3 wallet
- [ ] **Testnet ETH** for Abstract Testnet

## 🚀 Step-by-Step Setup

### Step 1: Clone and Install

```bash
# Clone repository
git clone <your-repository-url>
cd nft-website-react

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install contract dependencies
cd ../contract
npm install

cd ..
```

### Step 2: Set Up PostgreSQL

#### 2.1 Install PostgreSQL (if not installed)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### 2.2 Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Run these commands in PostgreSQL prompt
CREATE DATABASE iwf_game;
CREATE USER iwf_user WITH ENCRYPTED PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE iwf_game TO iwf_user;
\c iwf_game
GRANT ALL ON SCHEMA public TO iwf_user;
\q

# Exit postgres user
exit
```

#### 2.3 Initialize Database Schema

```bash
# From project root
psql -U iwf_user -d iwf_game -f backend/src/db/init.sql
```

**Enter the password you set in Step 2.2**

#### 2.4 Verify Database Setup

```bash
psql -U iwf_user -d iwf_game

# In PostgreSQL prompt
\dt
# Should show: ban_list, game_history, leaderboard, round_history

SELECT COUNT(*) FROM leaderboard;
# Should return 0

\q
```

### Step 3: Configure Environment Variables

#### 3.1 Backend Environment

```bash
cd backend

# Copy example file
cp env.example .env

# Edit .env file
nano .env
```

Update these values in `backend/.env`:
```env
NODE_ENV=development
PORT=5000

# Use the password from Step 2.2
DATABASE_URL=postgresql://iwf_user:change_this_password@localhost:5432/iwf_game

# Generate random secrets (at least 32 characters)
JWT_SECRET=your_very_long_random_secret_here_min_32_chars
API_SECRET_KEY=another_random_secret_here

# Will be filled after Step 4
CONTRACT_ADDRESS=
RPC_URL=https://api.testnet.abs.xyz
PRIVATE_KEY=

# Rate limiting (defaults are fine)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_BAN_DURATION_MS=3600000

# Game settings (defaults are fine)
CARD_SELECTION_TIMEOUT=5000
DISCONNECT_GRACE_PERIOD=10000
MAX_ROUND_LIMIT=15
COMMISSION_RATE=0.03
```

#### 3.2 Contract Environment

```bash
cd ../contract

# Copy example file
cp env.example .env

# Edit .env file
nano .env
```

Update `contract/.env`:
```env
# Get your private key from MetaMask
# Settings > Security & Privacy > Show private key
# IMPORTANT: Remove 0x prefix!
PRIVATE_KEY=your_private_key_without_0x_prefix

# Abstract Testnet RPC
RPC_URL=https://api.testnet.abs.xyz

# Leave empty for now
ETHERSCAN_API_KEY=
CONTRACT_ADDRESS=
```

#### 3.3 Frontend Environment

```bash
cd ../frontend

# Create .env file
nano .env
```

Add to `frontend/.env`:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# WebSocket URL
VITE_WS_URL=ws://localhost:5000

# Will be filled after Step 4
VITE_CONTRACT_ADDRESS=

# Abstract Testnet Chain ID (decimal: 11124)
VITE_CHAIN_ID=0x2B74
```

### Step 4: Deploy Smart Contract

#### 4.1 Get Testnet ETH

1. Go to [Abstract Testnet Faucet](https://faucet.testnet.abs.xyz)
2. Connect your wallet
3. Request testnet ETH
4. Wait for confirmation

#### 4.2 Compile Contract

```bash
cd contract
npm run compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

#### 4.3 Deploy to Testnet

```bash
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Starting Ice Water Fire Game contract deployment...
📍 Deploying from address: 0x...
💰 Account balance: 0.5 ETH
📝 Deploying IceWaterFireGame contract...
✅ Contract deployed to: 0xABC123...
🔗 Transaction hash: 0x...
👤 Owner: 0x...
✨ Deployment complete!
```

**Copy the contract address from the output!**

#### 4.4 Update Environment Variables

Update `backend/.env`:
```env
CONTRACT_ADDRESS=0xABC123...  # Paste your deployed address
PRIVATE_KEY=your_private_key  # Same as contract/.env
```

Update `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0xABC123...  # Paste your deployed address
```

### Step 5: Test Backend

```bash
cd backend

# Build TypeScript
npm run build

# Start development server
npm run dev
```

**Expected Output:**
```
Server started on port 5000
Environment: development
WebSocket enabled
Database connected successfully
Database connection test successful
Setting up Socket.IO
Socket.IO setup complete
```

**Test in browser or with curl:**
```bash
# Health check
curl http://localhost:5000/health

# Contract stats
curl http://localhost:5000/api/contract/stats

# Leaderboard
curl http://localhost:5000/api/leaderboard
```

### Step 6: Test Frontend

Open a **new terminal:**

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open browser:** http://localhost:5173

### Step 7: Test Full Flow

#### 7.1 Connect Wallet

1. Open http://localhost:5173
2. Click "Connect Wallet"
3. Connect MetaMask
4. Switch to Abstract Testnet (it should prompt you)

#### 7.2 Deposit Funds

```bash
# Use curl or Postman to test deposit
# Or implement deposit UI in frontend
```

#### 7.3 Create Room

1. Click "Create Room"
2. Set bet amount (e.g., 0.01 ETH)
3. Optional: Set password
4. Click "Create"

#### 7.4 Join Room (Second Player)

**Option 1:** Open in incognito window with different wallet  
**Option 2:** Use second computer/device

1. Copy room ID
2. Click "Join Room"
3. Enter room ID
4. Click "Join"

#### 7.5 Play Game

1. Both players click "Ready"
2. Cards are dealt
3. Select a card
4. See result
5. Continue until someone wins 3 rounds

### Step 8: Verify Everything Works

#### ✅ Backend Checklist

- [ ] Server starts without errors
- [ ] `/health` endpoint returns OK
- [ ] `/api/contract/stats` returns contract info
- [ ] `/api/leaderboard` returns empty array or data
- [ ] WebSocket connections work
- [ ] Database queries work

#### ✅ Frontend Checklist

- [ ] App loads without errors
- [ ] Can connect wallet
- [ ] Can see contract balance
- [ ] Can create room
- [ ] Can join room
- [ ] Can see room list

#### ✅ Database Checklist

```bash
# Check tables exist
psql -U iwf_user -d iwf_game -c "\dt"

# Check leaderboard
psql -U iwf_user -d iwf_game -c "SELECT * FROM leaderboard LIMIT 5;"

# Check game history (should be empty initially)
psql -U iwf_user -d iwf_game -c "SELECT * FROM game_history LIMIT 5;"
```

## 🐛 Troubleshooting

### Backend Issues

#### Port 5000 already in use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in backend/.env
# Make sure DATABASE_URL matches your setup
```

#### Contract connection error
- Verify CONTRACT_ADDRESS is correct
- Ensure PRIVATE_KEY is correct (no 0x prefix)
- Check RPC_URL is accessible

### Frontend Issues

#### Can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in `.env`
- Look for CORS errors in browser console

#### Wallet connection fails
- Ensure MetaMask is installed
- Switch to Abstract Testnet
- Check network settings

### Contract Issues

#### Deployment fails
- Ensure you have testnet ETH
- Verify PRIVATE_KEY is correct (no 0x prefix)
- Check gas price on network

#### Transaction fails
- Check wallet has sufficient balance
- Verify contract address is correct
- Check transaction on explorer

## 📚 Next Steps

After successful setup:

1. **Read the documentation:**
   - [Game Rules](./frontend/src/components/game/iceWaterFire/game.md)
   - [Backend API](./backend/README.md)
   - [Contract Functions](./contract/README.md)

2. **Implement Frontend UI:**
   - Design game screens
   - Add animations
   - Implement card selection UI
   - Add sound effects

3. **Test thoroughly:**
   - Test all game scenarios
   - Test disconnection/reconnection
   - Test AFK timeout
   - Test edge cases

4. **Prepare for deployment:**
   - Set up production server
   - Configure SSL/TLS
   - Set up monitoring
   - Prepare mainnet deployment

## 🔐 Security Reminders

- ⚠️ **Never commit `.env` files to Git**
- ⚠️ **Never share your private keys**
- ⚠️ **Use strong passwords for PostgreSQL**
- ⚠️ **Keep your dependencies updated**
- ⚠️ **Enable firewall on production server**

## 🆘 Getting Help

If you encounter issues:

1. Check logs:
   - Backend: Terminal output
   - Frontend: Browser console
   - PostgreSQL: `/var/log/postgresql/`

2. Verify environment variables are correct

3. Check [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md) for database issues

4. Review error messages carefully

5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

## ✅ Setup Complete!

Congratulations! Your Ice Water Fire development environment is ready.

**Quick Start Commands:**

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Watch logs
cd backend && tail -f logs/all.log
```

**Happy coding! 🎮**

