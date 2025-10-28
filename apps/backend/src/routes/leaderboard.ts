import {type Request, type Response, Router } from 'express';
import leaderboardService from '../services/leaderboard';
import {AppError} from '../utils/errors';
import {validateAddress} from '../utils/validators';

const router = Router();

/**
 * GET /api/leaderboard
 * Get top players
 */
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    const players = await leaderboardService.getTopPlayers(10, 0);
    const totalPlayers = await leaderboardService.getTotalPlayerCount();

    res.json({
      data: players,
      pagination: {
        total: totalPlayers,
        totalPages: 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leaderboard/:address
 * Get player stats by address
 */
router.get('/:address', async (req: Request, res: Response, next) => {
  try {
    const {address} = req.params;

    validateAddress(address);

    const player = await leaderboardService.getPlayerStats(address);

    if (!player) {
      throw new AppError('Player not found', 404);
    }

    const rank = await leaderboardService.getPlayerRank(address);

    res.json({
      ...player,
      rank,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leaderboard/:address/rank
 * Get player rank
 */
router.get('/:address/rank', async (req: Request, res: Response, next) => {
  try {
    const {address} = req.params;

    validateAddress(address);

    const rank = await leaderboardService.getPlayerRank(address);

    if (rank === null) {
      throw new AppError('Player not found in leaderboard', 404);
    }

    res.json({rank});
  } catch (error) {
    next(error);
  }
});

export default router;
