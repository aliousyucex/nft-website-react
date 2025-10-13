# Ice Water Fire - Testing Guide

## Overview

This document provides instructions for running tests in the Ice Water Fire project.

## Backend Tests

### Prerequisites
- Node.js 22+
- All dependencies installed

### Running Tests

```bash
cd backend
npm install
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Test Structure

- **Room Tests** (`tests/room.test.ts`)
  - Room creation
  - Player joining/leaving
  - Room management
  - Password protection
  - Quick join functionality

- **Game Tests** (`tests/game.test.ts`)
  - Card generation
  - Winner determination
  - Game flow
  - Round tracking

### Key Test Cases

#### Room Manager
- ✅ Create room with valid parameters
- ✅ Reject invalid bet amounts
- ✅ Generate unique room IDs
- ✅ Handle password protection
- ✅ Prevent joining full rooms
- ✅ Handle player disconnection

#### Game Manager
- ✅ Generate 9 unique cards per player
- ✅ Correct type advantages (Fire > Ice, Water > Fire, Ice > Water)
- ✅ Value comparison for same types
- ✅ Draw detection
- ✅ Round win tracking
- ✅ Game end conditions

## Frontend Tests

### Prerequisites
- Node.js 22+
- All dependencies installed

### Running Tests

```bash
cd frontend
npm install
npm test
```

### Test UI (Interactive)

```bash
npm run test:ui
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Structure

- **Component Tests** (`src/components/game/IceWaterFire/components/__tests__/`)
  - Card component rendering
  - User interactions
  - Visual states (selected, disabled, opponent)

- **Hook Tests** (`src/components/game/IceWaterFire/hooks/__tests__/`)
  - Sound effects management
  - LocalStorage integration
  - Volume control

### Key Test Cases

#### Card Component
- ✅ Renders with correct type and value
- ✅ Displays correct emoji for each type
- ✅ Handles click events
- ✅ Respects disabled state
- ✅ Shows selected indicator
- ✅ Opponent card back/reveal

#### useSoundEffects Hook
- ✅ Initializes with default values
- ✅ Loads saved settings from localStorage
- ✅ Toggles sounds on/off
- ✅ Updates volume
- ✅ Respects sound enabled state

## E2E Testing (Manual)

### Test Scenarios

#### 1. Room Creation & Joining
1. Create a room with 0.01 ETH bet
2. Copy room ID
3. Open in incognito/another browser
4. Join using room ID
5. Verify both players see each other

#### 2. Game Play Flow
1. Both players click "Ready"
2. Verify game starts
3. Select cards within 5 seconds
4. Verify card reveal animation
5. Check score updates
6. Play until game ends (3 wins)

#### 3. Timer & AFK
1. Start a game
2. Don't select a card
3. Verify timer shows warning at 2 seconds
4. Verify timeout behavior

#### 4. Disconnect & Reconnect
1. Start a game
2. Close one browser tab
3. Wait 5 seconds
4. Reopen and reconnect
5. Verify game state preserved

#### 5. Sound Effects
1. Enable sounds in settings
2. Adjust volume
3. Verify sounds play for:
   - Room join
   - Ready button
   - Card selection
   - Card reveal
   - Round win/lose/draw
   - Game win/lose
   - Timer warning

#### 6. Tutorial Modal
1. Clear localStorage
2. Refresh page
3. Verify tutorial shows automatically
4. Navigate through all steps
5. Check "Don't show again" and verify it works

#### 7. Round History
1. Play multiple rounds
2. Click "History" button
3. Verify all played rounds are listed
4. Check win/lose/draw indicators

#### 8. Emoji System
1. During game, click emoji button
2. Select an emoji
3. Verify it appears on opponent's screen
4. Verify it disappears after 3 seconds

## Test Coverage Goals

- **Backend:** > 80% coverage
- **Frontend Components:** > 70% coverage
- **Frontend Hooks:** > 80% coverage

## Continuous Integration

### GitHub Actions (Future)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: cd backend && npm ci
      - run: cd backend && npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
```

## Known Limitations

1. **No Integration Tests:** Socket.IO connections are not tested end-to-end
2. **No Smart Contract Tests:** Contract tests should be added with Hardhat
3. **Limited E2E:** Manual testing required for full user flows
4. **Mock Dependencies:** Some external services are mocked

## Future Improvements

1. Add Playwright/Cypress for automated E2E tests
2. Add smart contract tests with Hardhat
3. Add WebSocket integration tests
4. Add visual regression tests
5. Add performance tests
6. Add load testing for backend

## Reporting Issues

If tests fail:
1. Check Node.js version (must be 22+)
2. Clear `node_modules` and reinstall
3. Check environment variables
4. Review test logs for specific errors
5. Report persistent failures to the development team

## Sound Files Note

⚠️ **Important:** Sound effect files must be added manually to `frontend/public/sounds/` before testing sound features. See `frontend/public/sounds/.gitkeep` for required file names and recommendations.

