-- Ice Water Fire Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  address VARCHAR(42) NOT NULL UNIQUE,
  total_points INT DEFAULT 0 NOT NULL,
  wins INT DEFAULT 0 NOT NULL,
  losses INT DEFAULT 0 NOT NULL,
  draws INT DEFAULT 0 NOT NULL,
  total_games INT DEFAULT 0 NOT NULL,
  last_game_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for leaderboard
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_address ON leaderboard(address);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wins ON leaderboard(wins DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_games ON leaderboard(total_games DESC);

-- Game History Table (optional - for replay/analytics)
CREATE TABLE IF NOT EXISTS game_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id VARCHAR(16) NOT NULL,
  player1_address VARCHAR(42) NOT NULL,
  player2_address VARCHAR(42) NOT NULL,
  winner_address VARCHAR(42),
  final_score_p1 INT NOT NULL,
  final_score_p2 INT NOT NULL,
  total_rounds INT NOT NULL,
  bet_amount DECIMAL(18, 8) NOT NULL,
  commission DECIMAL(18, 8) NOT NULL,
  prize_amount DECIMAL(18, 8) NOT NULL,
  game_duration_seconds INT,
  end_reason VARCHAR(50), -- 'normal', 'disconnect_forfeit', 'afk_forfeit', 'overtime_rule'
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  finished_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for game history
CREATE INDEX IF NOT EXISTS idx_game_history_player1 ON game_history(player1_address);
CREATE INDEX IF NOT EXISTS idx_game_history_player2 ON game_history(player2_address);
CREATE INDEX IF NOT EXISTS idx_game_history_winner ON game_history(winner_address);
CREATE INDEX IF NOT EXISTS idx_game_history_created_at ON game_history(created_at DESC);

-- Round History Table (optional - for detailed analytics)
CREATE TABLE IF NOT EXISTS round_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES game_history(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  player1_card_type VARCHAR(10) NOT NULL,
  player1_card_value INT NOT NULL,
  player2_card_type VARCHAR(10) NOT NULL,
  player2_card_value INT NOT NULL,
  winner_address VARCHAR(42),
  result VARCHAR(20) NOT NULL, -- 'player1_win', 'player2_win', 'draw'
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for round history
CREATE INDEX IF NOT EXISTS idx_round_history_game_id ON round_history(game_id);
CREATE INDEX IF NOT EXISTS idx_round_history_round_number ON round_history(round_number);

-- Ban List Table (for rate limiting)
CREATE TABLE IF NOT EXISTS ban_list (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45),
  wallet_address VARCHAR(42),
  banned_until TIMESTAMP NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for ban list
CREATE INDEX IF NOT EXISTS idx_ban_list_ip ON ban_list(ip_address, banned_until);
CREATE INDEX IF NOT EXISTS idx_ban_list_wallet ON ban_list(wallet_address, banned_until);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leaderboard
CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (development only)
-- INSERT INTO leaderboard (address, total_points, wins, losses, total_games)
-- VALUES 
--   ('0x1234567890123456789012345678901234567890', 150, 25, 5, 30),
--   ('0x2234567890123456789012345678901234567890', 120, 20, 8, 28);

-- Cleanup old ban entries (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_bans()
RETURNS void AS $$
BEGIN
  DELETE FROM ban_list WHERE banned_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE leaderboard IS 'Player leaderboard and statistics';
COMMENT ON TABLE game_history IS 'Complete game history for analytics';
COMMENT ON TABLE round_history IS 'Detailed round-by-round history';
COMMENT ON TABLE ban_list IS 'IP and wallet address bans for rate limiting';

