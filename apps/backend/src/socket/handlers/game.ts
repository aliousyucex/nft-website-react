import type {Server, Socket} from 'socket.io';
import config from '../../config';
import {db} from '../../db/connection';
import aiService from '../../services/ai';
import contractService from '../../services/contract';
import gameService from '../../services/game';
import leaderboardService from '../../services/leaderboard';
import roomManager from '../../services/room';
import type {Player} from '../../types/player';
import type {Room, RoundHistoryEntry} from '../../types/room';
import {SocketErrorCode} from '../../utils/errors';
import logger from '../../utils/logger';
import {formatRoomData, formatRoomForList} from './room';

// Track selection timeouts
const selectionTimeouts = new Map<string, NodeJS.Timeout>();

export const setupGameHandlers = (io: Server, socket: Socket) => {
  /**
   * Player ready
   */
  socket.on('player_ready', async (callback) => {
    try {
      let room = roomManager.setPlayerReady(socket.id, true);

      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.NOT_IN_ROOM,
        });
      }

      // Update room activity
      roomManager.updateRoomActivity(room.roomId);

      // For single player mode, add AI player BEFORE checking player count
      if (room.isSinglePlayer && room.players.length < 2) {
        logger.info('🤖 Single player mode: Adding AI player', {roomId: room.roomId});

        // Add AI player
        const aiSocketId = `ai-${room.roomId}`;
        const updatedRoom = roomManager.addAIPlayer(room.roomId, aiSocketId);

        if (updatedRoom) {
          room = updatedRoom; // Update room reference with AI player
          logger.info('✅ AI player added successfully', {
            roomId: room.roomId,
            playerCount: room.players.length,
          });

          // Notify player that AI joined
          io.to(room.roomId).emit('room_updated', {
            room: formatRoomData(updatedRoom),
          });
        }
      }

      // NOW check if we have 2 players (after potentially adding AI)
      if (room.players.length !== 2) {
        logger.info('⏳ Waiting for second player', {
          roomId: room.roomId,
          currentPlayers: room.players.length,
        });
        return callback({
          success: false,
          error: 'Waiting for second player',
        });
      }

      // Notify room with updated room data
      io.to(room.roomId).emit('room_updated', {
        room: formatRoomData(room),
      });

      // Check if both ready
      if (room.players[0].ready && room.players[1]?.ready) {
        logger.info('Both players ready, starting game', {
          roomId: room.roomId,
          isSinglePlayer: room.isSinglePlayer,
          betAmount: room.betAmount,
        });

        try {
          // Skip contract calls for free games (betAmount = 0)
          if (room.betAmount > 0) {
            logger.info('Deducting bets from players', {
              player1: room.players[0].address,
              player2: room.players[1].address,
              betAmount: room.betAmount,
            });

            await contractService.updateBalances([
              {address: room.players[0].address, amount: -room.betAmount},
              {address: room.players[1].address, amount: -room.betAmount},
            ]);

            logger.info('Bets deducted successfully');
          } else {
            logger.info('Free game, skipping bet deduction');
          }

          // Start game
          const startedRoom = roomManager.startGame(room.roomId);

          if (startedRoom) {
            logger.info('Game started successfully', {roomId: room.roomId});

            // Deal cards to both players
            io.to(room.roomId).emit('game_started', {
              message: 'Game started! Cards dealt.',
            });

            // Send cards to each player (private)
            startedRoom.players.forEach((player) => {
              logger.info('Sending cards to player', {
                address: player.address,
                cardCount: player.hand.length,
                isAI: player.socketId.startsWith('ai-'),
              });

              // Only send to real player socket (not AI)
              if (!player.socketId.startsWith('ai-')) {
                io.to(player.socketId).emit('cards_dealt', {
                  cards: player.hand,
                  phase: 'initial',
                  message: 'Your initial 5 cards',
                });
              }
            });

            // Start selection timeout for round 1
            startSelectionTimeout(io, room.roomId);
          } else {
            logger.error('Failed to start game', {roomId: room.roomId});
          }
        } catch (error) {
          logger.error('Error during game start', {error, roomId: room.roomId});
          // Notify players of the error
          io.to(room.roomId).emit('error', {
            message: 'Failed to start game. Please try again.',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      callback({
        success: true,
        room: formatRoomData(room),
      });
    } catch (error) {
      logger.error('Error setting player ready', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set ready',
      });
    }
  });

  socket.on('player_not_ready', async (callback) => {
    try {
      const room = roomManager.getRoomBySocket(socket.id);

      if (!room) {
        return callback({
          success: false,
          error: 'Room not found',
          code: SocketErrorCode.NOT_IN_ROOM,
        });
      }

      roomManager.setPlayerNotReady(socket.id);

      // Update room activity
      roomManager.updateRoomActivity(room.roomId);

      if (room.players.length !== 2) {
        return callback({
          success: false,
          error: 'Waiting for second player',
        });
      }

      // Notify room with updated room data
      io.to(room.roomId).emit('room_updated', {
        room: formatRoomData(room),
      });

      callback({
        success: true,
        room: formatRoomData(room),
      });
    } catch (error) {
      logger.error('Error setting player not ready', error);
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set not ready',
      });
    }
  });

  /**
   * Select card
   */
  socket.on('select_card', async (data, callback) => {
    try {
      const {cardId} = data;

      const room = roomManager.getRoomBySocket(socket.id);

      // Update room activity
      if (room) {
        roomManager.updateRoomActivity(room.roomId);
      }

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

      // Check if game is already over (any player reached winning score)
      if (
        room.players[0].roundsWon >= room.winningScore ||
        room.players[1].roundsWon >= room.winningScore
      ) {
        return callback({
          success: false,
          error: 'Game has ended',
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

      callback({success: true});

      // Notify opponent that this player has selected
      const opponent = room.players.find((p) => p.socketId !== socket.id);
      if (opponent) {
        io.to(opponent.socketId).emit('opponent_selected', {
          hasSelected: true,
        });
      }

      // For single player, trigger AI selection after player selects
      if (room.isSinglePlayer && !room.players[1].selectedCard) {
        const aiPlayer = room.players[1];
        const humanPlayer = room.players[0];

        logger.info('Triggering AI card selection', {
          roomId: room.roomId,
          aiHand: aiPlayer.hand.length,
        });

        // Get AI selection with delay to simulate thinking
        const delay = aiService.getSelectionDelay();
        setTimeout(() => {
          const room = roomManager.getRoomBySocket(socket.id);
          if (!room || !room.isSinglePlayer) return;

          const aiPlayer = room.players[1];
          if (aiPlayer.selectedCard) return; // Already selected

          // AI selects a card
          const selectedCard = aiService.selectCard(aiPlayer.hand, undefined, {
            ai: aiPlayer.roundsWon,
            player: humanPlayer.roundsWon,
          });

          aiPlayer.selectedCard = selectedCard;

          logger.info('AI selected card', {
            roomId: room.roomId,
            card: `${selectedCard.type}_${selectedCard.value}`,
          });

          // Notify player that opponent (AI) has selected
          io.to(humanPlayer.socketId).emit('opponent_selected', {
            hasSelected: true,
          });

          // Process round if both selected
          if (room.players[0].selectedCard && room.players[1].selectedCard) {
            clearSelectionTimeout(room.roomId);
            processRound(io, room);
          }
        }, delay);
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
      const {emojiId} = data;

      const room = roomManager.getRoomBySocket(socket.id);

      if (!room) return;

      const opponent = room.players.find((p) => p.socketId !== socket.id);

      if (opponent) {
        io.to(opponent.socketId).emit('emoji_received', {
          emojiId,
          timestamp: Date.now(),
        });
      }

      logger.debug('Emoji sent', {roomId: room.roomId, emojiId});
    } catch (error) {
      logger.error('Error sending emoji', error);
    }
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', async () => {
    const {room, player} = roomManager.handleDisconnect(socket.id);

    if (!room || !player) return;

    logger.info('Player disconnected', {
      roomId: room.roomId,
      address: player.address,
      gameState: room.gameState,
    });

    // If game hasn't started yet, remove player immediately from room
    if (room.gameState === 'waiting') {
      logger.info('Game not started, removing player from room immediately');

      const roomId = room.roomId; // Save roomId before player leaves
      const {room: updatedRoom} = roomManager.leaveRoom(socket.id);

      if (updatedRoom) {
        // If only 1 player remains, reset their ready state
        if (updatedRoom.players.length === 1) {
          updatedRoom.players[0].ready = false;
          logger.info('Reset remaining player ready state after disconnect', {
            roomId,
            playerAddress: updatedRoom.players[0].address,
          });
        }

        const roomData = formatRoomData(updatedRoom);

        // Notify remaining player(s)
        io.to(roomId).emit('player_left', {
          remainingPlayers: updatedRoom.players.length,
          room: roomData,
        });

        io.to(roomId).emit('room_updated', {
          room: roomData,
        });

        logger.info('Notified remaining players about disconnect', {
          roomId,
          remainingPlayers: updatedRoom.players.length,
        });

        // Broadcast updated room list
        io.emit('room_list', roomManager.getAvailableRooms().map(formatRoomForList));
      }

      return;
    }

    // If game is playing, notify opponent and wait for reconnection
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
        logger.info('Player reconnected, continuing game');
        return;
      }

      // Handle forfeit if game was playing
      if (room.gameState === 'playing') {
        await handleDisconnectForfeit(io, room, player.address);
      }
    }, config.game.disconnectGracePeriod);
  });
};

/**
 * Start selection timeout
 */
function startSelectionTimeout(io: Server, roomId: string) {
  const room = roomManager.getRoom(roomId);

  if (!room) return;

  // Check if game is already over
  if (
    room.gameState === 'finished' ||
    room.players[0].roundsWon >= room.winningScore ||
    room.players[1].roundsWon >= room.winningScore
  ) {
    logger.info('Game already finished, not starting timer', {roomId});
    return;
  }

  // Emit new round started event (currentRound will be incremented in processRound)
  const nextRound = room.currentRound + 1;
  const roundStartTime = Date.now();

  // Store round start time for reconnection
  room.roundStartTime = roundStartTime;

  io.to(roomId).emit('new_round_started', {
    round: nextRound,
    timeLimit: config.game.cardSelectionTimeout / 1000,
    startTime: roundStartTime, // Add server timestamp for timer sync
  });

  logger.info('Round timer started', {
    roomId: room.roomId,
    round: nextRound,
    currentRound: room.currentRound,
    timeLimit: config.game.cardSelectionTimeout / 1000,
    startTime: roundStartTime,
  });

  const timeout = setTimeout(async () => {
    const room = roomManager.getRoom(roomId);

    if (!room) return;

    // Check if game ended while waiting
    if (
      room.gameState === 'finished' ||
      room.players[0].roundsWon >= room.winningScore ||
      room.players[1].roundsWon >= room.winningScore
    ) {
      logger.info('Game already finished during timeout', {roomId});
      return;
    }

    const player1NoCard = !room.players[0].selectedCard;
    const player2NoCard = !room.players[1].selectedCard;

    // Auto-select random card for AFK players
    for (let i = 0; i < room.players.length; i++) {
      const player = room.players[i];
      if (!player.selectedCard && player.hand.length > 0) {
        // Increment AFK count
        player.afkCount = (player.afkCount || 0) + 1;

        // Select random card from hand
        const randomIndex = Math.floor(Math.random() * player.hand.length);
        const randomCard = player.hand[randomIndex];

        player.selectedCard = randomCard;

        // Remove from hand
        player.hand.splice(randomIndex, 1);

        // Add to used cards
        const playerDeck = i === 0 ? room.player1Deck : room.player2Deck;
        playerDeck.used.push(randomCard);
        playerDeck.inHand = player.hand;

        logger.info('Auto-selected random card for AFK player', {
          roomId: room.roomId,
          playerAddress: player.address,
          card: randomCard,
          afkCount: player.afkCount,
        });

        // Notify player
        io.to(player.socketId).emit('afk_warning', {
          message: 'You took too long! A random card was played for you.',
          autoSelectedCard: randomCard,
          afkCount: player.afkCount,
        });
      }
    }

    // Check if any player should forfeit (afkCount >= 2)
    // First, check if BOTH players are AFK
    const bothPlayersAfk = room.players.every((p) => p.afkCount >= 2);

    if (bothPlayersAfk) {
      logger.info('Both players repeatedly AFK, triggering forfeit for both', {
        roomId: room.roomId,
        player1: room.players[0].address,
        player2: room.players[1].address,
        afkCount1: room.players[0].afkCount,
        afkCount2: room.players[1].afkCount,
      });

      // Trigger forfeit for both players (no refunds, both lose)
      await handleBothPlayersAfkForfeit(io, room);
      return; // Exit early - game has ended
    }

    // If only one player is AFK, handle normally
    for (let i = 0; i < room.players.length; i++) {
      const player = room.players[i];

      if (player.afkCount >= 2) {
        logger.info('Player repeatedly AFK, triggering forfeit', {
          roomId: room.roomId,
          address: player.address,
          afkCount: player.afkCount,
        });

        // Trigger forfeit with conditional payout
        await handleAfkForfeitWithConditionalPayout(io, room, player.address);
        return; // Exit early - game has ended
      }
    }

    // If both players were AFK (no card selected before timeout)
    if (player1NoCard && player2NoCard) {
      room.consecutiveAfkRounds++;

      logger.warn('Both players AFK', {
        roomId: room.roomId,
        consecutiveAfkRounds: room.consecutiveAfkRounds,
      });

      // If both AFK for 2 consecutive rounds, dismiss room and penalize
      if (room.consecutiveAfkRounds >= 2) {
        logger.info('Both players repeatedly AFK, dismissing room and penalizing', {
          roomId: room.roomId,
          betAmount: room.betAmount,
        });

        // Notify both players
        io.to(room.roomId).emit('room_dismissed_afk', {
          message: 'Both players were repeatedly AFK. Room dismissed and bets forfeited.',
        });

        // Keep the betAmount in contract (penalty)
        // No need to transfer, it's already deducted

        // End game without winner (both forfeit)
        gameService.endGame(room, null, 'both_afk');

        // Clean up room
        room.players.forEach((p) => {
          roomManager.leaveRoom(p.socketId);
        });

        return;
      }

      // Notify both players
      io.to(room.roomId).emit('both_afk_warning', {
        message:
          'Both players were AFK! Random cards were played. One more time and the game will be dismissed.',
        consecutiveAfkRounds: room.consecutiveAfkRounds,
      });
    } else {
      // Reset consecutive AFK counter if at least one player was active
      room.consecutiveAfkRounds = 0;
    }

    // Now process the round (all players should have cards now)
    if (room.players[0].selectedCard && room.players[1].selectedCard) {
      await processRound(io, room);
    } else {
      logger.error('Round processing failed - missing cards after timeout', {
        roomId: room.roomId,
        player1HasCard: !!room.players[0].selectedCard,
        player2HasCard: !!room.players[1].selectedCard,
      });
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
async function processRound(io: Server, room: Room) {
  const card1 = room.players[0].selectedCard;
  const card2 = room.players[1].selectedCard;

  if (!card1 || !card2) {
    logger.error('Round processing failed - missing cards', {
      roomId: room.roomId,
    });
    return;
  }

  // Increment round counter
  room.currentRound++;

  // Reset consecutive AFK counter since both players actively selected cards
  room.consecutiveAfkRounds = 0;

  logger.info('Processing round', {
    roomId: room.roomId,
    round: room.currentRound,
    player1Card: `${card1?.type} ${card1?.value}`,
    player2Card: `${card2?.type} ${card2?.value}`,
  });

  // Reveal cards to both players
  io.to(room.roomId).emit('cards_revealed', {
    player1Card: card1,
    player2Card: card2,
  });

  // Small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Determine winner
  const result = gameService.processCardSelection(room, card1, card2);

  logger.info('Round processed', {
    roomId: room.roomId,
    round: room.currentRound,
    winner: result.winner || 'DRAW',
    isDraw: result.isDraw,
    player1Score: room.players[0].roundsWon,
    player2Score: room.players[1].roundsWon,
    gameOver: result.gameOver,
  });

  // Check if game is over - if so, skip deck updates and timer
  if (result.gameOver) {
    logger.info('Game over detected, skipping deck updates and timer', {
      roomId: room.roomId,
      winner: result.gameWinner,
    });
    gameService.endGame(room, result.gameWinner, 'normal');
    await handleGameEnd(io, room);
    return; // Exit early
  }

  // Update decks
  roomManager.updatePlayerDeck(room, 0);
  roomManager.updatePlayerDeck(room, 1);

  // Send cards if deck changed
  room.players.forEach((player: Player) => {
    io.to(player.socketId).emit('cards_dealt', {
      cards: player.hand,
      phase: player.hand.length === 4 ? 'remaining' : 'reshuffled',
      message: player.hand.length === 4 ? 'Your remaining 4 cards' : 'Deck reshuffled!',
    });
  });

  // Send round result with full history
  room.players.forEach((player: Player, index: number) => {
    const opponent = room.players[1 - index];
    const roundData = {
      round: room.currentRound,
      myCard: index === 0 ? card1 : card2,
      opponentCard: index === 0 ? card2 : card1,
      winner: result.winner?.toLowerCase() || null, // Ensure lowercase for address comparison
      result: result.result,
      isDraw: result.isDraw,
      myScore: player.roundsWon,
      opponentScore: opponent.roundsWon,
      myCardsRemaining: player.hand.length,
      opponentCardsRemaining: opponent.hand.length,
      roundHistory: room.roundHistory.map((h: RoundHistoryEntry) => ({
        round: h.roundNumber,
        player1Card: h.player1Card,
        player2Card: h.player2Card,
        winner: h.winner?.toLowerCase() || null, // Ensure lowercase for address comparison
        result: h.result,
      })),
    };

    logger.info('Sending round_result to player', {
      roomId: room.roomId,
      playerAddress: player.address,
      round: roundData.round,
      myScore: roundData.myScore,
      opponentScore: roundData.opponentScore,
      winner: roundData.winner || 'DRAW',
      isWinner: roundData.winner ? roundData.winner === player.address : false,
      isDraw: roundData.isDraw,
      myCard: roundData.myCard ? `${roundData.myCard.type}_${roundData.myCard.value}` : 'none',
      opponentCard: roundData.opponentCard
        ? `${roundData.opponentCard.type}_${roundData.opponentCard.value}`
        : 'none',
      historyCount: roundData.roundHistory.length,
    });

    io.to(player.socketId).emit('round_result', roundData);
  });

  // Start next round (game over is already handled above with early return)
  setTimeout(() => {
    startSelectionTimeout(io, room.roomId);
  }, 2000);
}

/**
 * Handle game end
 */
async function handleGameEnd(io: Server, room: Room) {
  try {
    if (!room.winner) {
      logger.error('Game ended without winner', {roomId: room.roomId});
      return;
    }

    const winner = room.players.find((p: Player) => p.address === room.winner);
    const loser = room.players.find((p: Player) => p.address !== room.winner);

    if (!winner || !loser) return;

    const isPaidGame = room.betAmount > 0;

    // Skip contract payout for free games
    if (isPaidGame) {
      await contractService.processGamePayout(winner.address, loser.address, room.betAmount);
      logger.info('Payout processed for paid game');
    } else {
      logger.info('Free game, skipping payout');
    }

    // Skip leaderboard update for free games
    if (isPaidGame) {
      await leaderboardService.updateAfterGame(winner.address, loser.address, {
        winner: winner.roundsWon,
        loser: loser.roundsWon,
      });
      logger.info('Leaderboard updated for paid game');
    } else {
      logger.info('Free game, skipping leaderboard update');
    }

    // Save game history (including free games for analytics)
    await saveGameHistory(room);

    // Notify players with correct format - send personalized data to each player
    const payout = isPaidGame
      ? contractService.calculatePayout(room.betAmount * 2)
      : {winnerAmount: 0, commission: 0};

    room.players.forEach((player: Player, index: number) => {
      const opponent = room.players[1 - index];

      // Skip AI player notifications
      if (player.socketId.startsWith('ai-')) return;

      io.to(player.socketId).emit('game_finished', {
        winner: winner.address.toLowerCase(), // Ensure lowercase for address comparison
        myScore: player.roundsWon,
        opponentScore: opponent.roundsWon,
        scores: {
          player1: room.players[0].roundsWon,
          player2: room.players[1].roundsWon,
        },
        finalScore: room.finalScore,
        leaderboardPoints: room.leaderboardPoints,
        prizeAmount: payout.winnerAmount,
        isPaidGame,
      });
    });

    logger.info('Game ended successfully', {
      roomId: room.roomId,
      winner: winner.address,
      score: `${winner.roundsWon}-${loser.roundsWon}`,
      isPaidGame,
    });
  } catch (error) {
    logger.error('Error handling game end', error);
  }
}

/**
 * Handle disconnect forfeit
 */
async function handleDisconnectForfeit(io: Server, room: Room, disconnectedAddress: string) {
  try {
    const remaining = room.players.find(
      (p: Player) => p.address !== disconnectedAddress && p.isConnected
    );
    const disconnected = room.players.find((p: Player) => p.address === disconnectedAddress);

    if (!remaining || !disconnected) return;

    const remainingAhead = remaining.roundsWon > disconnected.roundsWon;
    const isPaidGame = room.betAmount > 0;

    // Skip contract payout for free games
    if (isPaidGame) {
      await contractService.processDisconnectPayout(
        remaining.address,
        disconnected.address,
        room.betAmount,
        remainingAhead
      );
      logger.info('Disconnect payout processed for paid game');
    } else {
      logger.info('Free game, skipping disconnect payout');
    }

    // End game
    gameService.endGame(room, remaining.address, 'disconnect_forfeit');

    // Skip leaderboard update for free games
    if (isPaidGame) {
      await leaderboardService.updateAfterGame(remaining.address, disconnected.address, {
        winner: remaining.roundsWon,
        loser: disconnected.roundsWon,
      });
      logger.info('Leaderboard updated for paid game');
    } else {
      logger.info('Free game, skipping leaderboard update');
    }

    // Save game history
    await saveGameHistory(room);

    // Notify with personalized data
    const payout = isPaidGame
      ? contractService.calculatePayout(room.betAmount * 2)
      : {winnerAmount: 0, commission: 0};

    room.players.forEach((player: Player, index: number) => {
      const opponent = room.players[1 - index];

      // Skip AI player notifications
      if (player.socketId.startsWith('ai-')) return;

      io.to(player.socketId).emit('game_finished', {
        winner: remaining.address.toLowerCase(), // Ensure lowercase for address comparison
        reason: 'disconnect_forfeit',
        myScore: player.roundsWon,
        opponentScore: opponent.roundsWon,
        scores: {
          player1: room.players[0].roundsWon,
          player2: room.players[1].roundsWon,
        },
        finalScore: room.finalScore,
        prizeAmount: payout.winnerAmount,
        isPaidGame,
        afkPlayerAddresses: [disconnected.address],
      });
    });

    logger.info('Game ended by disconnect forfeit', {
      roomId: room.roomId,
      winner: remaining.address,
      isPaidGame,
    });
  } catch (error) {
    logger.error('Error handling disconnect forfeit', error);
  }
}

/**
 * Handle AFK forfeit
 */
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
async function handleAfkForfeit(io: Server, room: Room, afkAddress: string) {
  try {
    const opponent = room.players.find((p: Player) => p.address !== afkAddress);
    const afkPlayer = room.players.find((p: Player) => p.address === afkAddress);

    if (!opponent || !afkPlayer) return;

    const isPaidGame = room.betAmount > 0;

    // Skip contract payout for free games
    if (isPaidGame) {
      await contractService.processGamePayout(opponent.address, afkAddress, room.betAmount);
      logger.info('AFK payout processed for paid game');
    } else {
      logger.info('Free game, skipping AFK payout');
    }

    // End game
    gameService.endGame(room, opponent.address, 'afk_forfeit');

    // Skip leaderboard update for free games
    if (isPaidGame) {
      await leaderboardService.updateAfterGame(opponent.address, afkAddress, {
        winner: opponent.roundsWon,
        loser: afkPlayer.roundsWon,
      });
      logger.info('Leaderboard updated for paid game');
    } else {
      logger.info('Free game, skipping leaderboard update');
    }

    // Save game history
    await saveGameHistory(room);

    // Notify with personalized data
    const payout = isPaidGame
      ? contractService.calculatePayout(room.betAmount * 2)
      : {winnerAmount: 0, commission: 0};

    room.players.forEach((player: Player, index: number) => {
      const opp = room.players[1 - index];

      // Skip AI player notifications
      if (player.socketId.startsWith('ai-')) return;

      io.to(player.socketId).emit('game_finished', {
        winner: opponent.address.toLowerCase(), // Ensure lowercase for address comparison
        reason: 'afk_forfeit',
        myScore: player.roundsWon,
        opponentScore: opp.roundsWon,
        scores: {
          player1: room.players[0].roundsWon,
          player2: room.players[1].roundsWon,
        },
        finalScore: room.finalScore,
        prizeAmount: payout.winnerAmount,
        isPaidGame,
      });
    });

    logger.info('Game ended by AFK forfeit', {
      roomId: room.roomId,
      winner: opponent.address,
      isPaidGame,
    });
  } catch (error) {
    logger.error('Error handling AFK forfeit', error);
  }
}

/**
 * Handle both players AFK forfeit (no refunds, both lose)
 */
async function handleBothPlayersAfkForfeit(io: Server, room: Room) {
  try {
    const player1 = room.players[0];
    const player2 = room.players[1];
    const isPaidGame = room.betAmount > 0;

    logger.info('Processing both players AFK forfeit - no refunds', {
      roomId: room.roomId,
      player1: player1.address,
      player2: player2.address,
      player1AfkCount: player1.afkCount,
      player2AfkCount: player2.afkCount,
      isPaidGame,
    });

    // No refunds - bets stay in contract as penalty
    // No payout needed, both players lose their bets

    // End game without winner (both forfeit)
    gameService.endGame(room, null, 'both_afk');

    // Save game history
    await saveGameHistory(room);

    // Notify both players - each sees they lost
    room.players.forEach((player: Player, index: number) => {
      const opponent = room.players[1 - index];

      // Skip AI player notifications
      if (player.socketId.startsWith('ai-')) return;

      io.to(player.socketId).emit('game_finished', {
        winner: null, // No winner - both lost
        reason: 'both_afk',
        myScore: player.roundsWon,
        opponentScore: opponent.roundsWon,
        scores: {
          player1: room.players[0].roundsWon,
          player2: room.players[1].roundsWon,
        },
        finalScore: room.finalScore,
        prizeAmount: 0, // No prize for anyone
        isRefund: false, // No refund
        isPaidGame,
        afkPlayerAddresses: [player1.address, player2.address],
      });
    });

    logger.info('Game ended - both players AFK', {
      roomId: room.roomId,
      isPaidGame,
      penalty: isPaidGame ? `${room.betAmount * 2} ETH forfeited` : 'none',
    });
  } catch (error) {
    logger.error('Error handling both players AFK forfeit', error);
  }
}

/**
 * Handle AFK forfeit with conditional payout
 */
async function handleAfkForfeitWithConditionalPayout(io: Server, room: Room, afkAddress: string) {
  try {
    const opponent = room.players.find((p: Player) => p.address !== afkAddress);
    const afkPlayer = room.players.find((p: Player) => p.address === afkAddress);

    if (!opponent || !afkPlayer) return;

    const isPaidGame = room.betAmount > 0;
    const opponentIsAhead = opponent.roundsWon > afkPlayer.roundsWon;

    logger.info('Processing AFK forfeit with conditional payout', {
      roomId: room.roomId,
      afkPlayer: afkAddress,
      opponentScore: opponent.roundsWon,
      afkScore: afkPlayer.roundsWon,
      opponentIsAhead,
      isPaidGame,
    });

    // Handle payouts for paid games
    if (isPaidGame) {
      await contractService.processAfkForfeitPayout(
        opponent.address,
        afkAddress,
        room.betAmount,
        opponentIsAhead
      );

      // Update leaderboard for paid games
      await leaderboardService.updateAfterGame(opponent.address, afkAddress, {
        winner: opponent.roundsWon,
        loser: afkPlayer.roundsWon,
      });
      logger.info('Leaderboard updated for paid game');
    } else {
      logger.info('Free game, skipping payout and leaderboard update');
    }

    // End game with opponent as winner
    gameService.endGame(room, opponent.address, 'afk_forfeit');

    // Save game history
    await saveGameHistory(room);

    // Calculate payout for notification
    const payout = {winnerAmount: 0, commission: 0};
    if (isPaidGame && opponentIsAhead) {
      const totalPot = room.betAmount * 2;
      payout.winnerAmount = totalPot * 0.6;
      payout.commission = totalPot * 0.4;
    }

    // Notify players with personalized data
    room.players.forEach((player: Player, index: number) => {
      const opp = room.players[1 - index];

      // Skip AI player notifications
      if (player.socketId.startsWith('ai-')) return;

      io.to(player.socketId).emit('game_finished', {
        winner: opponent.address.toLowerCase(),
        reason: 'afk_forfeit',
        myScore: player.roundsWon,
        opponentScore: opp.roundsWon,
        scores: {
          player1: room.players[0].roundsWon,
          player2: room.players[1].roundsWon,
        },
        finalScore: room.finalScore,
        prizeAmount: player.address === opponent.address ? payout.winnerAmount : 0,
        isRefund: isPaidGame && !opponentIsAhead,
        isPaidGame,
        afkPlayerAddresses: [afkPlayer.address],
      });
    });

    logger.info('Game ended by AFK forfeit', {
      roomId: room.roomId,
      winner: opponent.address,
      isPaidGame,
      payoutType: isPaidGame ? (opponentIsAhead ? '60% to winner' : 'refund both') : 'free game',
    });
  } catch (error) {
    logger.error('Error handling AFK forfeit with conditional payout', error);
  }
}

/**
 * Save game history to database
 */
async function saveGameHistory(room: Room) {
  try {
    const gameDuration = room.finishedAt
      ? Math.floor((room.finishedAt.getTime() - room.createdAt.getTime()) / 1000)
      : null;

    const winner = room.players.find((p: Player) => p.address === room.winner);
    const loser = room.players.find((p: Player) => p.address !== room.winner);

    if (!winner || !loser) return;

    const payout = contractService.calculatePayout(room.betAmount * 2);

    // Insert game history
    const isPaidGame = room.betAmount > 0;
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
        is_paid_game: isPaidGame,
        game_duration_seconds: gameDuration,
        end_reason: 'normal',
      })
      .returning('id')
      .executeTakeFirst();

    // Insert round history
    if (gameResult && room.roundHistory.length > 0) {
      const roundData = room.roundHistory.map((round: RoundHistoryEntry) => ({
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

    logger.info('Game history saved', {roomId: room.roomId, gameId: gameResult?.id});
  } catch (error) {
    logger.error('Error saving game history', error);
  }
}
