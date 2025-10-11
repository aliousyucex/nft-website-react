import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { Room, GameState, Card, RoundResult } from '../types';

export const useGame = (userAddress: string) => {
  const { socket, isConnected } = useSocket();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available rooms
  const fetchRooms = useCallback(() => {
    if (!socket) return;

    socket.emit('get_rooms', (response: any) => {
      if (response.success) {
        setAvailableRooms(response.rooms);
      }
    });
  }, [socket]);

  // Create room
  const createRoom = useCallback(
    (betAmount: number, password?: string) => {
      if (!socket) return;

      setLoading(true);
      setError(null);

      socket.emit(
        'create_room',
        {
          betAmount,
          password,
          address: userAddress,
        },
        (response: any) => {
          console.log('create_room response:', response);
          setLoading(false);
          if (response.success) {
            console.log('Room data:', response.room);
            setCurrentRoom(response.room);
            // Save session token
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
            }
          } else {
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
        (response: any) => {
          setLoading(false);
          if (response.success) {
            setCurrentRoom(response.room);
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
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
    (betAmount: number) => {
      if (!socket) return;

      setLoading(true);
      setError(null);

      socket.emit(
        'quick_join',
        {
          betAmount,
          address: userAddress,
        },
        (response: any) => {
          setLoading(false);
          if (response.success) {
            setCurrentRoom(response.room);
            if (response.sessionToken) {
              localStorage.setItem('gameSessionToken', response.sessionToken);
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

    socket.emit('leave_room', (response: any) => {
      if (response.success) {
        setCurrentRoom(null);
        setGameState(null);
        localStorage.removeItem('gameSessionToken');
      }
    });
  }, [socket]);

  // Player ready
  const setReady = useCallback(() => {
    if (!socket) return;

    socket.emit('player_ready', (response: any) => {
      console.log('player_ready response:', response);
      if (response.success) {
        if (response.room) {
          setCurrentRoom(response.room);
        }
      } else {
        setError(response.error || 'Failed to set ready');
      }
    });
  }, [socket]);

  // Select card
  const selectCard = useCallback(
    (card: Card) => {
      if (!socket || !gameState) return;

      socket.emit('select_card', { cardId: card.id }, (response: any) => {
        if (response.success) {
          setGameState((prev) => (prev ? { ...prev, selectedCard: card } : null));
        } else {
          setError(response.error || 'Failed to select card');
        }
      });
    },
    [socket, gameState]
  );

  // Send emoji
  const sendEmoji = useCallback(
    (emojiId: string) => {
      if (!socket) return;
      socket.emit('send_emoji', { emojiId });
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

    // Room updated (player joined/left, ready status changed)
    socket.on('room_updated', (data: { room: Room }) => {
      console.log('Room updated:', data);
      setCurrentRoom(data.room);
    });

    // Player joined
    socket.on('player_joined', (data: any) => {
      console.log('Player joined:', data);
      if (data.room) {
        setCurrentRoom(data.room);
      }
    });

    // Player left
    socket.on('player_left', (data: any) => {
      console.log('Player left:', data);
      if (data.room) {
        setCurrentRoom(data.room);
      }
    });

    // Game started
    socket.on('game_started', (data: any) => {
      console.log('Game started:', data);
      setGameState((prev) => ({
        ...prev!,
        gameState: 'playing',
      }));
    });

    // Cards dealt
    socket.on('cards_dealt', (data: any) => {
      setGameState((prev) => ({
        ...prev!,
        myCards: data.cards,
        gameState: 'playing',
      }));
    });

    // Opponent selected
    socket.on('opponent_selected', (data: any) => {
      setGameState((prev) => (prev ? { ...prev, opponentSelected: data.hasSelected } : null));
    });

    // Round result
    socket.on('round_result', (data: RoundResult) => {
      console.log('Round result:', data);
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              myScore: data.myScore,
              opponentScore: data.opponentScore,
              selectedCard: null,
              opponentSelected: false,
            }
          : null
      );
    });

    // Game finished
    socket.on('game_finished', (data: any) => {
      console.log('Game finished:', data);
      setGameState((prev) => (prev ? { ...prev, gameState: 'finished' } : null));
    });

    // Player disconnected
    socket.on('player_disconnected', (data: any) => {
      console.log('Player disconnected:', data);
    });

    // Error
    socket.on('error', (data: any) => {
      setError(data.message || 'An error occurred');
    });

    return () => {
      socket.off('room_list');
      socket.off('room_updated');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_started');
      socket.off('cards_dealt');
      socket.off('opponent_selected');
      socket.off('round_result');
      socket.off('game_finished');
      socket.off('player_disconnected');
      socket.off('error');
    };
  }, [socket]);

  // Fetch rooms on mount and every 5 seconds
  useEffect(() => {
    if (!isConnected) return;

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);

    return () => clearInterval(interval);
  }, [isConnected, fetchRooms]);

  return {
    availableRooms,
    currentRoom,
    gameState,
    loading,
    error,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    setReady,
    selectCard,
    sendEmoji,
  };
};

