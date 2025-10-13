import { describe, it, expect, beforeEach } from '@jest/globals';
import { RoomManager } from '../src/services/room';

describe('RoomManager', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('createRoom', () => {
    it('should create a new room with valid parameters', () => {
      const result = roomManager.createRoom('player1', 0.01);
      
      expect(result).toBeDefined();
      expect(result.room).toBeDefined();
      expect(result.room.betAmount).toBe(0.01);
      expect(result.room.players).toHaveLength(1);
      expect(result.room.players[0].address).toBe('player1');
      expect(result.room.gameState).toBe('waiting');
    });

    it('should not allow bet amount less than minimum', () => {
      expect(() => {
        roomManager.createRoom('player1', 0.0001);
      }).toThrow();
    });

    it('should generate unique room IDs', () => {
      const room1 = roomManager.createRoom('player1', 0.01);
      const room2 = roomManager.createRoom('player2', 0.01);
      
      expect(room1.room.roomId).not.toBe(room2.room.roomId);
    });

    it('should allow creating rooms with passwords', () => {
      const result = roomManager.createRoom('player1', 0.01, 'test123');
      
      expect(result.room.password).toBe('test123');
    });
  });

  describe('joinRoom', () => {
    it('should allow second player to join', () => {
      const created = roomManager.createRoom('player1', 0.01);
      const roomId = created.room.roomId;
      
      const result = roomManager.joinRoom(roomId, 'player2');
      
      expect(result).toBeDefined();
      expect(result.room.players).toHaveLength(2);
      expect(result.room.players[1].address).toBe('player2');
    });

    it('should not allow joining non-existent room', () => {
      expect(() => {
        roomManager.joinRoom('invalid-id', 'player2');
      }).toThrow('Room not found');
    });

    it('should not allow joining full room', () => {
      const created = roomManager.createRoom('player1', 0.01);
      const roomId = created.room.roomId;
      roomManager.joinRoom(roomId, 'player2');
      
      expect(() => {
        roomManager.joinRoom(roomId, 'player3');
      }).toThrow('Room is full');
    });

    it('should not allow joining with incorrect password', () => {
      const created = roomManager.createRoom('player1', 0.01, 'secret');
      const roomId = created.room.roomId;
      
      expect(() => {
        roomManager.joinRoom(roomId, 'player2', 'wrong');
      }).toThrow('Invalid password');
    });
  });

  describe('leaveRoom', () => {
    it('should remove player from room', () => {
      const created = roomManager.createRoom('player1', 0.01);
      const roomId = created.room.roomId;
      
      const result = roomManager.leaveRoom(roomId, 'player1');
      
      expect(result).toBeDefined();
      expect(result.room).toBeNull(); // Room should be destroyed when empty
    });

    it('should not destroy room if other player remains', () => {
      const created = roomManager.createRoom('player1', 0.01);
      const roomId = created.room.roomId;
      roomManager.joinRoom(roomId, 'player2');
      
      const result = roomManager.leaveRoom(roomId, 'player2');
      
      expect(result.room).not.toBeNull();
      expect(result.room?.players).toHaveLength(1);
    });
  });

  describe('quickJoin', () => {
    it('should join existing room with same bet amount', () => {
      roomManager.createRoom('player1', 0.01);
      
      const result = roomManager.quickJoin('player2', 0.01);
      
      expect(result).toBeDefined();
      expect(result.room.players).toHaveLength(2);
    });

    it('should create new room if no suitable room found', () => {
      const result = roomManager.quickJoin('player1', 0.05);
      
      expect(result).toBeDefined();
      expect(result.room.players).toHaveLength(1);
      expect(result.room.betAmount).toBe(0.05);
    });
  });

  describe('getAvailableRooms', () => {
    it('should return only rooms with one player', () => {
      roomManager.createRoom('player1', 0.01);
      const created2 = roomManager.createRoom('player2', 0.02);
      roomManager.joinRoom(created2.room.roomId, 'player3');
      
      const available = roomManager.getAvailableRooms();
      
      expect(available).toHaveLength(1);
      expect(available[0].betAmount).toBe(0.01);
    });

    it('should not include password-protected rooms', () => {
      roomManager.createRoom('player1', 0.01, 'secret');
      
      const available = roomManager.getAvailableRooms();
      
      expect(available).toHaveLength(0);
    });
  });
});

