import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketMessage, SocketNotification } from '@/types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (message: SocketMessage) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string, recipientId: string) => void;
  stopTyping: (conversationId: string, recipientId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    // Initialize socket connection without authentication
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setIsConnected(true);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Message event handlers
      socket.on('message:receive', (data: any) => {
        console.log('Message received:', data);
        // Handle incoming message
        // This would typically update the messages state in a messages context
      });

      socket.on('notification:message', (data: SocketNotification) => {
        toast.success(`New message from ${data.senderUsername}`);
      });

      socket.on('notification:snap', (data: SocketNotification) => {
        toast.success(`New snap from ${data.senderUsername}`);
      });

      socket.on('notification:story', (data: SocketNotification) => {
        toast.success(`${data.senderUsername} posted a new story`);
      });

      socket.on('notification:friend_request', (data: SocketNotification) => {
        toast.success(`Friend request from ${data.senderUsername}`);
      });

      // User status event handlers
      socket.on('user:online', (data: { userId: string; username: string }) => {
        console.log(`${data.username} is now online`);
      });

      socket.on('user:offline', (data: { userId: string; username: string; lastSeen: string }) => {
        console.log(`${data.username} is now offline`);
      });

      // Typing event handlers
      socket.on('typing:start', (data: { userId: string; username: string }) => {
        console.log(`${data.username} is typing...`);
      });

      socket.on('typing:stop', (data: { userId: string; username: string }) => {
        console.log(`${data.username} stopped typing`);
      });

      // Call event handlers
      socket.on('call:incoming', (data: any) => {
        console.log('Incoming call:', data);
        toast.success(`Incoming ${data.type} call from ${data.callerUsername}`);
      });

      socket.on('call:answered', (data: any) => {
        console.log('Call answered:', data);
      });

      socket.on('call:rejected', () => {
        console.log('Call rejected');
        toast.error('Call was rejected');
      });

      socket.on('call:ended', () => {
        console.log('Call ended');
        toast.success('Call ended');
      });

      socket.on('call:ice-candidate', (data: any) => {
        console.log('ICE candidate received:', data);
      });

      // Error handler
      socket.on('error', (error: any) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'Connection error');
      });

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (message: SocketMessage): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message:send', message);
    }
  };

  const joinConversation = (conversationId: string): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join:conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave:conversation', conversationId);
    }
  };

  const startTyping = (conversationId: string, recipientId: string): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing:start', { conversationId, recipientId });
    }
  };

  const stopTyping = (conversationId: string, recipientId: string): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing:stop', { conversationId, recipientId });
    }
  };

  const contextValue: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};