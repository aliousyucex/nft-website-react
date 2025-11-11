import jwt from 'jsonwebtoken';
import config from '../config';
import {createFullDeck, dealCards, } from '../types/card';
import type {Player} from '../types/player';
import type {CreateRoomData, JoinRoomData, Room, } from '../types/room';
import logger from '../utils/logger';
import aiService from './ai';

// Room cleanup configuration
const ROOM_CLEANUP_THRESHOLD_MS = 60 * 1000; // 1 minute
const ROOM_CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private addressToRoom: Map<string, string> = new Map();
  private replayRoomMapping: Map<string, string> = new Map(); // oldRoomId -> newRoomId
  private roomCleanupInterval: NodeJS.Timeout;

  constructor() {
    // Start room cleanup interval (check every 30 seconds)
    this.roomCleanupInterval = setInterval(
      () => {
        this.cleanupInactiveRooms();
      },
      ROOM_CLEANUP_INTERVAL_MS
    );
  }

  /**
   * Generate unique room ID
   */
  private generateRoomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure uniqueness
    if (this.rooms.has(id)) {
      return this.generateRoomId();
    }

    return id;
  }

  /**
   * Create new room
   */
  createRoom(data: CreateRoomData, socketId: string): Room {
    const roomId = this.generateRoomId();

    // Determine game mode
    const gameMode = data.gameMode || (data.betAmount === 0 ? 'free' : 'paid');
    const isSinglePlayer = data.isSinglePlayer || false;

    const player: Player = {
      socketId,
      address: data.address.toLowerCase(),
      ready: false,
      roundsWon: 0,
      hand: [],
      selectedCard: null,
      isConnected: true,
      lastPing: new Date(),
      disconnectedAt: null,
      afkCount: 0,
    };

    const room: Room = {
      roomId,
      password: data.password || null,
      betAmount: data.betAmount,
      winningScore: data.winningScore || 3,
      createdAt: new Date(),
      lastActivity: new Date(),
      players: [player],
      gameState: 'waiting',
      currentRound: 0,
      consecutiveAfkRounds: 0,
      roundStartTime: null,
      player1Deck: {inHand: [], remaining: [], used: []},
      player2Deck: {inHand: [], remaining: [], used: []},
      roundHistory: [],
      sessionTokens: {},
      winner: null,
      finalScore: null,
      leaderboardPoints: null,
      finishedAt: null,
      isPublic: !data.password,
      gameMode,
      isSinglePlayer,
    };

    // Generate session token
    const token = this.generateSessionToken(roomId, data.address);
    room.sessionTokens[data.address.toLowerCase()] = token;

    this.rooms.set(roomId, room);
    this.socketToRoom.set(socketId, roomId);
    this.addressToRoom.set(data.address.toLowerCase(), roomId);

    logger.info('Room created', {
      roomId,
      address: data.address,
      betAmount: data.betAmount,
      gameMode,
      isSinglePlayer,
    });

    return room;
  }

  /**
   * Join existing room
   */
  joinRoom(data: JoinRoomData, socketId: string): Room {
    const room = this.rooms.get(data.roomId);

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.players.length >= 2) {
      throw new Error('Room is full');
    }

    if (room.password && room.password !== data.password) {
      throw new Error('Incorrect password');
    }

    const player: Player = {
      socketId,
      address: data.address.toLowerCase(),
      ready: false,
      roundsWon: 0,
      hand: [],
      selectedCard: null,
      isConnected: true,
      lastPing: new Date(),
      disconnectedAt: null,
      afkCount: 0,
    };

    room.players.push(player);

    // Generate session token
    const token = this.generateSessionToken(data.roomId, data.address);
    room.sessionTokens[data.address.toLowerCase()] = token;

    this.socketToRoom.set(socketId, data.roomId);
    this.addressToRoom.set(data.address.toLowerCase(), data.roomId);

    logger.info('Player joined room', {
      roomId: data.roomId,
      address: data.address,
      playerCount: room.players.length,
    });

    return room;
  }

  /**
   * Quick join - find or create room
   */
  quickJoin(betAmount: number, address: string, socketId: string, isSinglePlayer?: boolean): Room {
    // For single player, always create new room
    if (isSinglePlayer) {
      return this.createRoom(
        {
          betAmount,
          address,
          isSinglePlayer: true,
          gameMode: 'single_player',
        },
        socketId
      );
    }

    // Find available room with same bet amount (not single player rooms)
    const availableRoom = Array.from(this.rooms.values()).find(
      (room) =>
        room.betAmount === betAmount &&
        room.players.length === 1 &&
        room.isPublic &&
        room.gameState === 'waiting' &&
        !room.isSinglePlayer
    );

    if (availableRoom) {
      return this.joinRoom(
        {
          roomId: availableRoom.roomId,
          address,
        },
        socketId
      );
    }

    // Create new room
    return this.createRoom(
      {
        betAmount,
        address,
        gameMode: betAmount === 0 ? 'free' : 'paid',
      },
      socketId
    );
  }

  /**
   * Leave room
   */
  leaveRoom(socketId: string): {room: Room | null; roomId: string | null} {
    const roomId = this.socketToRoom.get(socketId);

    if (!roomId) {
      return {room: null, roomId: null};
    }

    const room = this.rooms.get(roomId);

    if (!room) {
      return {room: null, roomId: null};
    }

    // Remove player
    const playerIndex = room.players.findIndex((p) => p.socketId === socketId);

    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      this.addressToRoom.delete(player.address);
      room.players.splice(playerIndex, 1);
    }

    this.socketToRoom.delete(socketId);

    // Update lastActivity timestamp instead of deleting immediately
    room.lastActivity = new Date();

    // Don't delete room immediately - let cleanup handle it after threshold
    if (room.players.length === 0) {
      logger.info('Room emptied, will be cleaned up after threshold', {roomId});
      return {room: null, roomId};
    }

    logger.info('Player left room', {roomId, remainingPlayers: room.players.length});

    return {room, roomId};
  }

  /**
   * Delete room completely (for single player games)
   */
  deleteRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      logger.warn('Attempted to delete non-existent room', {roomId});
      return;
    }

    // Clean up all player mappings
    for (const player of room.players) {
      this.socketToRoom.delete(player.socketId);
      this.addressToRoom.delete(player.address);
    }

    // Delete the room
    this.rooms.delete(roomId);
    logger.info('Room deleted completely', {roomId, playerCount: room.players.length});
  }

  /**
   * Get available rooms (1 player, waiting)
   */
  getAvailableRooms(): Room[] {
    return Array.from(this.rooms.values()).filter(
      (room) => room.players.length === 1 && room.gameState === 'waiting' && !room.isSinglePlayer
    );
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Get room by socket ID
   */
  getRoomBySocket(socketId: string): Room | undefined {
    const roomId = this.socketToRoom.get(socketId);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  /**
   * Get room by address
   */
  getRoomByAddress(address: string): Room | undefined {
    const roomId = this.addressToRoom.get(address.toLowerCase());
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  /**
   * Set player ready
   */
  setPlayerReady(socketId: string, ready: boolean): Room | null {
    const room = this.getRoomBySocket(socketId);

    if (!room) return null;

    const player = room.players.find((p) => p.socketId === socketId);

    if (player) {
      player.ready = ready;
    }

    return room;
  }

  setPlayerNotReady(socketId: string): Room | null {
    const room = this.getRoomBySocket(socketId);

    if (!room) return null;

    const player = room.players.find((p) => p.socketId === socketId);

    if (player) {
      player.ready = false;
    }

    return room;
  }

  /**
   * Add AI player to single player room
   */
  addAIPlayer(roomId: string, aiSocketId: string): Room | null {
    const room = this.rooms.get(roomId);

    if (!room || !room.isSinglePlayer) {
      return null;
    }

    const aiName = aiService.getRandomAIName();
    const aiAddress = aiService.generateAIAddress(aiName);

    const aiPlayer: Player = {
      socketId: aiSocketId,
      address: aiAddress,
      ready: true, // AI is always ready
      roundsWon: 0,
      hand: [],
      selectedCard: null,
      isConnected: true,
      lastPing: new Date(),
      disconnectedAt: null,
      afkCount: 0,
    };

    room.players.push(aiPlayer);

    logger.info('AI player added to room', {
      roomId,
      aiName,
      aiAddress,
    });

    return room;
  }

  /**
   * Start game
   */
  startGame(roomId: string): Room | null {
    const room = this.rooms.get(roomId);

    if (!room || room.players.length !== 2) {
      return null;
    }

    // Deal cards to both players
    const fullDeck = createFullDeck();
    const player1Cards = dealCards(fullDeck);
    const player2Cards = dealCards(fullDeck);

    room.player1Deck = {
      inHand: player1Cards.hand,
      remaining: player1Cards.remaining,
      used: [],
    };

    room.player2Deck = {
      inHand: player2Cards.hand,
      remaining: player2Cards.remaining,
      used: [],
    };

    room.players[0].hand = player1Cards.hand;
    room.players[1].hand = player2Cards.hand;

    room.gameState = 'playing';
    room.currentRound = 0; // Will be incremented to 1 in processRound

    logger.info('Game started', {roomId, isSinglePlayer: room.isSinglePlayer});

    return room;
  }

  /**
   * Generate session token
   */
  private generateSessionToken(roomId: string, address: string): string {
    return jwt.sign(
      {
        roomId,
        address: address.toLowerCase(),
        timestamp: Date.now(),
      },
      config.jwt.secret,
      {expiresIn: '2h'}
    );
  }

  /**
   * Update player deck after card use
   */
  updatePlayerDeck(room: Room, playerIndex: number): void {
    // Check if game is over
    if (
      room.gameState === 'finished' ||
      room.players[0]?.roundsWon >= room.winningScore ||
      room.players[1]?.roundsWon >= room.winningScore
    ) {
      logger.info('Game finished, skipping deck update', {
        roomId: room.roomId,
        playerIndex,
      });
      return;
    }

    const deck = playerIndex === 0 ? room.player1Deck : room.player2Deck;
    const player = room.players[playerIndex];

    // Phase 1: If hand is empty but remaining has cards
    if (deck.inHand.length === 0 && deck.remaining.length > 0) {
      deck.inHand = [...deck.remaining];
      deck.remaining = [];
      player.hand = deck.inHand;

      logger.info('Dealt remaining cards to player', {
        roomId: room.roomId,
        playerIndex,
        cardsDealt: deck.inHand.length,
      });
    }
    // Phase 2: If all 9 cards used, reshuffle
    else if (deck.inHand.length === 0 && deck.remaining.length === 0 && deck.used.length > 0) {
      const shuffled = dealCards(deck.used);
      deck.inHand = shuffled.hand;
      deck.remaining = shuffled.remaining;
      deck.used = [];
      player.hand = deck.inHand;

      logger.info('Reshuffled deck for player', {
        roomId: room.roomId,
        playerIndex,
      });
    }
  }

  /**
   * Handle disconnect
   */
  handleDisconnect(socketId: string): {room: Room | null; player: Player | null} {
    const room = this.getRoomBySocket(socketId);

    if (!room) {
      return {room: null, player: null};
    }

    const player = room.players.find((p) => p.socketId === socketId);

    if (player) {
      player.isConnected = false;
      player.disconnectedAt = new Date();
    }

    return {room, player: player || null};
  }

  /**
   * Handle reconnect
   */
  handleReconnect(roomId: string, address: string, newSocketId: string): Room | null {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    const player = room.players.find((p) => p.address === address.toLowerCase());

    if (!player) return null;

    // Update socket mapping
    this.socketToRoom.delete(player.socketId);
    this.socketToRoom.set(newSocketId, roomId);

    player.socketId = newSocketId;
    player.isConnected = true;
    player.disconnectedAt = null;

    logger.info('Player reconnected', {roomId, address, newSocketId});

    return room;
  }

  /**
   * Update room activity timestamp
   */
  updateRoomActivity(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.lastActivity = new Date();
    }
  }

  /**
   * Clean up inactive rooms (run periodically)
   */
  cleanupInactiveRooms(): void {
    const now = Date.now();

    this.rooms.forEach((room, roomId) => {
      const inactiveDuration = now - room.lastActivity.getTime();

      // Delete rooms with no players that have been inactive for more than threshold
      // Only delete if game is not currently playing
      if (
        room.players.length === 0 &&
        inactiveDuration > ROOM_CLEANUP_THRESHOLD_MS &&
        room.gameState !== 'playing'
      ) {
        // Clean up all player mappings (should be empty, but be safe)
        room.players.forEach((player) => {
          this.socketToRoom.delete(player.socketId);
          this.addressToRoom.delete(player.address.toLowerCase());
        });

        // Clean up replay room mapping if this room was referenced
        this.replayRoomMapping.forEach((_newRoomId, oldRoomId) => {
          if (oldRoomId === roomId) {
            this.replayRoomMapping.delete(oldRoomId);
          }
        });

        this.rooms.delete(roomId);
        logger.info('Cleaned up inactive room', {
          roomId,
          inactiveFor: `${Math.floor(inactiveDuration / 1000)} seconds`,
          gameState: room.gameState,
        });
      }
    });
  }

  /**
   * Get replay room ID for a given old room ID
   */
  getReplayRoomId(oldRoomId: string): string | undefined {
    return this.replayRoomMapping.get(oldRoomId);
  }

  /**
   * Set replay room mapping (oldRoomId -> newRoomId)
   */
  setReplayRoomId(oldRoomId: string, newRoomId: string): void {
    this.replayRoomMapping.set(oldRoomId, newRoomId);
    logger.info('Set replay room mapping', {oldRoomId, newRoomId});
  }
}

export default new RoomManager();
