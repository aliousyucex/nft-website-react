# Ice Water Fire - Blockchain Card Game

> 🎴 A full-stack blockchain-based card game built with React, Node.js, Socket.IO, and Solidity on Abstract Chain.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎮 About

Ice Water Fire is a **turn-based 1v1 card game** where players compete in a best-of-5 match system. The first player to win **3 rounds** wins the game and receives the prize pot (minus 3% commission).

### Game Mechanics

**Deck System:**
- Each player has their **own deck of 9 unique cards**
- Both players can play the same cards (independent decks)
- Cards: Fire 3/5/7, Ice 3/5/7, Water 3/5/7

**Winning Conditions:**
- 🔥 Fire beats ❄️ Ice
- 💧 Water beats 🔥 Fire
- ❄️ Ice beats 💧 Water
- Higher numbers beat lower numbers of the same type
- **Draws:** Same card = no points, but cards are consumed

**Card Distribution:**
1. Initial 5 cards dealt from 9-card deck
2. After 5 cards used → remaining 4 cards dealt
3. After all 9 cards used → reshuffle and deal 5 again

**Game Features:**
- 💰 ETH betting system with smart contract integration
- 🏆 Leaderboard with point-based ranking (3-0: 7pts, 3-1: 5pts, 3-2: 3pts)
- 🔄 Reconnection support (10-second grace period)
- ⏱️ 5-second card selection timeout
- 🚫 AFK punishment (3 consecutive timeouts = forfeit)
- 😊 Emoji reactions
- 📊 Game history tracking

## 📁 Project Structure

```
ice-water-fire/
├── frontend/              # React + Vite + Socket.IO Client
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/               # Node.js + Express + Socket.IO + Kysely
│   ├── src/
│   │   ├── config/
│   │   ├── db/            # Kysely database layer
│   │   ├── routes/        # HTTP routes
│   │   ├── services/      # Business logic
│   │   ├── socket/        # WebSocket handlers
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   ├── Dockerfile
│   └── package.json
├── contract/              # Solidity + Hardhat
│   ├── contracts/
│   │   └── IceWaterFireGame.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── hardhat.config.ts
│   └── package.json
├── docker-compose.yml     # Docker orchestration
├── POSTGRESQL_SETUP.md    # Database setup guide
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** (Required)
- **PostgreSQL 15+** (Not in Docker, see setup guide)
- **Docker & Docker Compose** (For deployment)
- **Wallet with testnet ETH** (For contract deployment)

### 1. Clone Repository

```bash
git clone <repository-url>
cd nft-website-react
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Contract
cd ../contract
npm install
```

### 3. Set Up PostgreSQL

**Important:** PostgreSQL is NOT in Docker. Follow the complete setup guide:

📖 **See [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)** for detailed instructions.

Quick setup:
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE iwf_game;
CREATE USER iwf_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE iwf_game TO iwf_user;
\q

# Run schema
psql -U iwf_user -d iwf_game -f backend/src/db/init.sql
```

### 4. Configure Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://iwf_user:password@localhost:5432/iwf_game
JWT_SECRET=your_jwt_secret_min_32_characters
API_SECRET_KEY=your_api_secret_key
CONTRACT_ADDRESS=<deployed-contract-address>
RPC_URL=https://api.testnet.abs.xyz
PRIVATE_KEY=<your-private-key>
```

**Contract** (`contract/.env`):
```env
PRIVATE_KEY=<your-private-key>
RPC_URL=https://api.testnet.abs.xyz
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_CONTRACT_ADDRESS=<deployed-contract-address>
VITE_CHAIN_ID=0x2B74
```

### 5. Deploy Smart Contract

```bash
cd contract
npm run compile
npm run deploy:testnet

# Copy the deployed contract address to backend and frontend .env files
```

### 6. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 🐳 Docker Deployment

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost (port 80)

**Note:** PostgreSQL is NOT included in Docker. Set up separately and configure `DATABASE_URL` environment variable.

## 📚 Documentation

### Component Documentation
- 📱 [Frontend README](./frontend/README.md) - React app, UI/UX, components
- 🔌 [Backend README](./backend/README.md) - API routes, WebSocket events, services
- 📜 [Contract README](./contract/README.md) - Smart contract, deployment, functions

### Guides
- 🎯 [Game Rules (Complete)](./frontend/src/components/game/iceWaterFire/game.md)
- 🗄️ [PostgreSQL Setup](./POSTGRESQL_SETUP.md)
- 🚢 [Deployment Strategy](./frontend/src/components/game/iceWaterFire/game.md#deployment-strategy)

### API Documentation

**HTTP Endpoints:**
- `GET /health` - Health check
- `GET /api/contract/stats` - Contract statistics
- `GET /api/contract/balance/:address` - User balance
- `GET /api/leaderboard` - Top players
- `GET /api/leaderboard/:address` - Player stats
- `POST /api/game/join` - Get JWT session token

**WebSocket Events (Client → Server):**
- `create_room` - Create game room
- `join_room` - Join existing room
- `quick_join` - Quick match
- `player_ready` - Ready up
- `select_card` - Play card
- `send_emoji` - Send emoji

**WebSocket Events (Server → Client):**
- `room_created` - Room created successfully
- `player_joined` - Player joined room
- `game_started` - Game started
- `cards_dealt` - Cards dealt to player
- `round_result` - Round result
- `game_finished` - Game finished

Full API docs: [Backend README](./backend/README.md)

## 🎯 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Styled Components, Ant Design, Socket.IO Client, Ethers.js v6 |
| **Backend** | Node.js 22, Express, Socket.IO, PostgreSQL, Kysely, JWT, Winston, Helmet |
| **Smart Contract** | Solidity 0.8.20, Hardhat, OpenZeppelin, Ethers.js |
| **Blockchain** | Abstract Chain (Testnet: 11124, Mainnet: TBD) |
| **Database** | PostgreSQL 15+ with Kysely query builder |
| **DevOps** | Docker, Docker Compose, Nginx |

## 🌐 Network Information

### Abstract Testnet
- **Chain ID:** 11124 (0x2B74)
- **RPC URL:** https://api.testnet.abs.xyz
- **Explorer:** https://testnet.abscan.org

### Abstract Mainnet
- **Chain ID:** TBD
- **RPC URL:** https://api.abs.xyz
- **Explorer:** https://abscan.org

## 🛠️ Development Scripts

### Backend

```bash
cd backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production
npm start

# Lint
npm run lint
npm run lint:fix
```

### Frontend

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Contract

```bash
cd contract

# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet

# Verify contract
npm run verify -- <CONTRACT_ADDRESS>
```

## 🔒 Security Features

### Backend Security
- ✅ JWT authentication
- ✅ Wallet signature verification
- ✅ Rate limiting (IP + Address based)
- ✅ 1-hour ban for rate limit violations
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ SQL injection prevention (Kysely)
- ✅ WebSocket room verification

### Smart Contract Security
- ✅ OpenZeppelin battle-tested contracts
- ✅ ReentrancyGuard on withdrawals
- ✅ Owner-only privileged functions
- ✅ Balance checks before transfers
- ✅ Negative balance support (debt tracking)

## 📊 Database Schema

```sql
leaderboard          # Player stats and rankings
game_history         # Completed game records
round_history        # Round-by-round details
ban_list             # Rate limit bans
```

See: `backend/src/db/init.sql` for full schema.

## 🚢 Deployment Strategy

### Phase 1: Testnet
1. Deploy contract to Abstract Testnet
2. Test all functionality
3. Gather feedback

### Phase 2: Dockerization
1. Build Docker images
2. Set up server with PostgreSQL
3. Deploy with docker-compose

### Phase 3: Mainnet
1. Security audit (recommended)
2. Deploy to Abstract Mainnet
3. Update frontend configuration
4. Go live! 🎉

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in `.env`
- Check port 5000 is available: `lsof -i :5000`

### Contract deployment fails
- Ensure wallet has testnet ETH
- Verify PRIVATE_KEY in `.env` (no 0x prefix)
- Check RPC_URL is correct

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Check CORS settings in backend

### PostgreSQL connection error
- See [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)
- Check pg_hba.conf authentication
- Verify user permissions

## 📈 Roadmap

- [x] Core game mechanics design
- [x] Smart contract development
- [x] Backend API & WebSocket setup
- [x] Database schema with Kysely
- [x] Leaderboard system
- [x] Room & game management
- [x] Reconnection support
- [ ] Frontend UI/UX implementation
- [ ] Mobile responsive design
- [ ] Sound effects & animations
- [ ] Tutorial/Onboarding
- [ ] Security audit
- [ ] Mainnet deployment

## 📝 License

MIT License - see LICENSE file for details.

## 👥 Team

Ice Water Fire Development Team

## 🆘 Support

For issues or questions:
1. Check documentation in component READMEs
2. Review [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)
3. Check troubleshooting section
4. Open an issue on GitHub

---

**Built with ❤️ using React, Node.js, Solidity, and PostgreSQL**
