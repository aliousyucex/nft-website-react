# AFK Control System Documentation

## Overview
The AFK (Away From Keyboard) control system ensures fair gameplay by detecting inactive players and taking appropriate actions to maintain game flow and prevent abuse.

## Implementation Details

### Backend Components

#### 1. Player AFK Tracking (`backend/src/socket/handlers/game.ts`)

**Player AFK Counter:**
- Each player has an `afkCount` property
- Reset to 0 when player selects a card (line 263)
- Incremented when player fails to select within timeout

**Room Consecutive AFK Tracking:**
- Each room tracks `consecutiveAfkRounds` 
- Incremented when both players are AFK in the same round
- Reset to 0 when at least one player is active (line 576-577, 617)

### AFK Detection Flow

#### Phase 1: Card Selection Timeout
**Location:** `startSelectionTimeout()` function (lines 453-593)

1. **Timer Start:**
   - Timeout begins when round starts
   - Duration: `config.game.cardSelectionTimeout` (typically 10 seconds)
   - Timer stored in `selectionTimeouts` Map

2. **Timeout Trigger:**
   - When timer expires, check each player's selected card status
   - Players without selected cards are flagged as AFK

3. **Auto-Selection for AFK Players:**
   ```javascript
   // Lines 504-538
   for (let i = 0; i < room.players.length; i++) {
     const player = room.players[i];
     if (!player.selectedCard && player.hand.length > 0) {
       // Increment AFK count
       player.afkCount = (player.afkCount || 0) + 1;
       
       // Auto-select random card from hand
       const randomIndex = Math.floor(Math.random() * player.hand.length);
       const randomCard = player.hand[randomIndex];
       player.selectedCard = randomCard;
       
       // Notify player of auto-selection
       io.to(player.socketId).emit('afk_warning', {
         message: 'You took too long! A random card was played for you.',
         afkCount: player.afkCount,
         autoSelectedCard: randomCard,
       });
     }
   }
   ```

4. **Check for Forfeit (afkCount >= 2):**
   ```javascript
   // Lines 540-555
   for (let i = 0; i < room.players.length; i++) {
     const player = room.players[i];
     
     if (player.afkCount >= 2) {
       // Trigger forfeit with conditional payout
       await handleAfkForfeitWithConditionalPayout(io, room, player.address);
       return; // Exit early - game has ended
     }
   }
   ```
   - If any player reaches afkCount of 2, game immediately ends
   - Forfeit handler called with conditional payout logic
   - No further round processing

#### Phase 2: Both Players AFK Handling
**Location:** Lines 536-578

1. **Detection:**
   - Check if both players had no card selected before timeout
   - Increment `room.consecutiveAfkRounds`

2. **First Warning (consecutiveAfkRounds = 1):**
   ```javascript
   // Lines 571-574
   io.to(room.roomId).emit('both_afk_warning', {
     message: 'Both players were AFK! Random cards were played. One more time and the game will be dismissed.',
     consecutiveAfkRounds: room.consecutiveAfkRounds,
   });
   ```

3. **Room Dismissal (consecutiveAfkRounds >= 2):**
   ```javascript
   // Lines 545-568
   // Notify both players
   io.to(room.roomId).emit('room_dismissed_afk', {
     message: 'Both players were repeatedly AFK. Room dismissed and bets forfeited.',
   });
   
   // End game without winner (both forfeit)
   gameService.endGame(room, null, 'both_afk');
   
   // Clean up room
   room.players.forEach(p => {
     roomManager.leaveRoom(p.socketId);
   });
   ```
   - Bet amounts remain in contract (penalty for both players)
   - No winner declared
   - Room is destroyed

#### Phase 3: Single Player AFK Forfeit with Conditional Payout
**Location:** `handleAfkForfeitWithConditionalPayout()` function (lines 981-1069)

**Trigger Conditions:**
- Player's `afkCount` reaches 2 (checked after auto-selection in timeout handler)
- Triggered immediately when threshold is reached

**Forfeit Process:**
1. **Identify Players:**
   ```javascript
   const opponent = room.players.find((p: any) => p.address !== afkAddress);
   const afkPlayer = room.players.find((p: any) => p.address === afkAddress);
   const opponentIsAhead = opponent.roundsWon > afkPlayer.roundsWon;
   ```

2. **Handle Conditional Payouts (Paid Games Only):**
   ```javascript
   if (isPaidGame) {
     await contractService.processAfkForfeitPayout(
       opponent.address, 
       afkAddress, 
       room.betAmount,
       opponentIsAhead
     );
   }
   ```
   
   **Payout Logic:**
   - **If opponent is ahead** (opponent.roundsWon > afkPlayer.roundsWon):
     - Opponent receives 60% of total pot (room.betAmount * 2 * 0.6)
     - 40% remains in contract as penalty
   - **If opponent is NOT ahead** (opponent.roundsWon <= afkPlayer.roundsWon):
     - Both players get their bets refunded
     - No winner payout

   **Rationale:** Prevents abuse while being fair. If AFK player was winning/tied, active player gets refund. If active player was already winning, they get reward for their performance.

3. **End Game:**
   - Opponent declared winner
   - Reason: 'afk_forfeit'
   - Leaderboard updated (paid games only)
   - Game history saved

4. **Notify Players:**
   ```javascript
   io.to(player.socketId).emit('game_finished', {
     winner: opponent.address.toLowerCase(),
     reason: 'afk_forfeit',
     myScore: player.roundsWon,
     opponentScore: opp.roundsWon,
     prizeAmount: player.address === opponent.address ? payout.winnerAmount : 0,
     isRefund: isPaidGame && !opponentIsAhead,
     isPaidGame,
   });
   ```

### Round Processing and AFK Reset
**Location:** `processRound()` function (lines 609-716)

When both players actively select cards:
```javascript
// Lines 616-617
// Reset consecutive AFK counter since both players actively selected cards
room.consecutiveAfkRounds = 0;
```

### Active Card Selection
**Location:** 'select_card' handler (lines 204-342)

When player selects a card:
```javascript
// Line 263
player.afkCount = 0; // Reset AFK count
```

## Game Mode Specific Behavior

### Multiplayer Games (Paid & Free)
- Both players subject to AFK detection
- Consecutive AFK by both = room dismissal
- Single player AFK = forfeit to opponent
- Bets handled according to game type

### Single Player (vs AI)
- Only human player tracked for AFK
- AI always plays (never AFK)
- Human player AFK = automatic forfeit
- Always free games (no bets involved)

## Edge Cases Handled

1. **Disconnection vs AFK:**
   - Separate handling via `handleDisconnectForfeit()` (lines 803-879)
   - Disconnection treated differently from voluntary AFK

2. **Game Already Over:**
   - Card selection check (lines 232-239) prevents AFK logic when game complete

3. **AI Players:**
   - Skip notifications for AI (lines 929)
   - AI sockets start with 'ai-' prefix

4. **Free vs Paid Games:**
   - Contract payouts only for paid games
   - Leaderboard updates only for paid games
   - Same AFK detection for both

## Timing Configuration

**Card Selection Timeout:**
- Configured in `backend/src/config/index.ts`
- Default: Usually 10 seconds
- Affects `gameState.timeLimit` sent to frontend

**Frontend Timer:**
- Synced with backend timestamp
- Updates every 100ms for smooth countdown
- Warning at 3 seconds remaining (visual + audio)

## Events Emitted

### Client → Server
- `select_card` - Player selects card (resets AFK count)
- `player_ready` - Player ready in room (tracks activity)

### Server → Client
- `afk_warning` - Single player was AFK, card auto-selected
- `both_afk_warning` - Both players AFK (first warning)
- `room_dismissed_afk` - Both players repeatedly AFK (room dismissed)
- `game_finished` - Game ended (includes 'afk_forfeit' reason)
- `opponent_selected` - Opponent selected card (shows they're active)

## Database Integration

**Game History:**
- AFK games saved with reason field
- Tracked in `game_history` table
- Includes final scores and outcome reason

**Leaderboard:**
- Forfeit losses count as losses
- Forfeit wins count as wins
- Only paid games affect leaderboard

## Monitoring and Logging

All AFK events are logged with context:
```javascript
logger.info('Card selected', { roomId, address, cardId });
logger.warn('Both players AFK', { roomId, consecutiveAfkRounds });
logger.info('AFK payout processed for paid game');
```

## Prevention of Abuse

1. **Immediate Penalty:**
   - Random card auto-play prevents strategic AFKing
   - Player loses control of card selection

2. **Escalation:**
   - First AFK: Warning + random card
   - Repeated AFK: Forfeit game
   - Both AFK twice: Room dismissed + bets forfeited

3. **Financial Deterrent:**
   - Paid games: Forfeit loses bet amount
   - Both AFK: Both lose bets (no refund)

4. **No Exploitation:**
   - Cannot "pause" game
   - Cannot "wait out" opponent
   - Must actively participate

## Room Activity Tracking

**Location:** `backend/src/services/room.ts`

Additional activity tracking:
- `updateRoomActivity(roomId)` called on card selection
- Prevents cleanup of active rooms
- Separate from AFK detection (for cleanup purposes)

## Summary of AFK Flow (Updated Implementation)

### Single Player AFK:
1. **First AFK (afkCount = 1):**
   - Warning message sent
   - Random card auto-selected
   - Game continues

2. **Second AFK (afkCount = 2):**
   - Game ends with forfeit
   - Opponent declared winner
   - **Conditional Payout (Paid Games):**
     - If opponent ahead: 60% payout to opponent, 40% penalty
     - If opponent not ahead: Both players refunded
   - **Free Games:** No payout, opponent still wins

### Both Players AFK:
1. **First Occurrence (consecutiveAfkRounds = 1):**
   - Both get warning
   - Both get random cards auto-selected
   - Game continues

2. **Second Consecutive Occurrence (consecutiveAfkRounds = 2):**
   - Room dismissed
   - No winner
   - Both players forfeit bets (no refund)
   - Room destroyed

### AFK Recovery:
- When player actively selects card: `afkCount` reset to 0
- When at least one player active: `consecutiveAfkRounds` reset to 0
- Player can recover from first AFK without penalty

### Key Benefits of Conditional Payout:
1. **Prevents Abuse:** AFK player can't force opponent to lose money if they were winning
2. **Rewards Performance:** Active player who was ahead gets compensation
3. **Fair Refunds:** If AFK player was winning/tied, both get money back
4. **Penalty for Repeat Offenders:** 40% stays in contract when opponent was ahead

