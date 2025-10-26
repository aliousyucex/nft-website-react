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
  gameMode?: 'free' | 'paid' | 'single_player';
  isSinglePlayer?: boolean;
  displayLabel?: string;
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
  // Added for game completion
  winner?: string;
  finalScores?: {
    player1: number;
    player2: number;
  };
  prizeAmount?: number;
  isPaidGame?: boolean;
  reason?: string; // Reason for game end (e.g. 'both_afk', 'afk_forfeit', 'disconnect_forfeit', 'normal')
  // Added for round result display
  lastRoundResult?: RoundResult;
  roundHistory?: RoundHistoryItem[];
  // Added for backend timer sync
  roundStartTime?: number; // Server timestamp when round started
  timeLimit?: number; // Time limit in seconds
  isSinglePlayer?: boolean;
  gameMode?: 'free' | 'paid' | 'single_player';
}

export interface RoundResult {
  round: number;
  myCard: Card;
  opponentCard: Card;
  winner: string | null;
  isDraw: boolean;
  myScore: number;
  opponentScore: number;
}

export interface RoundHistoryItem {
  round: number;
  myCard: Card;
  opponentCard: Card;
  result: 'win' | 'lose' | 'draw';
}

export const EMOJIS = ['👍', '😂', '😮', '😢', '🔥'];
