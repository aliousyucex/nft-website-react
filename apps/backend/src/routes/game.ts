import {type Request, type Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import {AuthenticationError} from '../utils/errors';
import {validateAddress, validateRoomId} from '../utils/validators';

const router = Router();

/**
 * POST /api/game/join
 * Get JWT token for joining game
 */
router.post('/join', async (req: Request, res: Response, next) => {
  try {
    const {roomId, address} = req.body;

    validateRoomId(roomId);
    validateAddress(address);

    // Create JWT token for session
    const token = jwt.sign(
      {
        roomId,
        address,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours
      },
      config.jwt.secret
    );

    res.json({
      token,
      expiresIn: '2h',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/game/verify-session
 * Verify session token and check game state
 */
router.post('/verify-session', async (req: Request, res: Response, next) => {
  try {
    const {token, roomId} = req.body;

    if (!token) {
      throw new AuthenticationError('Token is required');
    }

    // Verify JWT
    const decoded = jwt.verify(token, config.jwt.secret) as {roomId: string, address: string};

    if (decoded.roomId !== roomId) {
      throw new AuthenticationError('Token does not match room');
    }

    // TODO: Check room state from room manager
    // For now, just return token is valid

    res.json({
      valid: true,
      address: decoded.address,
      roomId: decoded.roomId,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
});

export default router;
