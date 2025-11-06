import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, Conversation, User, ChatState } from '../types/chat';

export interface UseChatReturn extends ChatState {
  sendMessage: (conversationId: string, content: string, type?: Message['type']) => Promise<void>;
  markAsRead: (conversationId: string, messageId: string) => Promise<void>;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  createConversation: (participantIds: string[]) => Promise<string>;
  loadMessages: (conversationId: string, offset?: number) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const useChat = (userId?: string): UseChatReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: {},
    isLoading: false,
    error: null,
    typingUsers: {},
  });

  // Connect to socket
  const connect = useCallback(() => {
    if (!userId || socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setChatState(prev => ({ ...prev, error: null }));
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (error: string) => {
      setChatState(prev => ({ ...prev, error }));
    });

    // Message events
    socket.on('message:received', (message: Message) => {
      setChatState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [message.receiverId]: [
            ...(prev.messages[message.receiverId] || []),
            message,
          ],
        },
      }));
      
      // Update conversation last message
      setChatState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === message.receiverId
            ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
            : conv
        ),
      }));
    });

    socket.on('message:delivered', (messageId: string) => {
      setChatState(prev => ({
        ...prev,
        messages: Object.keys(prev.messages).reduce((acc, convId) => ({
          ...acc,
          [convId]: prev.messages[convId].map(msg =>
            msg.id === messageId ? { ...msg, isDelivered: true } : msg
          ),
        }), {}),
      }));
    });

    socket.on('message:read', (messageId: string) => {
      setChatState(prev => ({
        ...prev,
        messages: Object.keys(prev.messages).reduce((acc, convId) => ({
          ...acc,
          [convId]: prev.messages[convId].map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          ),
        }), {}),
      }));
    });

    // Typing events
    socket.on('typing:start', ({ conversationId, userId: typingUserId }: { conversationId: string; userId: string }) => {
      setChatState(prev => ({
        ...prev,
        typingUsers: {
          ...prev.typingUsers,
          [conversationId]: [
            ...(prev.typingUsers[conversationId] || []).filter(id => id !== typingUserId),
            typingUserId,
          ],
        },
      }));
    });

    socket.on('typing:stop', ({ conversationId, userId: typingUserId }: { conversationId: string; userId: string }) => {
      setChatState(prev => ({
        ...prev,
        typingUsers: {
          ...prev.typingUsers,
          [conversationId]: (prev.typingUsers[conversationId] || []).filter(id => id !== typingUserId),
        },
      }));
    });

    // Conversation events
    socket.on('conversation:created', (conversation: Conversation) => {
      setChatState(prev => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
      }));
    });

    socket.on('conversation:updated', (conversation: Conversation) => {
      setChatState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversation.id ? conversation : conv
        ),
      }));
    });
  }, [userId]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: Message['type'] = 'text'
  ): Promise<void> => {
    if (!socketRef.current || !userId) return;

    const message: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'isDelivered'> = {
      senderId: userId,
      receiverId: conversationId,
      content,
      type,
    };

    socketRef.current.emit('message:send', message);
  }, [userId]);

  // Mark message as read
  const markAsRead = useCallback(async (
    conversationId: string,
    messageId: string
  ): Promise<void> => {
    if (!socketRef.current) return;

    socketRef.current.emit('message:read', { conversationId, messageId });
    
    // Update local state
    setChatState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: prev.messages[conversationId]?.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ) || [],
      },
    }));
  }, []);

  // Start typing indicator
  const startTyping = useCallback((conversationId: string) => {
    if (!socketRef.current || !userId) return;
    socketRef.current.emit('typing:start', { conversationId, userId });
  }, [userId]);

  // Stop typing indicator
  const stopTyping = useCallback((conversationId: string) => {
    if (!socketRef.current || !userId) return;
    socketRef.current.emit('typing:stop', { conversationId, userId });
  }, [userId]);

  // Create new conversation
  const createConversation = useCallback(async (participantIds: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !userId) {
        reject(new Error('Not connected'));
        return;
      }

      socketRef.current.emit('conversation:create', { participantIds }, (response: { success: boolean; conversationId?: string; error?: string }) => {
        if (response.success && response.conversationId) {
          resolve(response.conversationId);
        } else {
          reject(new Error(response.error || 'Failed to create conversation'));
        }
      });
    });
  }, [userId]);

  // Load messages for conversation
  const loadMessages = useCallback(async (
    conversationId: string,
    offset: number = 0
  ): Promise<void> => {
    if (!socketRef.current) return;

    setChatState(prev => ({ ...prev, isLoading: true }));

    socketRef.current.emit('messages:load', { conversationId, offset }, (messages: Message[]) => {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        messages: {
          ...prev.messages,
          [conversationId]: offset === 0 ? messages : [
            ...messages,
            ...(prev.messages[conversationId] || []),
          ],
        },
      }));
    });
  }, []);

  // Load conversations on connect
  useEffect(() => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit('conversations:load', (conversations: Conversation[]) => {
        setChatState(prev => ({
          ...prev,
          conversations: conversations.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ),
        }));
      });
    }
  }, [isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    ...chatState,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    createConversation,
    loadMessages,
    connect,
    disconnect,
    isConnected,
  };
};