import {useCallback, useEffect, useState} from 'react';
import {useSocket} from '../context/SocketContext';
import type {Card, GameState, Room, RoundHistoryItem} from '../types';
import logger from '../utils/logger';

export const useGame = (userAddress: string) => {
  const {socket, isConnected} = useSocket();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivedEmoji, setReceivedEmoji] = useState<{emoji: string; timestamp: number} | null>(
    null
  );

  // Helper function to check if game is over
  const isGameOver = useCallback((state: GameState | null) => {
    if (!state) return false;
    return (
      state.gameState === 'finished' ||
      (state.myScore !== undefined && state.myScore >= 3) ||
      (state.opponentScore !== undefined && state.opponentScore >= 3)
    );
  }, []);

  // Fetch available rooms
  const fetchRooms = useCallback(() => {
    if (!socket) return;

    socket.emit('get_rooms', (response: {success: boolean; rooms: Room[]}) => {
      if (response.success) {
        setAvailableRooms(response.rooms);
      }
    });
  }, [socket]);

  // Create room
  const createRoom = useCallback(
    (
      betAmount: number,
      password?: string,
      gameMode?: 'free' | 'paid' | 'single_player',
      isSinglePlayer?: boolean
    ) => {
      if (!socket) return;

      setLoading(true);
      setError(null);

      socket.emit(
        'create_room',
        {
          betAmount,
          password,
          address: userAddress,
          gameMode,
          isSinglePlayer,
        },
        (response: {success: boolean; room: Room; sessionToken?: string; error?: string}) => {
          logger.socket('Create room response', response);
          setLoading(false);
          if (response.success) {
            logger.success('Room created', {roomId: response.room.roomId});
            setCurrentRoom(response.room);
            // Save session token and roomId
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
              localStorage.setItem('currentRoomId', response.room.roomId);
            }
          } else {
            logger.error('Failed to create room', response.error);
            setError(response.error || 'Failed to create room');
          }
        }
      );
    },
    [socket, userAddress]
  );

  // Join room
  const joinRoom = useCallback(
    (roomId: string, password?: string) => {
      if (!socket) return;

      setLoading(true);
      setError(null);

      socket.emit(
        'join_room',
        {
          roomId,
          password,
          address: userAddress,
        },
        (response: {success: boolean; room: Room; sessionToken?: string; error?: string}) => {
          setLoading(false);
          if (response.success) {
            setCurrentRoom(response.room);
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
              localStorage.setItem('currentRoomId', response.room.roomId);
            }
          } else {
            setError(response.error || 'Failed to join room');
          }
        }
      );
    },
    [socket, userAddress]
  );

  // Quick join
  const quickJoin = useCallback(
    (betAmount: number, isSinglePlayer?: boolean) => {
      if (!socket) return;

      setLoading(true);
      setError(null);

      socket.emit(
        'quick_join',
        {
          betAmount,
          address: userAddress,
          isSinglePlayer,
        },
        (response: {success: boolean; room: Room; sessionToken?: string; error?: string}) => {
          setLoading(false);
          if (response.success) {
            setCurrentRoom(response.room);
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
              localStorage.setItem('currentRoomId', response.room.roomId);
            }
          } else {
            setError(response.error || 'Failed to quick join');
          }
        }
      );
    },
    [socket, userAddress]
  );

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!socket) return;

    socket.emit('leave_room', (response: {success: boolean; error?: string}) => {
      if (response.success) {
        setCurrentRoom(null);
        setGameState(null);
        localStorage.removeItem('gameSessionToken');
        localStorage.removeItem('currentRoomId');
      }
    });
  }, [socket]);

  // Player ready
  const setReady = useCallback(() => {
    if (!socket) return;

    socket.emit('player_ready', (response: {success: boolean; room?: Room; error?: string}) => {
      logger.socket('Player ready response', response);
      if (response.success) {
        if (response.room) {
          setCurrentRoom(response.room);
        }
      } else {
        logger.error('Failed to set ready', response.error);
        setError(response.error || 'Failed to set ready');
      }
    });
  }, [socket]);

  // Player not ready
  const setNotReady = useCallback(() => {
    if (!socket) return;

    socket.emit('player_not_ready', (response: {success: boolean; room?: Room; error?: string}) => {
      logger.socket('Player ready response', response);
      if (response.success) {
        if (response.room) {
          setCurrentRoom(response.room);
        }
      } else {
        logger.error('Failed to set not ready', response.error);
        setError(response.error || 'Failed to set not ready');
      }
    });
  }, [socket]);

  // Select card
  const selectCard = useCallback(
    (card: Card) => {
      if (!socket || !gameState) return;

      socket.emit(
        'select_card',
        {cardId: card.id},
        (response: {success: boolean; error?: string}) => {
          if (response.success) {
            setGameState((prev) => (prev ? {...prev, selectedCard: card} : null));
          } else {
            setError(response.error || 'Failed to select card');
          }
        }
      );
    },
    [socket, gameState]
  );

  // Send emoji
  const sendEmoji = useCallback(
    (emojiId: string) => {
      if (!socket) return;
      socket.emit('send_emoji', {emojiId});
    },
    [socket]
  );

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Room list updates
    socket.on('room_list', (rooms: Room[]) => {
      setAvailableRooms(rooms);
    });

    // Reconnect success - update room state
    socket.on('reconnect_success', (data: {room: Room}) => {
      logger.success('Reconnected to room', {roomId: data.room.roomId});
      setCurrentRoom(data.room);
    });

    // Full game state on reconnection
    socket.on('game_state_reconnect', (data: GameState) => {
      logger.success('Received full game state on reconnect', {
        currentRound: data.currentRound,
        myScore: data.myScore,
        opponentScore: data.opponentScore,
        cardsCount: data.myCards?.length,
        hasSelectedCard: !!data.selectedCard,
      });

      // Reconstruct full game state
      setGameState({
        roomId: data.roomId,
        gameState: 'playing',
        currentRound: data.currentRound,
        myCards: data.myCards || [],
        myScore: data.myScore,
        opponentScore: data.opponentScore,
        opponentHandSize: data.opponentHandSize,
        selectedCard: data.selectedCard,
        opponentSelected: data.opponentSelected,
        isMyTurn: true,
        roundHistory: data.roundHistory || [],
        roundStartTime: data.roundStartTime,
        timeLimit: data.timeLimit,
      });
    });

    // Room updated (player joined/left, ready status changed)
    socket.on('room_updated', (data: {room: Room}) => {
      logger.socket('Room updated', data);
      setCurrentRoom(data.room);
    });

    // Player joined
    socket.on('player_joined', (data: {playerCount: number; room?: Room}) => {
      logger.game('Player joined', {playerCount: data.playerCount});
      if (data.room) {
        setCurrentRoom(data.room);
      }
    });

    // Player left
    socket.on(
      'player_left',
      (data: {playerCount: number; remainingPlayers: number; room?: Room}) => {
        logger.game('Player left', {
          playerCount: data.playerCount,
          remainingPlayers: data.remainingPlayers,
          room: data.room,
        });
        console.log('🚪 Player Left Event:', {
          hasRoom: !!data.room,
          playersInRoom: data.room?.players?.length,
          players: data.room?.players,
        });
        if (data.room) {
          setCurrentRoom(data.room);
          console.log('✅ CurrentRoom updated after player left');
        } else {
          console.warn('⚠️ No room data in player_left event');
        }
      }
    );

    // Game started
    socket.on('game_started', (data: {roomId: string; cards: Card[]; countdown: number}) => {
      logger.game('Game started', data);
      setGameState({
        roomId: currentRoom?.roomId || '',
        gameState: 'playing',
        currentRound: 0, // Will be incremented when first round starts
        myCards: [],
        myScore: 0,
        opponentScore: 0,
        opponentHandSize: 5,
        selectedCard: null,
        opponentSelected: false,
        isMyTurn: true,
        roundHistory: [],
      });
    });

    // Cards dealt
    socket.on(
      'cards_dealt',
      (data: {
        cards: Card[];
        phase: 'initial' | 'remaining_4' | 'reshuffled';
        message: 'Oyun başladı' | 'Son 4 kartınız' | 'Kartlar karıldı';
      }) => {
        // Check if game is over first
        if (isGameOver(gameState)) {
          logger.warn('Ignoring cards_dealt - game is over');
          return;
        }

        logger.game('Cards dealt', {count: data.cards?.length, phase: data.phase});
        setGameState((prev) => {
          if (!prev) {
            // Initialize if first time
            return {
              roomId: currentRoom?.roomId || '',
              gameState: 'playing',
              currentRound: 0,
              myCards: data.cards,
              myScore: 0,
              opponentScore: 0,
              opponentHandSize: 5,
              selectedCard: null,
              opponentSelected: false,
              isMyTurn: true,
              roundHistory: [],
            };
          }
          return {
            ...prev,
            myCards: data.cards,
            gameState: 'playing',
          };
        });
      }
    );

    // Opponent selected
    socket.on('opponent_selected', (data: {hasSelected: boolean}) => {
      logger.game('Opponent selected card');
      setGameState((prev) => (prev ? {...prev, opponentSelected: data.hasSelected} : null));
    });

    // Round result
    socket.on(
      'round_result',
      (data: {
        winner: string | null;
        myCard: Card;
        opponentCard: Card;
        isDraw: boolean;
        myScore: number;
        opponentScore: number;
        round: number;
        cardsRemaining: {player1: number; player2: number};
        roundHistory: RoundHistoryItem[];
      }) => {
        // Check if already at winning score
        if (data.myScore >= 3 || data.opponentScore >= 3) {
          logger.info('Game ending - player reached winning score', {
            myScore: data.myScore,
            opponentScore: data.opponentScore,
          });
        }

        logger.game('Round result received', {
          round: data.round,
          winner: data.winner ? 'determined' : 'draw',
          myScore: data.myScore,
          opponentScore: data.opponentScore,
          historyCount: data.cardsRemaining.player1 + data.cardsRemaining.player2,
          myCard: data.myCard ? `${data.myCard.type}_${data.myCard.value}` : 'none',
          opponentCard: data.opponentCard
            ? `${data.opponentCard.type} ${data.opponentCard.value}`
            : 'none',
        });

        setGameState((prev) => {
          if (!prev) return null;

          // Convert backend round history to frontend format
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const convertedHistory = (data.roundHistory || []).map((h: any) => {
            // Determine which card is mine based on matching with current round's myCard
            const isPlayer1 = h.player1Card.id === data.myCard.id;

            // Case-insensitive address comparison
            const winnerLower = h.winner?.toLowerCase();
            const myAddressLower = userAddress?.toLowerCase();

            return {
              round: h.round,
              myCard: isPlayer1 ? h.player1Card : h.player2Card,
              opponentCard: isPlayer1 ? h.player2Card : h.player1Card,
              result:
                h.winner === null
                  ? ('draw' as const)
                  : winnerLower === myAddressLower
                    ? ('win' as const)
                    : ('lose' as const),
            };
          });

          logger.game('State update', {
            currentRound: data.round,
            myScore: data.myScore,
            opponentScore: data.opponentScore,
            historyLength: convertedHistory.length,
          });

          return {
            ...prev,
            currentRound: data.round,
            myScore: data.myScore,
            opponentScore: data.opponentScore,
            selectedCard: null,
            opponentSelected: false,
            lastRoundResult: {
              round: data.round,
              myCard: data.myCard,
              opponentCard: data.opponentCard,
              winner: data.winner,
              isDraw: data.isDraw,
              myScore: data.myScore,
              opponentScore: data.opponentScore,
            },
            roundHistory: convertedHistory,
          };
        });
      }
    );

    // New round started (for timer reset)
    socket.on(
      'new_round_started',
      (data: {round: number; timeLimit: number; startTime: number}) => {
        if (isGameOver(gameState)) {
          logger.warn('Ignoring new_round_started - game is over');
          return;
        }

        logger.timer('New round started', {
          round: data.round,
          timeLimit: data.timeLimit,
          startTime: data.startTime,
          clientTime: Date.now(),
          latency: Date.now() - data.startTime,
        });
        setGameState((prev) =>
          prev
            ? {
                ...prev,
                currentRound: data.round,
                selectedCard: null,
                opponentSelected: false,
                lastRoundResult: undefined, // Clear last round result
                roundStartTime: data.startTime, // Store server timestamp
                timeLimit: data.timeLimit, // Store time limit
              }
            : null
        );
      }
    );

    // Game finished
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    socket.on('game_finished', (data: any) => {
      logger.game('Game finished', {
        winner: data.winner,
        myScore: data.myScore,
        opponentScore: data.opponentScore,
        scores: data.scores,
      });
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              gameState: 'finished',
              winner: data.winner,
              myScore: data.myScore,
              opponentScore: data.opponentScore,
              finalScores: data.scores,
              prizeAmount: data.prizeAmount,
            }
          : null
      );
    });

    // Player disconnected
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    socket.on('player_disconnected', (data: any) => {
      logger.warn('Player disconnected', {address: data.address});
    });

    // Player reconnected
    socket.on('player_reconnected', (data: {address: string}) => {
      logger.success('Player reconnected', {address: data.address});
    });

    // Emoji received
    socket.on('emoji_received', (data: {emojiId: string; timestamp?: number}) => {
      logger.game('Emoji received', {emoji: data.emojiId, timestamp: data.timestamp});
      setReceivedEmoji({
        emoji: data.emojiId,
        timestamp: data.timestamp || Date.now(),
      });
      // Auto-clear after 2.5 seconds
      setTimeout(() => setReceivedEmoji(null), 1500);
    });

    // Cards revealed (when both players select)
    socket.on('cards_revealed', (data: {player1Card: string; player2Card: string}) => {
      logger.game('Cards revealed', {
        player1Card: data.player1Card,
        player2Card: data.player2Card,
      });
      // This is handled by the round_result event, but we log it for debugging
    });

    // AFK warning (player was AFK and card was auto-selected)
    socket.on('afk_warning', (data: {message: string; autoSelectedCard: string}) => {
      logger.warn('AFK warning received', {
        message: data.message,
        card: data.autoSelectedCard,
      });
      setError(data.message);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    });

    // Both players AFK warning
    socket.on('both_afk_warning', (data: {message: string; consecutiveAfkRounds: number}) => {
      logger.warn('Both players AFK warning', {
        message: data.message,
        consecutiveRounds: data.consecutiveAfkRounds,
      });
      setError(data.message);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    });

    // Room dismissed due to repeated AFK
    socket.on('room_dismissed_afk', (data: {message: string}) => {
      logger.error('Room dismissed - repeated AFK', {message: data.message});
      setError(data.message);
      // Reset state
      setCurrentRoom(null);
      setGameState(null);
      localStorage.removeItem('gameSessionToken');
      localStorage.removeItem('currentRoomId');
    });

    // Error
    socket.on('error', (data: {message: string}) => {
      logger.error('Socket error', data.message);
      setError(data.message || 'An error occurred');
    });

    return () => {
      socket.off('room_list');
      socket.off('reconnect_success');
      socket.off('game_state_reconnect');
      socket.off('room_updated');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_started');
      socket.off('cards_dealt');
      socket.off('opponent_selected');
      socket.off('round_result');
      socket.off('new_round_started');
      socket.off('game_finished');
      socket.off('player_disconnected');
      socket.off('player_reconnected');
      socket.off('emoji_received');
      socket.off('cards_revealed');
      socket.off('afk_warning');
      socket.off('both_afk_warning');
      socket.off('room_dismissed_afk');
      socket.off('error');
    };
  }, [socket]);

  // Fetch rooms on mount and every 5 seconds
  useEffect(() => {
    if (!isConnected) return;

    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);

    return () => clearInterval(interval);
  }, [isConnected, fetchRooms]);

  // Clear animations helper
  const clearAnimations = useCallback(() => {
    setReceivedEmoji(null);
  }, []);

  return {
    availableRooms,
    currentRoom,
    gameState,
    loading,
    error,
    receivedEmoji,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    setReady,
    setNotReady,
    selectCard,
    sendEmoji,
    clearAnimations,
  };
};
