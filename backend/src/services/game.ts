import { Room, RoundResult, RoundHistoryEntry } from '../types/room';
import { Card, CARD_ADVANTAGES } from '../types/card';
import logger from '../utils/logger';

export class GameService {
  /**
   * Determine round winner
   */
  determineRoundWinner(
    card1: Card,
    card2: Card,
    player1Address: string,
    player2Address: string
  ): {
    winner: string | null;
    result: RoundResult;
    isDraw: boolean;
  } {
    // Check for exact match (draw)
    if (card1.type === card2.type && card1.value === card2.value) {
      return {
        winner: null,
        result: 'draw',
        isDraw: true,
      };
    }

    // Check type advantage
    if (CARD_ADVANTAGES[card1.type] === card2.type) {
      // Player 1 wins
      return {
        winner: player1Address,
        result: 'player1_win',
        isDraw: false,
      };
    }

    if (CARD_ADVANTAGES[card2.type] === card1.type) {
      // Player 2 wins
      return {
        winner: player2Address,
        result: 'player2_win',
        isDraw: false,
      };
    }

    // Same type, compare values
    if (card1.type === card2.type) {
      if (card1.value > card2.value) {
        return {
          winner: player1Address,
          result: 'player1_win',
          isDraw: false,
        };
      } else if (card2.value > card1.value) {
        return {
          winner: player2Address,
          result: 'player2_win',
          isDraw: false,
        };
      }
      // Same value (should not happen as we checked above, but safety)
      return {
        winner: null,
        result: 'draw',
        isDraw: true,
      };
    }

    // Should never reach here
    logger.error('Invalid card comparison', { card1, card2 });
    return {
      winner: null,
      result: 'draw',
      isDraw: true,
    };
  }

  /**
   * Process card selection
   */
  processCardSelection(room: Room, card1: Card, card2: Card): {
    winner: string | null;
    result: RoundResult;
    isDraw: boolean;
    gameOver: boolean;
    gameWinner: string | null;
    roundHistory: RoundHistoryEntry;
  } {
    const player1 = room.players[0];
    const player2 = room.players[1];

    // Determine round winner
    const roundResult = this.determineRoundWinner(
      card1,
      card2,
      player1.address,
      player2.address
    );

    // Create history entry
    const historyEntry: RoundHistoryEntry = {
      roundNumber: room.currentRound,
      player1Card: card1,
      player2Card: card2,
      winner: roundResult.winner,
      result: roundResult.result,
      timestamp: new Date(),
    };

    room.roundHistory.push(historyEntry);

    // Move cards to used pile
    room.player1Deck.used.push(card1);
    room.player2Deck.used.push(card2);

    // Remove cards from hands
    player1.hand = player1.hand.filter((c) => c.id !== card1.id);
    player2.hand = player2.hand.filter((c) => c.id !== card2.id);

    room.player1Deck.inHand = player1.hand;
    room.player2Deck.inHand = player2.hand;

    // Update scores (if not draw)
    let gameOver = false;
    let gameWinner: string | null = null;

    if (!roundResult.isDraw) {
      if (roundResult.winner === player1.address) {
        player1.roundsWon++;
        if (player1.roundsWon >= room.winningScore) {
          gameOver = true;
          gameWinner = player1.address;
        }
      } else if (roundResult.winner === player2.address) {
        player2.roundsWon++;
        if (player2.roundsWon >= room.winningScore) {
          gameOver = true;
          gameWinner = player2.address;
        }
      }
    }

    // Check for max round limit (15 rounds)
    if (!gameOver && room.currentRound >= 15) {
      gameOver = true;
      
      if (player1.roundsWon > player2.roundsWon) {
        gameWinner = player1.address;
      } else if (player2.roundsWon > player1.roundsWon) {
        gameWinner = player2.address;
      } else {
        // Tied at round 15: first scorer wins
        const firstScorer = room.roundHistory.find((h) => h.winner !== null);
        gameWinner = firstScorer ? firstScorer.winner : player1.address;
      }

      logger.info('Game ended by round limit', {
        roomId: room.roomId,
        winner: gameWinner,
      });
    }

    // Reset selected cards
    player1.selectedCard = null;
    player2.selectedCard = null;

    // Increment round
    if (!gameOver) {
      room.currentRound++;
    }

    logger.info('Round processed', {
      roomId: room.roomId,
      round: historyEntry.roundNumber,
      winner: roundResult.winner,
      isDraw: roundResult.isDraw,
      score: `${player1.roundsWon}-${player2.roundsWon}`,
      gameOver,
    });

    return {
      winner: roundResult.winner,
      result: roundResult.result,
      isDraw: roundResult.isDraw,
      gameOver,
      gameWinner,
      roundHistory: historyEntry,
    };
  }

  /**
   * Calculate leaderboard points
   */
  calculateLeaderboardPoints(winnerScore: number, loserScore: number): number {
    if (winnerScore === 3 && loserScore === 0) return 7;
    if (winnerScore === 3 && loserScore === 1) return 5;
    if (winnerScore === 3 && loserScore === 2) return 3;
    return 0;
  }

  /**
   * End game
   */
  endGame(room: Room, winnerAddress: string | null, reason: string): void {
    room.gameState = 'finished';
    room.winner = winnerAddress;
    room.finishedAt = new Date();

    if (winnerAddress) {
      const winner = room.players.find((p) => p.address === winnerAddress);
      const loser = room.players.find((p) => p.address !== winnerAddress);

      if (winner && loser) {
        const points = this.calculateLeaderboardPoints(winner.roundsWon, loser.roundsWon);
        
        room.finalScore = {
          [winner.address]: winner.roundsWon,
          [loser.address]: loser.roundsWon,
        };

        room.leaderboardPoints = {
          [winner.address]: points,
          [loser.address]: 0,
        };
      }
    }

    logger.info('Game ended', {
      roomId: room.roomId,
      winner: winnerAddress,
      reason,
      finalScore: room.finalScore,
    });
  }

  /**
   * Handle AFK timeout
   */
  handleAfkTimeout(room: Room, playerAddress: string): {
    shouldForfeit: boolean;
    afkCount: number;
  } {
    const player = room.players.find((p) => p.address === playerAddress);
    
    if (!player) {
      return { shouldForfeit: false, afkCount: 0 };
    }

    player.afkCount++;

    if (player.afkCount >= 3) {
      return { shouldForfeit: true, afkCount: player.afkCount };
    }

    // Give point to opponent
    const opponent = room.players.find((p) => p.address !== playerAddress);
    if (opponent) {
      opponent.roundsWon++;
      
      // Check if opponent won
      if (opponent.roundsWon >= room.winningScore) {
        return { shouldForfeit: true, afkCount: player.afkCount };
      }
    }

    return { shouldForfeit: false, afkCount: player.afkCount };
  }
}

export default new GameService();

