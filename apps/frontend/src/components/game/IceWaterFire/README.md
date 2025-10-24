# Ice Water Fire - Frontend Components

Complete UI/UX implementation for the Ice Water Fire card game.

## 📁 Structure

```
IceWaterFire/
├── index.tsx                 # Main container component
├── types.ts                  # TypeScript type definitions
├── context/
│   └── SocketContext.tsx     # Socket.IO connection management
├── hooks/
│   └── useGame.ts            # Game logic and WebSocket events
├── pages/
│   ├── GameLobby.tsx         # Main lobby (create/join/quick join)
│   ├── GameRoom.tsx          # Waiting room (ready screen)
│   └── GameBoard.tsx         # Main game screen (playing)
└── components/
    ├── Card.tsx              # Card component with animations
    ├── CardHand.tsx          # Player's hand (oval layout)
    ├── PlayerInfo.tsx        # Player information display
    ├── RoomList.tsx          # Available rooms list
    └── ResultModal.tsx       # Round/Game result modals
```

## 🎨 Features

### GameLobby
- ✅ 3 action cards (Create Room, Find Room, Quick Join)
- ✅ Live room list with auto-refresh
- ✅ Bet amount presets (0.001, 0.01, 0.1 ETH)
- ✅ Password protected rooms
- ✅ Responsive grid layout

### GameRoom
- ✅ Room ID display with copy functionality
- ✅ Share link generation
- ✅ Waiting animation with loading dots
- ✅ Player vs Player display
- ✅ Ready button system
- ✅ Game starting overlay
- ✅ How to play instructions

### GameBoard
- ✅ Split screen layout (opponent top, player bottom)
- ✅ Real-time score display
- ✅ Round counter
- ✅ 5-second countdown timer
- ✅ Card selection with hover effects
- ✅ Opponent card backs animation
- ✅ Emoji reaction system
- ✅ Selection indicators

### Card Component
- ✅ Fire/Ice/Water types with unique colors
- ✅ Hover animation (lift up)
- ✅ Selected state with checkmark
- ✅ Card back for opponent
- ✅ Smooth transitions

### CardHand Component
- ✅ Oval layout (poker/batak style)
- ✅ Dynamic card positioning (1-9 cards)
- ✅ Rotation based on position
- ✅ Z-index on hover

## 🎮 Usage

### Basic Integration

```tsx
import IceWaterFireGame from './components/game/IceWaterFire';

function App() {
  const userAddress = '0x123...'; // From wallet connection

  return (
    <IceWaterFireGame
      userAddress={userAddress}
      onDisconnect={() => console.log('Game disconnected')}
    />
  );
}
```

### With Wallet Connection

```tsx
import { useAccount } from 'wagmi'; // or your wallet library
import IceWaterFireGame from './components/game/IceWaterFire';

function GamePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  return <IceWaterFireGame userAddress={address!} />;
}
```

## 🔌 Socket.IO Integration

### Events Emitted (Client → Server)

```typescript
// Create room
socket.emit('create_room', {
  betAmount: 0.01,
  password: 'optional',
  address: '0x123...'
});

// Join room
socket.emit('join_room', {
  roomId: 'ABC12345',
  password: 'optional',
  address: '0x123...'
});

// Quick join
socket.emit('quick_join', {
  betAmount: 0.01,
  address: '0x123...'
});

// Player ready
socket.emit('player_ready');

// Select card
socket.emit('select_card', {
  cardId: 'fire_5'
});

// Send emoji
socket.emit('send_emoji', {
  emojiId: '🔥'
});
```

### Events Received (Server → Client)

```typescript
// Room created
socket.on('room_created', (data) => {
  console.log('Room ID:', data.roomId);
});

// Player joined
socket.on('player_joined', (data) => {
  console.log('Player count:', data.playerCount);
});

// Game started
socket.on('game_started', () => {
  // Switch to game board
});

// Cards dealt
socket.on('cards_dealt', (data) => {
  console.log('Cards:', data.cards);
});

// Opponent selected
socket.on('opponent_selected', (data) => {
  console.log('Opponent selected:', data.hasSelected);
});

// Round result
socket.on('round_result', (data) => {
  console.log('Winner:', data.winner);
  console.log('Score:', data.myScore, '-', data.opponentScore);
});

// Game finished
socket.on('game_finished', (data) => {
  console.log('Winner:', data.winner);
  console.log('Prize:', data.prizeAmount);
});
```

## 🎨 Styling

All components use `styled-components` with:
- Gradient backgrounds
- Glassmorphism effects (backdrop-filter blur)
- Smooth transitions and animations
- Responsive breakpoints
- Hover/active states

### Theme Colors

```typescript
const colors = {
  fire: '#FF6B6B',
  ice: '#4ECDC4',
  water: '#45B7D1',
  success: '#2ECC71',
  error: '#E74C3C',
  warning: '#F39C12',
  primary: '#3498DB',
};
```

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop (1920x980) */
@media (min-width: 1281px) { }

/* Laptop (1280x720) */
@media (max-width: 1280px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }
```

### Touch Controls

Mobile users can:
- Tap cards to select
- Swipe up to select (optional)
- Tap emoji button for reactions

## 🔧 Customization

### Change Card Design

Edit `components/Card.tsx`:

```tsx
const getCardIcon = (type: CardType['type']) => {
  switch (type) {
    case 'fire': return '🔥'; // Change emoji
    case 'ice': return '❄️';
    case 'water': return '💧';
  }
};

const getCardColor = (type: CardType['type']) => {
  switch (type) {
    case 'fire': return '#FF6B6B'; // Change color
    case 'ice': return '#4ECDC4';
    case 'water': return '#45B7D1';
  }
};
```

### Add More Emojis

Edit `types.ts`:

```tsx
export const EMOJIS = ['👍', '😂', '😮', '😢', '🔥', '💪', '🎉'];
```

### Change Timer Duration

Edit `pages/GameBoard.tsx`:

```tsx
const [timeRemaining, setTimeRemaining] = useState(10); // 10 seconds
```

## 🐛 Troubleshooting

### Socket Connection Issues

```tsx
// Check Socket.IO connection
import { useSocket } from './context/SocketContext';

const { socket, isConnected, error } = useSocket();

console.log('Connected:', isConnected);
console.log('Error:', error);
```

### Cards Not Displaying

Ensure backend is sending correct format:

```json
{
  "cards": [
    { "id": "fire_3", "type": "fire", "value": 3 },
    { "id": "fire_5", "type": "fire", "value": 5 }
  ]
}
```

### Animations Not Working

Check if styled-components is properly installed:

```bash
npm install styled-components @types/styled-components
```

## 📦 Dependencies

```json
{
  "styled-components": "^6.1.8",
  "socket.io-client": "^4.7.2",
  "antd": "^5.11.1",
  "ethers": "^6.9.0"
}
```

## 🚀 Next Steps

1. **Add Animations**: Integrate GSAP or Framer Motion
2. **Sound Effects**: Add audio for card selection, win/lose
3. **Tutorial Modal**: First-time user onboarding
4. **Loading States**: Better loading UI
5. **Error Boundaries**: Catch and display errors gracefully
6. **Testing**: Add unit and integration tests

## 📝 TODOs

- [ ] Add tutorial modal
- [ ] Implement sound effects
- [ ] Add GSAP animations for card reveal
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Implement i18n (multi-language)

## 🆘 Support

For issues:
1. Check browser console for errors
2. Verify Socket.IO connection
3. Check backend logs
4. Open an issue on GitHub

## 📄 License

MIT License

