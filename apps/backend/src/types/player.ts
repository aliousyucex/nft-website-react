import type {Card} from './card';

export interface Player {
  socketId: string;
  address: string;
  ready: boolean;
  roundsWon: number;
  hand: Card[];
  selectedCard: Card | null;
  isConnected: boolean;
  lastPing: Date;
  disconnectedAt: Date | null;
  afkCount: number; // Track AFK timeout count
  isProcessingRound?: boolean; // Lock to prevent card selection during round processing
}

export interface PlayerStats {
  address: string;
  totalPoints: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  lastGameAt: Date | null;
}
