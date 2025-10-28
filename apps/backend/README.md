# Ice Water Fire - Backend

Node.js + Socket.IO + Express backend for Ice Water Fire card game.

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 15+ (running locally or remote)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
nano .env
```

### Development

```bash
# Run development server with hot reload
npm run dev
```

Server will start on http://localhost:5000

### Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/
│   │   └── index.ts          # Configuration
│   ├── db/
│   │   ├── connection.ts     # PostgreSQL connection
│   │   └── init.sql          # Database schema
│   ├── services/
│   │   ├── contract.ts       # Smart contract interaction
│   │   ├── room.ts           # Room management
│   │   ├── game.ts           # Game logic
│   │   └── leaderboard.ts    # Leaderboard service
│   ├── socket/
│   │   ├── index.ts          # Socket.IO setup
│   │   ├── handlers/
│   │   │   ├── room.ts       # Room events
│   │   │   ├── game.ts       # Game events
│   │   │   └── auth.ts       # Authentication
│   │   └── middleware/
│   │       ├── auth.ts       # JWT verification
│   │       └── rateLimit.ts  # Rate limiting
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   ├── contract.ts       # Contract routes
│   │   ├── leaderboard.ts    # Leaderboard routes
│   │   └── game.ts           # Game routes
│   ├── types/
│   │   ├── room.ts           # Room types
│   │   ├── player.ts         # Player types
│   │   └── card.ts           # Card types
│   └── utils/
│       ├── logger.ts         # Winston logger
│       ├── errors.ts         # Error handling
│       └── validators.ts     # Input validation
├── package.json
├── tsconfig.json
└── env.example
```

## 🔐 Environment Variables

See `env.example` for all required environment variables.

## 🗄️ Database Setup

```bash
# Create database
createdb iwf_game

# Run initialization script
psql -d iwf_game -f src/db/init.sql
```

## 🧪 Testing

```bash
npm test
```

## 📝 API Documentation

### HTTP Routes

#### Contract Routes
- `GET /api/contract/stats` - Get contract statistics
- `POST /api/contract/deposit` - Deposit to contract
- `POST /api/contract/withdraw` - Withdraw from contract
- `GET /api/contract/balance/:address` - Get user balance

#### Leaderboard Routes
- `GET /api/leaderboard` - Get top players
- `GET /api/leaderboard/:address` - Get player stats

#### Game Routes
- `POST /api/game/join` - Get JWT token for joining game
- `POST /api/game/verify-session` - Verify session token

### WebSocket Events

#### Client → Server
- `create_room` - Create new room
- `join_room` - Join existing room
- `quick_join` - Quick join available room
- `leave_room` - Leave room
- `player_ready` - Mark player as ready
- `select_card` - Select card for current round
- `send_emoji` - Send emoji to opponent
- `ping` - Health check

#### Server → Client
- `room_created` - Room created successfully
- `player_joined` - Player joined room
- `player_left` - Player left room
- `room_list` - Available rooms
- `game_started` - Game started
- `cards_dealt` - Cards dealt to player
- `opponent_selected` - Opponent selected card
- `round_result` - Round result
- `game_finished` - Game finished
- `player_disconnected` - Player disconnected
- `player_reconnected` - Player reconnected
- `emoji_received` - Emoji received from opponent
- `error` - Error message
- `pong` - Health check response

## 🔒 Security

- JWT token authentication
- Wallet signature verification
- Rate limiting (IP + Address based)
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Monitoring

Logs are written using Winston logger to:
- Console (development)
- Files (production)

## 🐳 Docker

```bash
# Build image
docker build -t iwf-backend .

# Run container
docker run -p 5000:5000 --env-file .env iwf-backend
```

