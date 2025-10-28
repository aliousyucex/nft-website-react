import type {Server, Socket} from 'socket.io';
import logger from '../utils/logger';
import {setupAuthHandlers} from './handlers/auth';
import {setupGameHandlers} from './handlers/game';
import {setupRoomHandlers} from './handlers/room';
import {rateLimitMiddleware} from './middleware/rateLimit';

export const setupSocketIO = (io: Server) => {
  logger.info('Setting up Socket.IO');

  // Apply middlewares
  io.use(rateLimitMiddleware);

  // Connection handler
  io.on('connection', (socket: Socket) => {
    logger.info('New socket connection', {socketId: socket.id, ip: socket.handshake.address});

    // Setup handlers
    setupAuthHandlers(io, socket);
    setupRoomHandlers(io, socket);
    setupGameHandlers(io, socket);

    // Ping-pong for health check
    socket.on('ping', () => {
      socket.emit('pong', {timestamp: Date.now()});
    });

    // Disconnect handler
    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected', {
        socketId: socket.id,
        reason,
      });

      // Handle player disconnect from rooms
      // This will be handled by room manager
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error('Socket error', {socketId: socket.id, error});
    });
  });

  logger.info('Socket.IO setup complete');
};
