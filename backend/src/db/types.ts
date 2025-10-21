import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

// Leaderboard Table
export interface LeaderboardTable {
  id: Generated<number>;
  address: string;
  total_points: number;
  wins: number;
  losses: number;
  draws: number;
  total_games: number;
  paid_games: number;
  last_game_at: ColumnType<Date, Date | string, Date | string> | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

// Game History Table
export interface GameHistoryTable {
  id: Generated<string>;
  room_id: string;
  player1_address: string;
  player2_address: string;
  winner_address: string | null;
  final_score_p1: number;
  final_score_p2: number;
  total_rounds: number;
  bet_amount: string; // DECIMAL stored as string
  commission: string;
  prize_amount: string;
  is_paid_game: boolean;
  game_duration_seconds: number | null;
  end_reason: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  finished_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

// Round History Table
export interface RoundHistoryTable {
  id: Generated<string>;
  game_id: string;
  round_number: number;
  player1_card_type: string;
  player1_card_value: number;
  player2_card_type: string;
  player2_card_value: number;
  winner_address: string | null;
  result: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

// Ban List Table
export interface BanListTable {
  id: Generated<number>;
  ip_address: string | null;
  wallet_address: string | null;
  banned_until: ColumnType<Date, Date | string, Date | string>;
  reason: string | null;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

// Database interface
export interface Database {
  leaderboard: LeaderboardTable;
  game_history: GameHistoryTable;
  round_history: RoundHistoryTable;
  ban_list: BanListTable;
}

// Helper types for each table
export type Leaderboard = Selectable<LeaderboardTable>;
export type NewLeaderboard = Insertable<LeaderboardTable>;
export type LeaderboardUpdate = Updateable<LeaderboardTable>;

export type GameHistory = Selectable<GameHistoryTable>;
export type NewGameHistory = Insertable<GameHistoryTable>;
export type GameHistoryUpdate = Updateable<GameHistoryTable>;

export type RoundHistory = Selectable<RoundHistoryTable>;
export type NewRoundHistory = Insertable<RoundHistoryTable>;

export type BanList = Selectable<BanListTable>;
export type NewBanList = Insertable<BanListTable>;

