import type {Server, Socket} from 'socket.io';
import contractService from '../../services/contract';
import roomManager from '../../services/room';
import type {Player} from '../../types/player';
import type {Room} from '../../types/room';
import {SocketErrorCode} from '../../utils/errors';
import logger from '../../utils/logger';
import {
  validateAddress,
  validateBetAmount,
  validateRoomId,
  validateRoomPassword,
} from '../../utils/validators';
import {checkAddressRateLimit} from '../middleware/rateLimit';
import {requireWalletVerification} from '../middleware/walletVerification';
import {handleDisconnectForfeit} from './game';

export const setupRoomHandlers = (io: Server, socket: Socket) => {
  /**
   * Create new room
   */
  socket.on('create_room', async (data, callback) => {
    try {
      const {betAmount, password, address, gameMode, isSinglePlayer} = data;

      // Validate
      validateAddress(address);
      validateBetAmount(betAmount);
      if (password) validateRoomPassword(password);

      // Verify wallet (session-based: only need to sign once on connection)
      if (!requireWalletVerification(socket, address, callback)) {
        return; // Error already sent via callback
      }

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded. Please try again later',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Skip balance check for free games (betAmount = 0)
      if (betAmount > 0) {
        const userBalance = await contractService.getUserBalance(address);
        if (parseFloat(userBalance) < betAmount) {
          return callback({
            success: false,
            error: 'Insufficient balance',
            code: SocketErrorCode.INSUFFICIENT_BALANCE,
          });
        }
      }

      // Create room
      const room = roomManager.createRoom(
        {
          betAmount,
          password,
          address,
          gameMode,
          isSinglePlayer,
        },
        socket.id
      );

      // Join socket room
      socket.join(room.roomId);

      logger.info('Room created', {
        roomId: room.roomId,
        address,
        gameMode: room.gameMode,
        isSinglePlayer: room.isSinglePlayer,
      });

      callback({
        success: true,
        room: formatRoomData(room),
        sessionToken: room.sessionTokens[address.toLowerCase()],
      });

      // Broadcast updated room list (only non-single-player rooms)
      if (!room.isSinglePlayer) {
        io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
      }
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
      const {roomId, password, address} = data;

      // Validate
      validateRoomId(roomId);

      // Update room activity
      roomManager.updateRoomActivity(roomId);
      validateAddress(address);

      // Verify wallet (session-based: only need to sign once on connection)
      if (!requireWalletVerification(socket, address, callback)) {
        return; // Error already sent via callback
      }

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Get room first
      const room = roomManager.getRoom(roomId);
      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.ROOM_NOT_FOUND,
        });
      }

      // Skip balance check for free games (betAmount = 0)
      if (room.betAmount > 0) {
        const userBalance = await contractService.getUserBalance(address);
        if (parseFloat(userBalance) < room.betAmount) {
          return callback({
            success: false,
            error: 'Insufficient balance',
            code: SocketErrorCode.INSUFFICIENT_BALANCE,
          });
        }
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

      logger.info('Player joined room', {roomId, address});

      callback({
        success: true,
        room: formatRoomData(joinedRoom),
        sessionToken: joinedRoom.sessionTokens[address.toLowerCase()],
      });

      // Notify other players
      socket.to(roomId).emit('player_joined', {
        address,
        playerCount: joinedRoom.players.length,
        room: formatRoomData(joinedRoom),
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
      const {betAmount, address, isSinglePlayer} = data;

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

      // Skip balance check for free games (betAmount = 0)
      if (betAmount > 0) {
        const userBalance = await contractService.getUserBalance(address);
        if (parseFloat(userBalance) < betAmount) {
          return callback({
            success: false,
            error: 'Insufficient balance',
            code: SocketErrorCode.INSUFFICIENT_BALANCE,
          });
        }
      }

      // Quick join
      const room = roomManager.quickJoin(betAmount, address, socket.id, isSinglePlayer);

      // Update room activity
      roomManager.updateRoomActivity(room.roomId);

      // Join socket room
      socket.join(room.roomId);

      logger.info('Quick join', {
        roomId: room.roomId,
        address,
        isSinglePlayer: room.isSinglePlayer,
      });

      callback({
        success: true,
        room: formatRoomData(room),
        sessionToken: room.sessionTokens[address.toLowerCase()],
      });

      // If room now has 2 players, notify
      if (room.players.length === 2 && !room.isSinglePlayer) {
        socket.to(room.roomId).emit('player_joined', {
          address,
          playerCount: room.players.length,
          room: formatRoomData(room),
        });
      }

      // Broadcast updated room list (only non-single-player rooms)
      if (!room.isSinglePlayer) {
        io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
      }
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
  socket.on('leave_room', async (_data, callback) => {
    try {
      // Get room info BEFORE removing player
      const roomBeforeLeave = roomManager.getRoomBySocket(socket.id);
      const roomIdBeforeLeave = roomBeforeLeave?.roomId;

      logger.info('Player attempting to leave room', {
        socketId: socket.id,
        roomId: roomIdBeforeLeave,
        playersBefore: roomBeforeLeave?.players.length,
        gameState: roomBeforeLeave?.gameState,
        isSinglePlayer: roomBeforeLeave?.isSinglePlayer,
      });

      // Handle playing state BEFORE removing player
      if (roomBeforeLeave?.gameState === 'playing') {
        const leavingPlayer = roomBeforeLeave.players.find((p) => p.socketId === socket.id);
        
        if (leavingPlayer) {
          logger.info('Player leaving during active game', {
            roomId: roomIdBeforeLeave,
            isSinglePlayer: roomBeforeLeave.isSinglePlayer,
            playerAddress: leavingPlayer.address,
          });

          if (roomBeforeLeave.isSinglePlayer) {
            // Single player: Just delete the room completely
            logger.info('Single player: destroying room');
            roomManager.deleteRoom(roomIdBeforeLeave!);
            
            // Leave socket room
            if (roomIdBeforeLeave) {
              socket.leave(roomIdBeforeLeave);
            }
            
            logger.info('Single player room destroyed');
            
            if (callback && typeof callback === 'function') {
              callback({success: true});
            }
            
            // Broadcast updated room list
            io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
            return; // Exit early
          // biome-ignore lint/style/noUselessElse: <explanation>
          } else {
            // Multiplayer: Use existing disconnect forfeit mechanism
            logger.info('Multiplayer: processing forfeit');
            await handleDisconnectForfeit(io, roomBeforeLeave, leavingPlayer.address);
            logger.info('Multiplayer forfeit processed');
          }
        }
      }

      // Normal leave room flow (for non-playing state or after multiplayer forfeit)
      const {room, roomId} = roomManager.leaveRoom(socket.id);

      // Leave the socket room FIRST, before broadcasting events
      // This ensures the leaving player doesn't receive the player_left event
      if (roomId) {
        socket.leave(roomId);
      }

      if (room && roomIdBeforeLeave && room.gameState !== 'playing') {
        // If only 1 player remains, reset their ready state
        if (room.players.length === 1) {
          room.players[0].ready = false;
          logger.info('Reset remaining player ready state', {
            roomId: roomIdBeforeLeave,
            playerAddress: room.players[0].address,
          });
        }

        const roomData = formatRoomData(room);

        logger.info('Broadcasting player_left to room', {
          roomId: roomIdBeforeLeave,
          remainingPlayers: room.players.length,
        });

        // Use io.to() to broadcast to ALL sockets in the room (excluding the leaving player)
        // Since we already called socket.leave(), the leaving player won't receive this
        io.to(roomIdBeforeLeave).emit('player_left', {
          remainingPlayers: room.players.length,
          room: roomData,
        });

        // Also send room_updated to remaining players
        io.to(roomIdBeforeLeave).emit('room_updated', {
          room: roomData,
        });
      }

      logger.info('Player left room complete', {roomId, remainingPlayers: room?.players.length});

      if (callback && typeof callback === 'function') {
        callback({success: true});
      }

      // Broadcast updated room list (only if not in playing state, as forfeit handler will handle it)
      if (roomBeforeLeave?.gameState !== 'playing') {
        io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
      }
    } catch (error) {
      logger.error('Error leaving room', error);
      if (callback && typeof callback === 'function') {
        callback({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to leave room',
        });
      }
    }
  });

  /**
   * Play again - rejoin or create new room
   */
  socket.on('play_again', async (data, callback) => {
    try {
      const {oldRoomId, address} = data;

      validateAddress(address);

      // Check rate limit
      if (!checkAddressRateLimit(address)) {
        return callback({
          success: false,
          error: 'Rate limit exceeded',
          code: SocketErrorCode.RATE_LIMIT_EXCEEDED,
        });
      }

      // Get the old room to check bet amount and game mode
      const oldRoom = oldRoomId ? roomManager.getRoom(oldRoomId) : null;
      const betAmount = oldRoom?.betAmount || 0;
      const isPaidGame = betAmount > 0;
      const isSinglePlayer = oldRoom?.isSinglePlayer || false;

      // For paid games, check balance first
      if (isPaidGame) {
        const userBalance = await contractService.getUserBalance(address);
        if (parseFloat(userBalance) < betAmount) {
          return callback({
            success: false,
            error: 'Insufficient balance',
            code: SocketErrorCode.INSUFFICIENT_BALANCE,
          });
        }
      }

      // Check if replay room already exists (other player created it)
      let targetRoomId: string | undefined;
      if (oldRoomId) {
        targetRoomId = roomManager.getReplayRoomId(oldRoomId);
      }

      let targetRoom: Room | undefined;

      if (targetRoomId) {
        // Replay room exists, try to join it
        targetRoom = roomManager.getRoom(targetRoomId);
        if (targetRoom && targetRoom.players.length < 2 && targetRoom.gameState === 'waiting') {
          // Room exists and has space, join it
          try {
            const joinedRoom = roomManager.joinRoom(
              {
                roomId: targetRoomId,
                address,
              },
              socket.id
            );

            socket.join(targetRoomId);
            roomManager.updateRoomActivity(targetRoomId);

            logger.info('Player joined replay room', {
              oldRoomId,
              newRoomId: targetRoomId,
              address,
            });

            callback({
              success: true,
              room: formatRoomData(joinedRoom),
              sessionToken: joinedRoom.sessionTokens[address.toLowerCase()],
            });

            // Notify other players
            socket.to(targetRoomId).emit('player_joined', {
              address,
              playerCount: joinedRoom.players.length,
              room: formatRoomData(joinedRoom),
            });

            // Broadcast updated room list
            io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
            return;
          } catch (error) {
            logger.warn('Failed to join replay room, will create new one', {
              targetRoomId,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            // Fall through to create new room
          }
        }
      }

      // No replay room exists or couldn't join, create new room
      // Check if original room still exists and is active
      if (oldRoom && oldRoom.players.length < 2 && oldRoom.gameState === 'waiting') {
        // Original room is still active, rejoin it
        try {
          const joinedRoom = roomManager.joinRoom(
            {
              roomId: oldRoomId!,
              address,
            },
            socket.id
          );

          socket.join(oldRoomId!);
          roomManager.updateRoomActivity(oldRoomId!);

          logger.info('Player rejoined original room', {
            roomId: oldRoomId,
            address,
          });

          callback({
            success: true,
            room: formatRoomData(joinedRoom),
            sessionToken: joinedRoom.sessionTokens[address.toLowerCase()],
          });

          // Notify other players
          socket.to(oldRoomId!).emit('player_joined', {
            address,
            playerCount: joinedRoom.players.length,
            room: formatRoomData(joinedRoom),
          });

          // Broadcast updated room list
          io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
          return;
        } catch (error) {
          logger.warn('Failed to rejoin original room, will create new one', {
            oldRoomId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          // Fall through to create new room
        }
      }

      // Create new room
      const newRoom = roomManager.createRoom(
        {
          betAmount,
          address,
          gameMode: isSinglePlayer ? 'single_player' : betAmount === 0 ? 'free' : 'paid',
          isSinglePlayer,
        },
        socket.id
      );

      // Set replay room mapping if old room existed
      if (oldRoomId) {
        roomManager.setReplayRoomId(oldRoomId, newRoom.roomId);
      }

      socket.join(newRoom.roomId);
      roomManager.updateRoomActivity(newRoom.roomId);

      logger.info('Player created new room for replay', {
        oldRoomId,
        newRoomId: newRoom.roomId,
        address,
      });

      callback({
        success: true,
        room: formatRoomData(newRoom),
        sessionToken: newRoom.sessionTokens[address.toLowerCase()],
      });

      // Broadcast updated room list
      io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
    } catch (error) {
      logger.error('Error handling play again', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to play again',
      });
    }
  });

  /**
   * Get available rooms
   */
  socket.on('get_rooms', (_data, callback) => {
    try {
      const rooms = roomManager.getAvailableRooms().map(formatRoomForList);
      if (callback && typeof callback === 'function') {
        callback({success: true, rooms});
      }
    } catch (error) {
      logger.error('Error getting rooms', error);
      if (callback && typeof callback === 'function') {
        callback({
          success: false,
          error: 'Failed to get rooms',
        });
      }
    }
  });

  /**
   * Reconnect to room
   */
  socket.on('reconnect_to_room', async (data, callback) => {
    try {
      const {roomId, address} = data;

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
      socket.to(roomId).emit('player_reconnected', {address});

      // Send full room state with properly formatted players
      const roomData = formatRoomData(room);

      // Send room_updated and reconnect_success to the reconnected player
      socket.emit('room_updated', {room: roomData});
      socket.emit('reconnect_success', {room: roomData});

      // If game is playing, send current game state
      if (room.gameState === 'playing') {
        const player = room.players.find((p) => p.address.toLowerCase() === address.toLowerCase());
        const opponent = room.players.find(
          (p) => p.address.toLowerCase() !== address.toLowerCase()
        );

        if (player) {
          // Send complete game state for full recovery
          socket.emit('game_state_reconnect', {
            currentRound: room.currentRound,
            myCards: player.hand,
            myScore: player.roundsWon,
            opponentScore: opponent?.roundsWon || 0,
            opponentHandSize: opponent?.hand?.length || 0,
            selectedCard: player.selectedCard || null,
            opponentSelected: !!opponent?.selectedCard,
            roundHistory: room.roundHistory || [],
            roomId: room.roomId,
            // Timer sync data
            roundStartTime: room.roundStartTime || Date.now(),
            timeLimit: 10, // From config
          });

          logger.info('Sent full reconnect game state', {
            roomId,
            address,
            currentRound: room.currentRound,
            playerScore: player.roundsWon,
            opponentScore: opponent?.roundsWon,
            hasSelectedCard: !!player.selectedCard,
            opponentSelected: !!opponent?.selectedCard,
          });
        }
      }

      callback({
        success: true,
        room: roomData,
      });

      logger.info('Player reconnected successfully', {
        roomId,
        address,
        gameState: room.gameState,
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
export function formatRoomForList(room: Room) {
  return {
    roomId: room.roomId,
    betAmount: room.betAmount,
    hasPassword: !!room.password,
    playerCount: room.players.length,
    createdAt: room.createdAt,
    gameMode: room.gameMode || (room.betAmount === 0 ? 'free' : 'paid'),
    isSinglePlayer: room.isSinglePlayer || false,
    displayLabel: room.betAmount === 0 ? 'Practice Game' : `${room.betAmount} ETH`,
  };
}

/**
 * Format player for frontend
 */
export function formatPlayer(player: Player) {
  return {
    address: player.address,
    ready: player.ready,
    roundsWon: player.roundsWon,
    handSize: player.hand?.length || 0,
    isConnected: player.isConnected,
    selectedCard: !!player.selectedCard,
  };
}

/**
 * Format room with full data for frontend
 */
export function formatRoomData(room: Room) {
  return {
    roomId: room.roomId,
    betAmount: room.betAmount,
    hasPassword: !!room.password,
    playerCount: room.players.length,
    players: room.players.map(formatPlayer),
    gameState: room.gameState,
    createdAt: room.createdAt.toISOString(),
    gameMode: room.gameMode || (room.betAmount === 0 ? 'free' : 'paid'),
    isSinglePlayer: room.isSinglePlayer || false,
    displayLabel: room.betAmount === 0 ? 'Practice Game' : `${room.betAmount} ETH`,
  };
}
