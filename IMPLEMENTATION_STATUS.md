# Free Game & Single Player Implementation Status

## ✅ COMPLETED - Backend (Phase 1)

### Database Schema
- ✅ Added `is_paid_game` field to `game_history` table
- ✅ Added `paid_games` field to `leaderboard` table
- ✅ Added indexes for new fields

### Types & Services
- ✅ Updated `Room` interface with `gameMode` and `isSinglePlayer` fields
- ✅ Updated `CreateRoomData` interface
- ✅ Created `AIService` with basic strategy and crypto-themed names
- ✅ Updated `RoomManager` to handle free games and single player mode
- ✅ Added `addAIPlayer()` method to create AI opponents

### Socket Handlers - Room
- ✅ Skip balance checks for `betAmount = 0` in `create_room`
- ✅ Skip balance checks for free games in `join_room`
- ✅ Skip balance checks for free games in `quick_join`
- ✅ Added `gameMode` and `isSinglePlayer` parameters
- ✅ Updated `formatRoomData()` and `formatRoomForList()` to include display labels

### Socket Handlers - Game
- ✅ Auto-create AI player in single player mode when user clicks ready
- ✅ Skip contract deductions for free games (`betAmount = 0`)
- ✅ AI card selection with delay after player selects
- ✅ Skip contract payouts for free games in `handleGameEnd()`
- ✅ Skip leaderboard updates for free games
- ✅ Added `is_paid_game` to `saveGameHistory()`
- ✅ Updated `handleDisconnectForfeit()` to skip contracts for free games
- ✅ Updated `handleAfkForfeit()` to skip contracts for free games
- ✅ Skip AI socket notifications (filter out `ai-*` socket IDs)

### Leaderboard Service
- ✅ Track `paid_games` count separately
- ✅ Only update for paid games (called conditionally from game handlers)

## ✅ COMPLETED - Frontend Foundation (Phase 2 - Partial)

### Types
- ✅ Added `gameMode`, `isSinglePlayer`, `displayLabel` to `Room` interface
- ✅ Added `isPaidGame`, `isSinglePlayer`, `gameMode` to `GameState` interface

### Hooks
- ✅ Updated `createRoom()` to accept `gameMode` and `isSinglePlayer` parameters
- ✅ Updated `quickJoin()` to accept `isSinglePlayer` parameter

### Components
- ✅ Created `GameModeModal` component (Single Player vs Multiplayer selection)
- ✅ Updated `RoomList` to display "Practice Game" with special styling for free rooms

## 🔄 TODO - Frontend Remaining (Phase 2 - Completion)

### Main Entry Point (`index.tsx`)
- ⏳ Remove wallet requirement check - allow playing without wallet
- ⏳ Show initial choice: "Connect Wallet" or "Play Right Away"
- ⏳ "Play Right Away" opens GameModeModal
- ⏳ Keep wallet connect button visible in corner for easy upgrade

### Game Lobby (`GameLobby.tsx`)
- ⏳ Add "Practice Game" (betAmount = 0) as first bet option
- ⏳ Add Game Mode selector in Create Room modal (if wallet connected)
- ⏳ Add Game Mode selector in Quick Join modal
- ⏳ Disable paid bet options if no wallet: `<Option disabled={!address}>`
- ⏳ Show wallet connection status/prompt when needed

### Game Room (`GameRoom.tsx`)
- ⏳ Detect single player mode from `currentRoom.isSinglePlayer`
- ⏳ Show "Start" button instead of "Ready"/"Not Ready" for single player
- ⏳ Auto-start when Start is clicked (no opponent wait)
- ⏳ Show "vs AI" indicator for single player
- ⏳ Display "Practice Game" instead of bet amount for free games

### Game Board (`GameBoard.tsx`)
- ⏳ Display AI opponent name (from backend) instead of address
- ⏳ Handle AI opponent display properly
- ⏳ No major logic changes needed (backend handles AI)

### Result Modal (`ResultModal.tsx`)
- ⏳ Show "Practice Game" indicator for free games
- ⏳ Don't show prize amount for free games (or show 0 with note)
- ⏳ Add message: "Play paid games to earn ETH and climb leaderboard"

### Socket Context (`SocketContext.tsx`)
- ⏳ Allow connection without wallet address (use temporary ID)
- ⏳ Handle auth without requiring wallet

## 📋 Integration Checklist

### Testing Points
1. ⏳ Create free multiplayer room (betAmount = 0)
2. ⏳ Create single player room
3. ⏳ Join free room without wallet
4. ⏳ Play full game against AI
5. ⏳ Verify no contract calls for free games
6. ⏳ Verify leaderboard not updated for free games
7. ⏳ Verify game history saved with `is_paid_game = false`
8. ⏳ Test wallet connection mid-game
9. ⏳ Test creating paid room after playing free game

### Key Files Still Need Updates
```
frontend/src/components/game/IceWaterFire/
├── index.tsx                  - Main entry point (wallet optional)
├── pages/
│   ├── GameLobby.tsx         - Game mode selectors, free bet option
│   ├── GameRoom.tsx          - Single player UI ("Start" button)
│   └── GameBoard.tsx         - AI opponent display
├── components/
│   └── ResultModal.tsx       - Free game indicators
└── context/
    └── SocketContext.tsx     - Wallet-optional auth
```

## 🎯 Quick Start Guide for Remaining Work

### 1. Update index.tsx
```tsx
// Remove this:
if (!isConnected || !address) {
  return <WalletPromptContainer>...</WalletPromptContainer>
}

// Replace with:
const [showModeModal, setShowModeModal] = useState(false);
const [guestMode, setGuestMode] = useState(false);

// Show choice: Connect Wallet OR Play Right Away
// Play Right Away sets guestMode = true, opens GameModeModal
```

### 2. Update GameLobby.tsx
```tsx
// In Create Room Modal, add Game Mode selector:
<Select onChange={(mode) => setGameMode(mode)}>
  <Option value="single_player">Single Player</Option>
  <Option value="multiplayer">Multiplayer</Option>
</Select>

// Add Practice Game bet option:
<PresetButton onClick={() => setBetAmount(0)}>
  Practice Game (Free)
</PresetButton>
<PresetButton disabled={!address} onClick={() => setBetAmount(0.001)}>
  0.001 ETH
</PresetButton>
```

### 3. Update GameRoom.tsx
```tsx
const isSinglePlayer = currentRoom?.isSinglePlayer;
const isReady = currentPlayer?.ready || false;

// Show different button for single player:
{isSinglePlayer ? (
  <StartButton onClick={handleReady}>
    Start Game
  </StartButton>
) : (
  isReady ? <NotReadyButton>Not Ready</NotReadyButton> : <ReadyButton>Ready</ReadyButton>
)}
```

## 🔑 Key Backend API Points

### Socket Events (Already Implemented)
- `create_room` - accepts `gameMode`, `isSinglePlayer`
- `quick_join` - accepts `isSinglePlayer`
- `player_ready` - auto-creates AI for single player
- AI selects card automatically after player selects

### Room Data Format
```typescript
{
  roomId: string,
  betAmount: number,
  gameMode: 'free' | 'paid' | 'single_player',
  isSinglePlayer: boolean,
  displayLabel: 'Practice Game' | '0.001 ETH',
  // ... other fields
}
```

## 📝 Notes

- AI names: Satoshi, Vitalik, CZ, Hayden, Brian, Andre, Do Kwon, SBF (random selection)
- AI addresses: Generated from name hash (e.g., `0xSatoshi...`)
- Free games: `betAmount = 0`
- Single player rooms NOT shown in public room list
- AI selection delay: 1.5-3.5 seconds
- Database ready: Run `init.sql` to recreate tables with new fields

