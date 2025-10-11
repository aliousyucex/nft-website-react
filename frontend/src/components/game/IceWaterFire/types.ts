export type CardType = 'fire' | 'ice' | 'water';
export type CardValue = 3 | 5 | 7;

export interface Card {
  type: CardType;
  value: CardValue;
  id: string;
}

export interface Player {
  address: string;
  ready: boolean;
  roundsWon: number;
  handSize: number;
  isConnected: boolean;
  selectedCard: boolean;
}

export interface Room {
  roomId: string;
  betAmount: number;
  hasPassword: boolean;
  playerCount: number;
  players: Player[];
  gameState: 'waiting' | 'ready' | 'playing' | 'finished';
  createdAt: string;
}

export interface GameState {
  roomId: string;
  gameState: 'waiting' | 'ready' | 'playing' | 'finished';
  currentRound: number;
  myCards: Card[];
  myScore: number;
  opponentScore: number;
  opponentHandSize: number;
  selectedCard: Card | null;
  opponentSelected: boolean;
  isMyTurn: boolean;
}

export interface RoundResult {
  roundNumber: number;
  myCard: Card;
  opponentCard: Card;
  winner: string | null;
  isDraw: boolean;
  myScore: number;
  opponentScore: number;
}

export const EMOJIS = ['👍', '😂', '😮', '😢', '🔥'];

