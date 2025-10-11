import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../../config';
import logger from '../../utils/logger';

export const authMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    // Attach user data to socket
    socket.data.address = decoded.address;
    socket.data.roomId = decoded.roomId;

    logger.debug('Socket authenticated', {
      socketId: socket.id,
      address: decoded.address,
    });

    next();
  } catch (error) {
    logger.error('Socket authentication failed', { error });
    next(new Error('Invalid authentication token'));
  }
};

