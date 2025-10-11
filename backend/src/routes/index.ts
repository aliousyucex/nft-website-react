import { Router } from 'express';
import contractRoutes from './contract';
import leaderboardRoutes from './leaderboard';
import gameRoutes from './game';

const router = Router();

router.use('/contract', contractRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/game', gameRoutes);

export default router;

