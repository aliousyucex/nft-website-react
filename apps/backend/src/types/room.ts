import type {Card, Deck} from './card';
import type {Player} from './player';

export type GameState = 'waiting' | 'ready' | 'playing' | 'paused' | 'finished';
export type RoundResult = 'player1_win' | 'player2_win' | 'draw';

export interface RoundHistoryEntry {
  roundNumber: number;
  player1Card: Card;
  player2Card: Card;
  winner: string | null;
  result: RoundResult;
  timestamp: Date;
}

export interface Room {
  roomId: string;
  password: string | null;
  betAmount: number;
  winningScore: number;
  createdAt: Date;
  lastActivity: Date; // Track last activity for cleanup

  // Players
  players: Player[];

  // Game State
  gameState: GameState;
  currentRound: number;
  consecutiveAfkRounds: number; // Track consecutive rounds where both players AFK
  roundStartTime: number | null; // Timestamp when current round started (for timer sync)

  // Decks
  player1Deck: Deck;
  player2Deck: Deck;

  // History
  roundHistory: RoundHistoryEntry[];

  // Session Tokens
  sessionTokens: Record<string, string>;

  // Result
  winner: string | null;
  finalScore: Record<string, number> | null;
  leaderboardPoints: Record<string, number> | null;
  finishedAt: Date | null;

  // Metadata
  isPublic: boolean;
  gameMode?: 'free' | 'paid' | 'single_player';
  isSinglePlayer?: boolean;
}

export interface CreateRoomData {
  betAmount: number;
  password?: string;
  winningScore?: number;
  address: string;
  gameMode?: 'free' | 'paid' | 'single_player';
  isSinglePlayer?: boolean;
}

export interface JoinRoomData {
  roomId: string;
  password?: string;
  address: string;
}

export interface QuickJoinData {
  betAmount: number;
  address: string;
}
