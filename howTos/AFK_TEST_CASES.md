# AFK Control System - Test Cases

## Test Suite Overview
Comprehensive test cases for validating AFK detection, handling, and penalty systems across different game modes and scenarios.

---

## Test Category 1: Single Player AFK Detection

### TC-AFK-001: Single Round AFK in Multiplayer
**Objective:** Verify player going AFK for one round receives warning and auto-card-selection

**Preconditions:**
- Two players in room (Player A and Player B)
- Game in 'playing' state
- Round has started (timer running)

**Test Steps:**
1. Player A selects card within timeout
2. Player B does not select card before timeout expires
3. Wait for card selection timeout (10 seconds)

**Expected Results:**
- Player B receives `afk_warning` event
- Player B's `afkCount` incremented to 1
- Random card automatically selected from Player B's hand
- Round processes normally with both cards
- `room.consecutiveAfkRounds` remains 0 (only one player AFK)
- Game continues to next round

**Assertions:**
```javascript
assert(playerB.afkCount === 1)
assert(playerB.selectedCard !== null)
assert(afkWarningReceived === true)
assert(room.consecutiveAfkRounds === 0)
```

---

### TC-AFK-002: Consecutive AFK by Same Player
**Objective:** Verify repeated AFK by single player leads to forfeit

**Preconditions:**
- Two players in active game
- Player A has been AFK in previous rounds (afkCount >= threshold)

**Test Steps:**
1. Start new round
2. Player B selects card
3. Player A does not select card (again)
4. Wait for timeout

**Expected Results:**
- Player A forfeits game
- Player B declared winner
- `game_finished` event with reason 'afk_forfeit'
- Paid game: Payout processed to Player B
- Free game: No payout, but game ends
- Leaderboard updated (if paid game)

**Assertions:**
```javascript
assert(gameState === 'finished')
assert(winner === playerB.address)
assert(endReason === 'afk_forfeit')
assert(gameHistorySaved === true)
```

---

### TC-AFK-003: AFK Player Returns to Activity
**Objective:** Verify player can recover from AFK status

**Preconditions:**
- Player has afkCount = 1 from previous round

**Test Steps:**
1. Start new round
2. Player selects card before timeout
3. Verify card selection accepted

**Expected Results:**
- Player's `afkCount` reset to 0
- Card selection processed normally
- No AFK warnings emitted
- Player continues playing normally

**Assertions:**
```javascript
assert(player.afkCount === 0)
assert(player.selectedCard === selectedCard)
assert(afkWarningEmitted === false)
```

---

## Test Category 2: Both Players AFK

### TC-AFK-004: Both Players AFK - First Occurrence
**Objective:** Verify warning issued when both players AFK in same round

**Preconditions:**
- Two players in active game
- Room has `consecutiveAfkRounds` = 0

**Test Steps:**
1. Start new round
2. Neither player selects card
3. Wait for timeout to expire

**Expected Results:**
- Both players receive `both_afk_warning` event
- Random cards auto-selected for both players
- Both players' `afkCount` incremented
- `room.consecutiveAfkRounds` incremented to 1
- Warning message: "Both players were AFK! One more time and the game will be dismissed."
- Round processes with auto-selected cards
- Game continues

**Assertions:**
```javascript
assert(player1.afkCount === 1)
assert(player2.afkCount === 1)
assert(room.consecutiveAfkRounds === 1)
assert(bothAfkWarningReceived === true)
assert(player1.selectedCard !== null)
assert(player2.selectedCard !== null)
assert(gameState === 'playing')
```

---

### TC-AFK-005: Both Players AFK - Second Consecutive Occurrence (Room Dismissal)
**Objective:** Verify room dismissed and bets forfeited when both AFK twice

**Preconditions:**
- `room.consecutiveAfkRounds` = 1 (both were AFK in previous round)
- Both players in active game

**Test Steps:**
1. Start new round
2. Neither player selects card
3. Wait for timeout

**Expected Results:**
- `room_dismissed_afk` event emitted to both players
- Message: "Both players were repeatedly AFK. Room dismissed and bets forfeited."
- Game ended with `gameService.endGame(room, null, 'both_afk')`
- No winner declared (winner = null)
- Bet amounts NOT refunded (penalty)
- Both players removed from room
- Room destroyed/cleaned up
- No leaderboard updates

**Assertions:**
```javascript
assert(winner === null)
assert(endReason === 'both_afk')
assert(roomDismissalEventReceived === true)
assert(betRefunded === false)
assert(roomExists === false)
assert(leaderboardUpdated === false)
```

---

### TC-AFK-006: Both AFK Then One Player Active (Reset)
**Objective:** Verify consecutive AFK counter resets when at least one player active

**Preconditions:**
- `room.consecutiveAfkRounds` = 1
- Both players in game

**Test Steps:**
1. Start new round
2. Player A selects card
3. Player B does not select (AFK)
4. Wait for timeout

**Expected Results:**
- Player B gets AFK warning and auto-selection
- `room.consecutiveAfkRounds` reset to 0
- Game continues normally
- No room dismissal warning

**Assertions:**
```javascript
assert(room.consecutiveAfkRounds === 0)
assert(playerB.afkCount === 2)
assert(playerA.afkCount === 0) // or previous value
assert(gameState === 'playing')
```

---

## Test Category 3: Game Mode Specific Tests

### TC-AFK-007: AFK in Free Multiplayer Game
**Objective:** Verify AFK handling in free (0 bet) game

**Preconditions:**
- Room with betAmount = 0
- Two players active

**Test Steps:**
1. Player A goes AFK repeatedly until forfeit
2. Observe forfeit handling

**Expected Results:**
- Forfeit processed normally
- Player B declared winner
- NO contract payout called (free game)
- NO leaderboard update
- Game history saved with forfeit reason
- `isPaidGame` flag = false in events

**Assertions:**
```javascript
assert(winner === playerB.address)
assert(contractPayoutCalled === false)
assert(leaderboardUpdated === false)
assert(isPaidGame === false)
assert(gameHistory.outcome === 'afk_forfeit')
```

---

### TC-AFK-008: AFK in Paid Multiplayer Game (Opponent Ahead)
**Objective:** Verify AFK handling in paid game when opponent is ahead

**Preconditions:**
- Room with betAmount > 0
- Both players deposited bets
- Game active with Player B ahead (e.g., score 2-1)

**Test Steps:**
1. Player A goes AFK twice (afkCount reaches 2)
2. Observe all side effects

**Expected Results:**
- Forfeit processed
- Player B wins
- Contract payout called: `processAfkForfeitPayout(playerB, playerA, betAmount, true)`
- Player B receives 60% of pot (betAmount * 2 * 0.6)
- 40% remains in contract as penalty
- Leaderboard updated (Player B +win, Player A +loss)
- Game history saved
- `isPaidGame` flag = true
- `isRefund` flag = false

**Assertions:**
```javascript
assert(contractService.processAfkForfeitPayout.called === true)
assert(leaderboardService.updateAfterGame.called === true)
assert(winner === playerB.address)
assert(prizeAmount === betAmount * 2 * 0.6)
assert(isPaidGame === true)
assert(isRefund === false)
```

---

### TC-AFK-008B: AFK in Paid Multiplayer Game (Opponent Not Ahead)
**Objective:** Verify AFK handling in paid game when opponent is not ahead

**Preconditions:**
- Room with betAmount > 0
- Both players deposited bets
- Game active with scores tied or Player A ahead (e.g., score 1-1 or 2-1 in A's favor)

**Test Steps:**
1. Player A goes AFK twice (afkCount reaches 2)
2. Observe all side effects

**Expected Results:**
- Forfeit processed
- Player B declared winner (but not ahead in score)
- Contract payout called: `processAfkForfeitPayout(playerB, playerA, betAmount, false)`
- Both players refunded their bets
- No winner payout (only refunds)
- Leaderboard updated (Player B +win, Player A +loss)
- Game history saved
- `isPaidGame` flag = true
- `isRefund` flag = true

**Assertions:**
```javascript
assert(contractService.processAfkForfeitPayout.called === true)
assert(refundCalled === true)
assert(winner === playerB.address)
assert(prizeAmount === 0) // No winner prize, just refund
assert(isPaidGame === true)
assert(isRefund === true)
assert(playerARefunded === betAmount)
assert(playerBRefunded === betAmount)
```

---

### TC-AFK-009: AFK in Single Player Mode (vs AI)
**Objective:** Verify AFK detection when playing against AI

**Preconditions:**
- Room with `isSinglePlayer` = true
- One human player, one AI player
- Game active

**Test Steps:**
1. Human player does not select card
2. Wait for timeout
3. Observe AI continues playing

**Expected Results:**
- Human player receives AFK warning
- Random card auto-selected for human
- AI always selects card (never AFK)
- Round processes normally
- If human repeatedly AFK: forfeit to AI
- No notifications sent to AI (socketId starts with 'ai-')

**Assertions:**
```javascript
assert(humanPlayer.selectedCard !== null) // auto-selected
assert(aiPlayer.selectedCard !== null) // AI always selects
assert(notificationToAI === false)
assert(gameState === 'playing' || endReason === 'afk_forfeit')
```

---

## Test Category 4: Edge Cases and Race Conditions

### TC-AFK-010: Player Selects Card Just Before Timeout
**Objective:** Verify card selection at last moment cancels AFK

**Preconditions:**
- Game active, timer running

**Test Steps:**
1. Wait until 0.5 seconds before timeout
2. Player selects card
3. Wait for timeout period to complete

**Expected Results:**
- Card selection accepted
- NO AFK warning
- `afkCount` reset to 0
- Normal round processing
- Timeout cleared

**Assertions:**
```javascript
assert(player.selectedCard === selectedCard)
assert(player.afkCount === 0)
assert(afkWarningReceived === false)
```

---

### TC-AFK-011: Game Ends During AFK Timeout Period
**Objective:** Verify AFK logic doesn't trigger after game over

**Preconditions:**
- Game active, one player needs 1 more round to win
- Timer running for current round

**Test Steps:**
1. Both players select cards
2. Round processes, game ends (winner determined)
3. Timeout expires after game end

**Expected Results:**
- Game ends normally
- AFK timeout cleared
- NO AFK warnings after game end
- `game_finished` event with normal win reason

**Assertions:**
```javascript
assert(gameState === 'finished')
assert(endReason !== 'afk_forfeit')
assert(afkTimeoutCleared === true)
```

---

### TC-AFK-012: Player Disconnects During AFK Timeout
**Objective:** Verify disconnection handled separately from AFK

**Preconditions:**
- Player in game, timer running
- Player hasn't selected card

**Test Steps:**
1. Player disconnects before timeout expires
2. Observe handling

**Expected Results:**
- Disconnection handler triggered (not AFK handler)
- `handleDisconnectForfeit()` called instead
- Opponent wins by disconnection, not AFK
- Different event/reason code
- Room cleanup handled by disconnect logic

**Assertions:**
```javascript
assert(endReason === 'disconnect' || endReason === 'opponent_disconnected')
assert(endReason !== 'afk_forfeit')
assert(disconnectHandlerCalled === true)
```

---

### TC-AFK-013: Multiple Rapid Card Selections (Anti-Spam)
**Objective:** Verify system handles rapid selection attempts

**Preconditions:**
- Player in active round

**Test Steps:**
1. Player rapidly sends multiple `select_card` events
2. Try to select different cards quickly

**Expected Results:**
- Only first valid selection accepted
- Subsequent selections rejected or ignored
- `afkCount` reset only once
- No duplicate processing

**Assertions:**
```javascript
assert(player.selectedCard === firstSelection)
assert(selectCardCallCount === 1) // processed once
assert(player.afkCount === 0)
```

---

## Test Category 5: Timer and Synchronization

### TC-AFK-014: Frontend Timer Accuracy During AFK
**Objective:** Verify frontend timer continues during AFK handling

**Preconditions:**
- Game active, frontend timer running

**Test Steps:**
1. Monitor frontend timer updates
2. Let timeout expire (player AFK)
3. Observe timer behavior during auto-selection

**Expected Results:**
- Timer continues updating (no pause)
- Timer reaches 0 naturally
- Auto-selection happens at 0
- Timer resets for next round
- No visual freezing

**Assertions:**
```javascript
assert(timerPaused === false)
assert(finalTimerValue === 0)
assert(timerResetForNextRound === true)
```

---

### TC-AFK-015: Backend-Frontend Timer Sync with AFK
**Objective:** Verify timer stays synchronized across AFK events

**Preconditions:**
- Backend sends roundStartTime + timeLimit
- Frontend calculates remaining time

**Test Steps:**
1. Start round
2. Player goes AFK
3. Check timer sync at auto-selection moment

**Expected Results:**
- Frontend timer matches backend timeout
- Auto-selection occurs at correct time
- No drift or desync
- Next round starts with fresh synchronized timer

**Assertions:**
```javascript
const expectedTimeout = roundStartTime + timeLimit;
const actualTimeout = Date.now();
assert(Math.abs(expectedTimeout - actualTimeout) < 100) // within 100ms
```

---

## Test Category 6: Persistence and Recovery

### TC-AFK-016: AFK Count Persistence Across Rounds
**Objective:** Verify afkCount persists correctly between rounds

**Preconditions:**
- Player with afkCount = 1

**Test Steps:**
1. Complete round normally (player active)
2. Start new round
3. Check afkCount value

**Expected Results:**
- afkCount reset to 0 when player is active
- afkCount persists if player remains AFK
- Correct count affects forfeit threshold

**Assertions:**
```javascript
// If player active:
assert(player.afkCount === 0)
// If player AFK again:
assert(player.afkCount === 2)
```

---

### TC-AFK-017: Room State After AFK-Related Cleanup
**Objective:** Verify clean room state after AFK dismissal

**Preconditions:**
- Room dismissed due to both players AFK

**Test Steps:**
1. Trigger room dismissal
2. Check room manager state
3. Verify player states

**Expected Results:**
- Room removed from active rooms
- Players removed from room
- No dangling references
- Timeout cleared
- Can create new room with same players

**Assertions:**
```javascript
assert(roomManager.getRoom(roomId) === null)
assert(roomManager.getRoomBySocket(socketId) === null)
assert(selectionTimeouts.has(roomId) === false)
```

---

## Test Category 7: Integration Tests

### TC-AFK-018: Full Game with Intermittent AFK
**Objective:** End-to-end test with realistic AFK patterns

**Preconditions:**
- Full game setup (2 players, paid game)

**Test Steps:**
1. Round 1: Both play normally
2. Round 2: Player A AFK
3. Round 3: Both play normally
4. Round 4: Player A AFK again
5. Round 5: Player A AFK third time (forfeit)

**Expected Results:**
- Rounds 1, 3: Normal gameplay
- Rounds 2, 4: Player A receives warnings, auto-selection
- Round 5: Player A forfeits, Player B wins
- Payout processed correctly
- Complete game history recorded
- Leaderboard updated accurately

**Assertions:**
```javascript
assert(totalRounds <= 5)
assert(winner === playerB.address)
assert(playerA.afkCount >= 3)
assert(gameHistory.afkWarnings === 3)
assert(payoutProcessed === true)
```

---

### TC-AFK-019: AFK with Score Tracking
**Objective:** Verify scores update correctly through AFK rounds

**Preconditions:**
- Active game, score tracking enabled

**Test Steps:**
1. Play several rounds with one player occasionally AFK
2. Track score updates
3. Verify final scores

**Expected Results:**
- Scores update after each round (including AFK rounds)
- Auto-selected cards count towards score
- Final scores accurate
- Score displayed in UI correctly during AFK

**Assertions:**
```javascript
assert(myScore + opponentScore === completedRounds)
assert(scoresMatchGameState === true)
assert(uiScoresAccurate === true)
```

---

## Test Execution Priority

**Priority 1 (Critical):**
- TC-AFK-001, TC-AFK-002, TC-AFK-004, TC-AFK-005, TC-AFK-008, TC-AFK-008B

**Priority 2 (High):**
- TC-AFK-003, TC-AFK-006, TC-AFK-007, TC-AFK-009, TC-AFK-011

**Priority 3 (Medium):**
- TC-AFK-010, TC-AFK-012, TC-AFK-014, TC-AFK-015, TC-AFK-018

**Priority 4 (Low):**
- TC-AFK-013, TC-AFK-016, TC-AFK-017, TC-AFK-019

---

## Test Environment Setup

### Required:
- Backend server with test configuration
- Socket.io test clients
- Mock contract service (for paid games)
- Test database
- Timer mocking capability

### Test Data:
- Test player addresses
- Various bet amounts (0, 0.001, 0.1, 1)
- Test room configurations

### Monitoring:
- Backend logs
- Socket event capture
- Database queries
- Timer precision measurements

---

## Automated Test Example (Jest/Mocha)

```javascript
describe('AFK Control System', () => {
  describe('Single Player AFK', () => {
    it('should warn player and auto-select card when AFK', async () => {
      // Setup
      const room = await createTestRoom();
      const [player1, player2] = await joinTwoPlayers(room);
      await startGame(room);
      
      // Test
      await player1.selectCard('fire_3');
      // player2 doesn't select
      await waitForTimeout(10000);
      
      // Assert
      expect(player2.afkCount).toBe(1);
      expect(player2.selectedCard).not.toBeNull();
      expect(player2.receivedEvent('afk_warning')).toBe(true);
      expect(room.consecutiveAfkRounds).toBe(0);
    });
  });
  
  describe('Both Players AFK', () => {
    it('should dismiss room on second consecutive both-AFK', async () => {
      const room = await createTestRoom();
      const [player1, player2] = await joinTwoPlayers(room);
      await startGame(room);
      
      // First both-AFK
      await waitForTimeout(10000); // neither selects
      expect(room.consecutiveAfkRounds).toBe(1);
      
      // Second both-AFK
      await waitForTimeout(10000); // neither selects again
      
      // Assert dismissal
      expect(player1.receivedEvent('room_dismissed_afk')).toBe(true);
      expect(player2.receivedEvent('room_dismissed_afk')).toBe(true);
      expect(await getRoomById(room.id)).toBeNull();
    });
  });
});
```

---

## Manual Testing Checklist

- [ ] Single player AFK warning appears correctly
- [ ] Auto-selected card animation works
- [ ] Both players AFK warning displays
- [ ] Room dismissal modal shows with correct message
- [ ] Timer continues running during AFK handling
- [ ] Scores update correctly after AFK rounds
- [ ] Game result modal shows forfeit correctly
- [ ] Sound effects play for AFK warnings
- [ ] UI doesn't freeze during AFK timeout
- [ ] Leaderboard updates correctly after AFK games

---

## Known Issues / Future Improvements

1. **Grace Period:** Consider adding 1-2 second grace period for network lag
2. **Reconnection:** Handle player reconnection during AFK timeout
3. **Warning Levels:** Progressive warnings (yellow -> red) as timeout approaches
4. **AFK Forgiveness:** Reset afkCount after X active rounds
5. **Analytics:** Track AFK rates per player for pattern detection

