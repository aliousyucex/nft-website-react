import { Router } from 'express';
import contractRoutes from './contract';
// leaderboardRoutes removed - leaderboard is managed internally, no REST API needed
// import leaderboardRoutes from './leaderboard';
// gameRoutes removed - legacy JWT-based routes, replaced by socket.io session management
// import gameRoutes from './game';

const router = Router();

router.use('/contract', contractRoutes);
// router.use('/leaderboard', leaderboardRoutes); // Removed - no frontend implementation
// router.use('/game', gameRoutes); // Removed - legacy code

export default router;

