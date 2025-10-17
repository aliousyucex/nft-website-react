import { db } from '../db/connection';
import { NewLeaderboard, LeaderboardUpdate } from '../db/types';
import logger from '../utils/logger';

export class LeaderboardService {
  /**
   * Get top players from leaderboard
   */
  async getTopPlayers(limit: number = 100, offset: number = 0) {
    try {
      const players = await db
        .selectFrom('leaderboard')
        .select([
          'address',
          'total_points as totalPoints',
          'wins',
          'losses',
          'draws',
          'total_games as totalGames',
        ])
        .orderBy('total_points', 'desc')
        .limit(limit)
        .offset(offset)
        .execute();

      return players;
    } catch (error) {
      logger.error('Error getting top players:', error);
      throw error;
    }
  }

  /**
   * Get player stats by address
   */
  async getPlayerStats(address: string) {
    try {
      const player = await db
        .selectFrom('leaderboard')
        .select([
          'address',
          'total_points as totalPoints',
          'wins',
          'losses',
          'draws',
          'total_games as totalGames',
        ])
        .where('address', '=', address.toLowerCase())
        .executeTakeFirst();

      return player || null;
    } catch (error) {
      logger.error('Error getting player stats:', error);
      throw error;
    }
  }

  /**
   * Get player rank
   */
  async getPlayerRank(address: string): Promise<number | null> {
    try {
      const result = await db
        .selectFrom('leaderboard')
        .select((eb) => [
          eb.fn.count<number>('id').as('rank')
        ])
        .where('total_points', '>', (eb) => 
          eb.selectFrom('leaderboard')
            .select('total_points')
            .where('address', '=', address.toLowerCase())
        )
        .executeTakeFirst();

      return result ? Number(result.rank) + 1 : null;
    } catch (error) {
      logger.error('Error getting player rank:', error);
      throw error;
    }
  }

  /**
   * Update leaderboard after game
   * Points: 3-0 = 7pts, 3-1 = 5pts, 3-2 = 3pts
   */
  async updateAfterGame(
    winnerAddress: string,
    loserAddress: string,
    finalScore: { winner: number; loser: number }
  ) {
    try {
      let points = 0;
      if (finalScore.winner === 3 && finalScore.loser === 0) points = 7;
      else if (finalScore.winner === 3 && finalScore.loser === 1) points = 5;
      else if (finalScore.winner === 3 && finalScore.loser === 2) points = 3;

      // Update winner
      await db
        .insertInto('leaderboard')
        .values({
          address: winnerAddress.toLowerCase(),
          total_points: points,
          wins: 1,
          losses: 0,
          draws: 0,
          total_games: 1,
          last_game_at: new Date(),
        })
        .onConflict((oc) =>
          oc.column('address').doUpdateSet((eb) => ({
            total_points: eb('leaderboard.total_points', '+', points),
            wins: eb('leaderboard.wins', '+', 1),
            total_games: eb('leaderboard.total_games', '+', 1),
            last_game_at: new Date(),
          }))
        )
        .execute();

      // Update loser
      await db
        .insertInto('leaderboard')
        .values({
          address: loserAddress.toLowerCase(),
          total_points: 0,
          wins: 0,
          losses: 1,
          draws: 0,
          total_games: 1,
          last_game_at: new Date(),
        })
        .onConflict((oc) =>
          oc.column('address').doUpdateSet((eb) => ({
            losses: eb('leaderboard.losses', '+', 1),
            total_games: eb('leaderboard.total_games', '+', 1),
            last_game_at: new Date(),
          }))
        )
        .execute();

      logger.info('Leaderboard updated', { winnerAddress, loserAddress, points });
    } catch (error) {
      logger.error('Error updating leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get total player count
   */
  async getTotalPlayerCount(): Promise<number> {
    try {
      const result = await db
        .selectFrom('leaderboard')
        .select((eb) => eb.fn.count<number>('id').as('count'))
        .limit(10)
        .executeTakeFirst();

      return Number(result?.count || 0);
    } catch (error) {
      logger.error('Error getting total player count:', error);
      throw error;
    }
  }
}

export default new LeaderboardService();

