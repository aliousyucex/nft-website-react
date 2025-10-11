import { Server, Socket } from 'socket.io';
import roomManager from '../../services/room';
import contractService from '../../services/contract';
import logger from '../../utils/logger';
import { SocketErrorCode } from '../../utils/errors';
import { checkAddressRateLimit } from '../middleware/rateLimit';
import { validateAddress, validateBetAmount, validateRoomPassword, validateRoomId } from '../../utils/validators';

export const setupRoomHandlers = (io: Server, socket: Socket) => {
  /**
   * Create new room
   */
  socket.on('create_room', async (data, callback) => {
    try {
      const { betAmount, password, address, signature } = data;

      // Validate
      validateAddress(address);
      validateBetAmount(betAmount);
      if (password) validateRoomPassword(password);

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded. Please try again later',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Verify user has sufficient balance
      const userBalance = await contractService.getUserBalance(address);
      if (parseFloat(userBalance) < betAmount) {
        return callback({
          success: false,
          error: 'Insufficient balance',
          code: SocketErrorCode.INSUFFICIENT_BALANCE,
        });
      }

      // Create room
      const room = roomManager.createRoom(
        {
          betAmount,
          password,
          address,
        },
        socket.id
      );

      // Join socket room
      socket.join(room.roomId);

      logger.info('Room created', { roomId: room.roomId, address });

      callback({
        success: true,
        room: {
          roomId: room.roomId,
          betAmount: room.betAmount,
          hasPassword: !!room.password,
          playerCount: room.players.length,
          players: room.players,
          gameState: room.gameState,
          createdAt: room.createdAt.toISOString(),
        },
        sessionToken: room.sessionTokens[address.toLowerCase()],
      });

      // Broadcast updated room list
      io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
    } catch (error) {
      logger.error('Error creating room', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create room',
      });
    }
  });

  /**
   * Join room
   */
  socket.on('join_room', async (data, callback) => {
    try {
      const { roomId, password, address } = data;

      // Validate
      validateRoomId(roomId);
      validateAddress(address);

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Verify user has sufficient balance
      const room = roomManager.getRoom(roomId);
      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.ROOM_NOT_FOUND,
        });
      }

      const userBalance = await contractService.getUserBalance(address);
      if (parseFloat(userBalance) < room.betAmount) {
        return callback({
          success: false,
          error: 'Insufficient balance',
          code: SocketErrorCode.INSUFFICIENT_BALANCE,
        });
      }

      // Join room
      const joinedRoom = roomManager.joinRoom(
        {
          roomId,
          password,
          address,
        },
        socket.id
      );

      // Join socket room
      socket.join(roomId);

      logger.info('Player joined room', { roomId, address });

      callback({
        success: true,
        room: {
          roomId: joinedRoom.roomId,
          betAmount: joinedRoom.betAmount,
          hasPassword: !!joinedRoom.password,
          playerCount: joinedRoom.players.length,
          players: joinedRoom.players,
          gameState: joinedRoom.gameState,
          createdAt: joinedRoom.createdAt.toISOString(),
        },
        sessionToken: joinedRoom.sessionTokens[address.toLowerCase()],
      });

      // Notify other players
      socket.to(roomId).emit('player_joined', {
        address,
        playerCount: joinedRoom.players.length,
        room: {
          roomId: joinedRoom.roomId,
          betAmount: joinedRoom.betAmount,
          hasPassword: !!joinedRoom.password,
          playerCount: joinedRoom.players.length,
          players: joinedRoom.players,
          gameState: joinedRoom.gameState,
          createdAt: joinedRoom.createdAt.toISOString(),
        },
      });

      // Broadcast updated room list
      io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
    } catch (error) {
      logger.error('Error joining room', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join room',
      });
    }
  });

  /**
   * Quick join
   */
  socket.on('quick_join', async (data, callback) => {
    try {
      const { betAmount, address } = data;

      // Validate
      validateAddress(address);
      validateBetAmount(betAmount);

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Verify user has sufficient balance
      const userBalance = await contractService.getUserBalance(address);
      if (parseFloat(userBalance) < betAmount) {
        return callback({
          success: false,
          error: 'Insufficient balance',
          code: SocketErrorCode.INSUFFICIENT_BALANCE,
        });
      }

      // Quick join
      const room = roomManager.quickJoin(betAmount, address, socket.id);

      // Join socket room
      socket.join(room.roomId);

      logger.info('Quick join', { roomId: room.roomId, address });

      callback({
        success: true,
        room: {
          roomId: room.roomId,
          betAmount: room.betAmount,
          hasPassword: !!room.password,
          playerCount: room.players.length,
          players: room.players,
          gameState: room.gameState,
          createdAt: room.createdAt.toISOString(),
        },
        sessionToken: room.sessionTokens[address.toLowerCase()],
      });

      // If room now has 2 players, notify
      if (room.players.length === 2) {
        socket.to(room.roomId).emit('player_joined', {
          address,
          playerCount: room.players.length,
          room: {
            roomId: room.roomId,
            betAmount: room.betAmount,
            hasPassword: !!room.password,
            playerCount: room.players.length,
            players: room.players,
            gameState: room.gameState,
            createdAt: room.createdAt.toISOString(),
          },
        });
      }

      // Broadcast updated room list
      io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
    } catch (error) {
      logger.error('Error quick joining', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to quick join',
      });
    }
  });

  /**
   * Leave room
   */
  socket.on('leave_room', (callback) => {
    try {
      const { room, roomId } = roomManager.leaveRoom(socket.id);

      if (roomId) {
        socket.leave(roomId);
      }

      if (room && roomId) {
        // Notify other players
        socket.to(roomId).emit('player_left', {
          remainingPlayers: room.players.length,
        });
      }

      logger.info('Player left room', { roomId });

      callback({ success: true });

      // Broadcast updated room list
      io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
    } catch (error) {
      logger.error('Error leaving room', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to leave room',
      });
    }
  });

  /**
   * Get available rooms
   */
  socket.on('get_rooms', (callback) => {
    try {
      const rooms = roomManager.getAvailableRooms().map(formatRoomForList);
      callback({ success: true, rooms });
    } catch (error) {
      logger.error('Error getting rooms', error);
      callback({
        success: false,
        error: 'Failed to get rooms',
      });
    }
  });

  /**
   * Reconnect to room
   */
  socket.on('reconnect_to_room', async (data, callback) => {
    try {
      const { roomId, address, sessionToken } = data;

      validateRoomId(roomId);
      validateAddress(address);

      // Verify session token
      // TODO: Implement JWT verification

      const room = roomManager.handleReconnect(roomId, address, socket.id);

      if (!room) {
        return callback({
          success: false,
          error: 'Failed to reconnect',
        });
      }

      // Join socket room
      socket.join(roomId);

      // Notify other players
      socket.to(roomId).emit('player_reconnected', { address });

      callback({
        success: true,
        room: {
          roomId: room.roomId,
          gameState: room.gameState,
          currentRound: room.currentRound,
          players: room.players.map((p) => ({
            address: p.address,
            roundsWon: p.roundsWon,
            handSize: p.hand.length,
            ready: p.ready,
            isConnected: p.isConnected,
          })),
        },
      });
    } catch (error) {
      logger.error('Error reconnecting', error);
      callback({
        success: false,
        error: 'Reconnection failed',
      });
    }
  });
};

/**
 * Format room for public list
 */
function formatRoomForList(room: any) {
  return {
    roomId: room.roomId,
    betAmount: room.betAmount,
    hasPassword: !!room.password,
    playerCount: room.players.length,
    createdAt: room.createdAt,
  };
}

