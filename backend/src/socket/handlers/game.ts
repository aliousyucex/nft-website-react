import { Server, Socket } from 'socket.io';
import roomManager from '../../services/room';
import gameService from '../../services/game';
import contractService from '../../services/contract';
import leaderboardService from '../../services/leaderboard';
import { db } from '../../db/connection';
import logger from '../../utils/logger';
import { SocketErrorCode } from '../../utils/errors';
import config from '../../config';

// Track selection timeouts
const selectionTimeouts = new Map<string, NodeJS.Timeout>();

export const setupGameHandlers = (io: Server, socket: Socket) => {
  /**
   * Player ready
   */
  socket.on('player_ready', async (callback) => {
    try {
      const room = roomManager.setPlayerReady(socket.id, true);

      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.NOT_IN_ROOM,
        });
      }

      if (room.players.length !== 2) {
        return callback({
          success: false,
          error: 'Waiting for second player',
        });
      }

      // Notify room with updated room data
      io.to(room.roomId).emit('room_updated', {
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

      // Check if both ready
      if (room.players[0].ready && room.players[1].ready) {
        logger.info('Both players ready, starting game', { roomId: room.roomId });
        
        try {
          // Deduct bets from both players
          logger.info('Deducting bets from players', {
            player1: room.players[0].address,
            player2: room.players[1].address,
            betAmount: room.betAmount,
          });

          await contractService.updateBalances([
            { address: room.players[0].address, amount: -room.betAmount },
            { address: room.players[1].address, amount: -room.betAmount },
          ]);

          logger.info('Bets deducted successfully');

          // Start game
          const startedRoom = roomManager.startGame(room.roomId);

          if (startedRoom) {
            logger.info('Game started successfully', { roomId: room.roomId });

            // Deal cards to both players
            io.to(room.roomId).emit('game_started', {
              message: 'Game started! Cards dealt.',
            });

            // Send cards to each player (private)
            startedRoom.players.forEach((player) => {
              logger.info('Sending cards to player', {
                address: player.address,
                cardCount: player.hand.length,
              });

              io.to(player.socketId).emit('cards_dealt', {
                cards: player.hand,
                phase: 'initial',
                message: 'Your initial 5 cards',
              });
            });

            // Start selection timeout for round 1
            startSelectionTimeout(io, room.roomId);
          } else {
            logger.error('Failed to start game', { roomId: room.roomId });
          }
        } catch (error) {
          logger.error('Error during game start', { error, roomId: room.roomId });
          // Notify players of the error
          io.to(room.roomId).emit('error', {
            message: 'Failed to start game. Please try again.',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

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
      });
    } catch (error) {
      logger.error('Error setting player ready', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set ready',
      });
    }
  });

  /**
   * Select card
   */
  socket.on('select_card', async (data, callback) => {
    try {
      const { cardId } = data;

      const room = roomManager.getRoomBySocket(socket.id);

      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.NOT_IN_ROOM,
        });
      }

      if (room.gameState !== 'playing') {
        return callback({
          success: false,
          error: 'Game is not in playing state',
          code: SocketErrorCode.GAME_NOT_PLAYING,
        });
      }

      const player = room.players.find((p) => p.socketId === socket.id);

      if (!player) {
        return callback({
          success: false,
          error: 'Player not found',
        });
      }

      // Find card in player's hand
      const card = player.hand.find((c) => c.id === cardId);

      if (!card) {
        return callback({
          success: false,
          error: 'Card not in hand',
          code: SocketErrorCode.INVALID_CARD,
        });
      }

      // Set selected card
      player.selectedCard = card;
      player.afkCount = 0; // Reset AFK count

      logger.info('Card selected', {
        roomId: room.roomId,
        address: player.address,
        cardId,
      });

      callback({ success: true });

      // Notify opponent that this player has selected
      const opponent = room.players.find((p) => p.socketId !== socket.id);
      if (opponent) {
        io.to(opponent.socketId).emit('opponent_selected', {
          hasSelected: true,
        });
      }

      // Check if both players selected
      if (room.players[0].selectedCard && room.players[1].selectedCard) {
        // Clear timeout
        clearSelectionTimeout(room.roomId);

        // Process round
        await processRound(io, room);
      }
    } catch (error) {
      logger.error('Error selecting card', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to select card',
      });
    }
  });

  /**
   * Send emoji
   */
  socket.on('send_emoji', (data) => {
    try {
      const { emojiId } = data;

      const room = roomManager.getRoomBySocket(socket.id);

      if (!room) return;

      const opponent = room.players.find((p) => p.socketId !== socket.id);

      if (opponent) {
        io.to(opponent.socketId).emit('emoji_received', {
          emojiId,
          timestamp: Date.now(),
        });
      }

      logger.debug('Emoji sent', { roomId: room.roomId, emojiId });
    } catch (error) {
      logger.error('Error sending emoji', error);
    }
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', async () => {
    const { room, player } = roomManager.handleDisconnect(socket.id);

    if (!room || !player) return;

    logger.info('Player disconnected', {
      roomId: room.roomId,
      address: player.address,
    });

    // Notify opponent
    const opponent = room.players.find((p) => p.socketId !== socket.id);

    if (opponent) {
      io.to(opponent.socketId).emit('player_disconnected', {
        message: 'Opponent disconnected. Waiting 10 seconds...',
      });
    }

    // Wait 10 seconds
    setTimeout(async () => {
      // Check if player reconnected
      if (player.isConnected) {
        return;
      }

      // Handle forfeit
      if (room.gameState === 'playing') {
        await handleDisconnectForfeit(io, room, player.address);
      } else {
        // Just remove from room if game hasn't started
        roomManager.leaveRoom(socket.id);
      }
    }, config.game.disconnectGracePeriod);
  });
};

/**
 * Start selection timeout
 */
function startSelectionTimeout(io: Server, roomId: string) {
  const timeout = setTimeout(async () => {
    const room = roomManager.getRoom(roomId);

    if (!room) return;

    // Handle AFK players
    for (const player of room.players) {
      if (!player.selectedCard) {
        const { shouldForfeit, afkCount } = gameService.handleAfkTimeout(room, player.address);

        if (shouldForfeit) {
          // Forfeit game
          await handleAfkForfeit(io, room, player.address);
          return;
        } else {
          // Send warning
          io.to(player.socketId).emit('afk_warning', {
            message: `Warning! ${3 - afkCount} more timeouts will result in forfeit.`,
            warningCount: afkCount,
          });

          // Give point to opponent
          const opponent = room.players.find((p) => p.address !== player.address);
          
          // Check if opponent won
          if (opponent && opponent.roundsWon >= room.winningScore) {
            gameService.endGame(room, opponent.address, 'afk_forfeit');
            await handleGameEnd(io, room);
            return;
          }
        }
      }
    }

    // If both AFK'd, start new round
    if (!room.players[0].selectedCard && !room.players[1].selectedCard) {
      room.currentRound++;
      
      // Update decks
      roomManager.updatePlayerDeck(room, 0);
      roomManager.updatePlayerDeck(room, 1);

      // Start new selection
      startSelectionTimeout(io, roomId);
    }
  }, config.game.cardSelectionTimeout);

  selectionTimeouts.set(roomId, timeout);
}

/**
 * Clear selection timeout
 */
function clearSelectionTimeout(roomId: string) {
  const timeout = selectionTimeouts.get(roomId);
  if (timeout) {
    clearTimeout(timeout);
    selectionTimeouts.delete(roomId);
  }
}

/**
 * Process round
 */
async function processRound(io: Server, room: any) {
  const card1 = room.players[0].selectedCard!;
  const card2 = room.players[1].selectedCard!;

  // Reveal cards to both players
  io.to(room.roomId).emit('cards_revealed', {
    player1Card: card1,
    player2Card: card2,
  });

  // Small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Determine winner
  const result = gameService.processCardSelection(room, card1, card2);

  // Update decks
  roomManager.updatePlayerDeck(room, 0);
  roomManager.updatePlayerDeck(room, 1);

  // Send cards if deck changed
  room.players.forEach((player: any, index: number) => {
    io.to(player.socketId).emit('cards_dealt', {
      cards: player.hand,
      phase: player.hand.length === 4 ? 'remaining' : 'reshuffled',
      message: player.hand.length === 4 ? 'Your remaining 4 cards' : 'Deck reshuffled!',
    });
  });

  // Send round result
  io.to(room.roomId).emit('round_result', {
    roundNumber: result.roundHistory.roundNumber,
    player1Card: card1,
    player2Card: card2,
    winner: result.winner,
    result: result.result,
    isDraw: result.isDraw,
    player1Score: room.players[0].roundsWon,
    player2Score: room.players[1].roundsWon,
    player1CardsRemaining: room.players[0].hand.length,
    player2CardsRemaining: room.players[1].hand.length,
  });

  // Check if game over
  if (result.gameOver) {
    gameService.endGame(room, result.gameWinner, 'normal');
    await handleGameEnd(io, room);
  } else {
    // Start next round
    setTimeout(() => {
      startSelectionTimeout(io, room.roomId);
    }, 2000);
  }
}

/**
 * Handle game end
 */
async function handleGameEnd(io: Server, room: any) {
  try {
    if (!room.winner) {
      logger.error('Game ended without winner', { roomId: room.roomId });
      return;
    }

    const winner = room.players.find((p: any) => p.address === room.winner);
    const loser = room.players.find((p: any) => p.address !== room.winner);

    if (!winner || !loser) return;

    // Process payout
    await contractService.processGamePayout(
      winner.address,
      loser.address,
      room.betAmount
    );

    // Update leaderboard
    await leaderboardService.updateAfterGame(
      winner.address,
      loser.address,
      {
        winner: winner.roundsWon,
        loser: loser.roundsWon,
      }
    );

    // Save game history
    await saveGameHistory(room);

    // Notify players
    io.to(room.roomId).emit('game_finished', {
      winner: winner.address,
      finalScore: room.finalScore,
      leaderboardPoints: room.leaderboardPoints,
      prizeAmount: contractService.calculatePayout(room.betAmount * 2).winnerAmount,
    });

    logger.info('Game ended successfully', {
      roomId: room.roomId,
      winner: winner.address,
      score: `${winner.roundsWon}-${loser.roundsWon}`,
    });
  } catch (error) {
    logger.error('Error handling game end', error);
  }
}

/**
 * Handle disconnect forfeit
 */
async function handleDisconnectForfeit(io: Server, room: any, disconnectedAddress: string) {
  try {
    const remaining = room.players.find((p: any) => p.address !== disconnectedAddress && p.isConnected);
    const disconnected = room.players.find((p: any) => p.address === disconnectedAddress);

    if (!remaining || !disconnected) return;

    const remainingAhead = remaining.roundsWon > disconnected.roundsWon;

    // Process disconnect payout
    await contractService.processDisconnectPayout(
      remaining.address,
      disconnected.address,
      room.betAmount,
      remainingAhead
    );

    // End game
    gameService.endGame(room, remaining.address, 'disconnect_forfeit');

    // Update leaderboard
    await leaderboardService.updateAfterGame(
      remaining.address,
      disconnected.address,
      {
        winner: remaining.roundsWon,
        loser: disconnected.roundsWon,
      }
    );

    // Save game history
    await saveGameHistory(room);

    // Notify
    io.to(room.roomId).emit('game_finished', {
      winner: remaining.address,
      reason: 'disconnect_forfeit',
      finalScore: room.finalScore,
    });

    logger.info('Game ended by disconnect forfeit', {
      roomId: room.roomId,
      winner: remaining.address,
    });
  } catch (error) {
    logger.error('Error handling disconnect forfeit', error);
  }
}

/**
 * Handle AFK forfeit
 */
async function handleAfkForfeit(io: Server, room: any, afkAddress: string) {
  try {
    const opponent = room.players.find((p: any) => p.address !== afkAddress);
    const afkPlayer = room.players.find((p: any) => p.address === afkAddress);

    if (!opponent || !afkPlayer) return;

    // Process payout
    await contractService.processGamePayout(opponent.address, afkAddress, room.betAmount);

    // End game
    gameService.endGame(room, opponent.address, 'afk_forfeit');

    // Update leaderboard
    await leaderboardService.updateAfterGame(
      opponent.address,
      afkAddress,
      {
        winner: opponent.roundsWon,
        loser: afkPlayer.roundsWon,
      }
    );

    // Save game history
    await saveGameHistory(room);

    // Notify
    io.to(room.roomId).emit('game_finished', {
      winner: opponent.address,
      reason: 'afk_forfeit',
      finalScore: room.finalScore,
    });

    logger.info('Game ended by AFK forfeit', {
      roomId: room.roomId,
      winner: opponent.address,
    });
  } catch (error) {
    logger.error('Error handling AFK forfeit', error);
  }
}

/**
 * Save game history to database
 */
async function saveGameHistory(room: any) {
  try {
    const gameDuration = room.finishedAt
      ? Math.floor((room.finishedAt.getTime() - room.createdAt.getTime()) / 1000)
      : null;

    const winner = room.players.find((p: any) => p.address === room.winner);
    const loser = room.players.find((p: any) => p.address !== room.winner);

    const payout = contractService.calculatePayout(room.betAmount * 2);

    // Insert game history
    const gameResult = await db
      .insertInto('game_history')
      .values({
        room_id: room.roomId,
        player1_address: room.players[0].address,
        player2_address: room.players[1].address,
        winner_address: room.winner,
        final_score_p1: room.players[0].roundsWon,
        final_score_p2: room.players[1].roundsWon,
        total_rounds: room.currentRound,
        bet_amount: room.betAmount.toString(),
        commission: payout.commission.toString(),
        prize_amount: payout.winnerAmount.toString(),
        game_duration_seconds: gameDuration,
        end_reason: 'normal',
      })
      .returning('id')
      .executeTakeFirst();

    // Insert round history
    if (gameResult && room.roundHistory.length > 0) {
      const roundData = room.roundHistory.map((round: any) => ({
        game_id: gameResult.id,
        round_number: round.roundNumber,
        player1_card_type: round.player1Card.type,
        player1_card_value: round.player1Card.value,
        player2_card_type: round.player2Card.type,
        player2_card_value: round.player2Card.value,
        winner_address: round.winner,
        result: round.result,
      }));

      await db.insertInto('round_history').values(roundData).execute();
    }

    logger.info('Game history saved', { roomId: room.roomId, gameId: gameResult?.id });
  } catch (error) {
    logger.error('Error saving game history', error);
  }
}

