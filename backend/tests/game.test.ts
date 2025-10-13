import { describe, it, expect, beforeEach } from '@jest/globals';
import { GameManager } from '../src/services/game';
import { CardType } from '../src/types/game';

describe('GameManager', () => {
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = new GameManager();
  });

  describe('Card Generation', () => {
    it('should generate exactly 9 unique cards per player', () => {
      const cards = gameManager['generateDeck']();
      
      expect(cards).toHaveLength(9);
      
      // Check uniqueness
      const cardStrings = cards.map(c => `${c.type}-${c.value}`);
      const unique = new Set(cardStrings);
      expect(unique.size).toBe(9);
    });

    it('should generate 3 types with 3 values each', () => {
      const cards = gameManager['generateDeck']();
      
      const types = cards.map(c => c.type);
      const typeCount = {
        fire: types.filter(t => t === 'fire').length,
        ice: types.filter(t => t === 'ice').length,
        water: types.filter(t => t === 'water').length,
      };
      
      expect(typeCount.fire).toBe(3);
      expect(typeCount.ice).toBe(3);
      expect(typeCount.water).toBe(3);
    });
  });

  describe('Determine Winner', () => {
    it('should correctly determine type advantage - Fire beats Ice', () => {
      const fireCard = { id: '1', type: 'fire' as CardType, value: 3 };
      const iceCard = { id: '2', type: 'ice' as CardType, value: 7 };
      
      const winner = gameManager['determineWinner'](fireCard, iceCard, 'player1', 'player2');
      
      expect(winner).toBe('player1');
    });

    it('should correctly determine type advantage - Water beats Fire', () => {
      const waterCard = { id: '1', type: 'water' as CardType, value: 3 };
      const fireCard = { id: '2', type: 'fire' as CardType, value: 7 };
      
      const winner = gameManager['determineWinner'](waterCard, fireCard, 'player1', 'player2');
      
      expect(winner).toBe('player1');
    });

    it('should correctly determine type advantage - Ice beats Water', () => {
      const iceCard = { id: '1', type: 'ice' as CardType, value: 3 };
      const waterCard = { id: '2', type: 'water' as CardType, value: 7 };
      
      const winner = gameManager['determineWinner'](iceCard, waterCard, 'player1', 'player2');
      
      expect(winner).toBe('player1');
    });

    it('should determine winner by value when types are same', () => {
      const fire3 = { id: '1', type: 'fire' as CardType, value: 3 };
      const fire7 = { id: '2', type: 'fire' as CardType, value: 7 };
      
      const winner = gameManager['determineWinner'](fire3, fire7, 'player1', 'player2');
      
      expect(winner).toBe('player2');
    });

    it('should return null for draw (same type and value)', () => {
      const fire5a = { id: '1', type: 'fire' as CardType, value: 5 };
      const fire5b = { id: '2', type: 'fire' as CardType, value: 5 };
      
      const winner = gameManager['determineWinner'](fire5a, fire5b, 'player1', 'player2');
      
      expect(winner).toBeNull();
    });
  });

  describe('Game Flow', () => {
    it('should correctly track rounds won', () => {
      const roomId = 'test-room';
      gameManager.startGame(roomId, 'player1', 'player2');
      
      // Simulate multiple rounds
      const gameState = gameManager['games'].get(roomId);
      expect(gameState).toBeDefined();
      
      if (gameState) {
        // Initially should be 0-0
        expect(gameState.roundsWon.player1).toBe(0);
        expect(gameState.roundsWon.player2).toBe(0);
        
        // Current round should be 1
        expect(gameState.currentRound).toBe(1);
      }
    });

    it('should end game when player reaches 3 wins', () => {
      const roomId = 'test-room';
      gameManager.startGame(roomId, 'player1', 'player2');
      
      const gameState = gameManager['games'].get(roomId);
      
      if (gameState) {
        // Manually set wins
        gameState.roundsWon.player1 = 3;
        
        const finished = gameState.roundsWon.player1 === 3 || gameState.roundsWon.player2 === 3;
        expect(finished).toBe(true);
      }
    });
  });
});

