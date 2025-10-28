import type React from 'react';
import {type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import {type Socket, io } from 'socket.io-client';

// Connect directly to backend (Vite proxy doesn't work well with Socket.IO)
const SOCKET_URL = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  address?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children, address}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);

      // Try to reconnect to room if sessionToken exists
      const sessionToken = localStorage.getItem('gameSessionToken');
      const roomId = localStorage.getItem('currentRoomId');

      if (sessionToken && roomId && address) {
        newSocket.emit(
          'reconnect_to_room',
          {
            roomId,
            address,
            sessionToken,
          },
          (response: {success: boolean; error: string}) => {
            if (!response.success) {
              // Clear invalid tokens
              localStorage.removeItem('gameSessionToken');
              localStorage.removeItem('currentRoomId');
            }
          }
        );
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
      setIsConnected(false);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'Socket error occurred');
    });

    // Health check
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 25000);

    setSocket(newSocket);

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, [address]);

  return (
    <SocketContext.Provider value={{socket, isConnected, error}}>{children}</SocketContext.Provider>
  );
};
