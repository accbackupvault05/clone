import { Server, Socket } from 'socket.io';
import { logger } from '@/utils/logger';
import { ISocketUser } from '@/types';
import redisClient from '@/config/redis';

// Store connected users
const connectedUsers = new Map<string, ISocketUser>();

export const initializeSocket = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    // Generate a simple user ID for demo purposes
    const userId = `user_${socket.id}`;
    const username = `User_${socket.id.substring(0, 6)}`;
    
    logger.info(`User connected: ${username} (${socket.id})`);

    // Store user connection
    const socketUser: ISocketUser = {
      userId: userId,
      socketId: socket.id,
      username: username,
      isOnline: true,
      lastSeen: new Date()
    };
    
    connectedUsers.set(userId, socketUser);

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Notify friends that user is online
    socket.broadcast.emit('user:online', {
      userId: userId,
      username: username
    });

    // Handle joining conversation rooms
    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${username} joined conversation: ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${username} left conversation: ${conversationId}`);
    });

    // Handle sending messages
    socket.on('message:send', async (data: {
      conversationId: string;
      recipientId: string;
      type: string;
      text?: string;
      mediaUrl?: string;
    }) => {
      try {
        // Emit to conversation room
        socket.to(`conversation:${data.conversationId}`).emit('message:receive', {
          ...data,
          senderId: userId,
          senderUsername: username,
          timestamp: new Date()
        });

        // Emit to recipient's personal room for notifications
        socket.to(`user:${data.recipientId}`).emit('notification:message', {
          senderId: userId,
          senderUsername: username,
          conversationId: data.conversationId,
          type: data.type,
          preview: data.text?.substring(0, 50) || 'Media message'
        });

        logger.info(`Message sent from ${username} in conversation: ${data.conversationId}`);
      } catch (error) {
        logger.error('Error handling message send:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { conversationId: string; recipientId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:start', {
        userId: userId,
        username: username
      });
    });

    socket.on('typing:stop', (data: { conversationId: string; recipientId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
        userId: userId,
        username: username
      });
    });

    // Handle snap notifications
    socket.on('snap:send', (data: {
      recipientIds: string[];
      type: string;
      snapId: string;
    }) => {
      data.recipientIds.forEach(recipientId => {
        socket.to(`user:${recipientId}`).emit('notification:snap', {
          senderId: userId,
          senderUsername: username,
          snapId: data.snapId,
          type: data.type
        });
      });

      logger.info(`Snap sent from ${username} to ${data.recipientIds.length} recipients`);
    });

    // Handle story notifications
    socket.on('story:create', (data: {
      storyId: string;
      type: string;
    }) => {
      // Notify all friends about new story
      socket.broadcast.emit('notification:story', {
        userId: userId,
        username: username,
        storyId: data.storyId,
        type: data.type
      });

      logger.info(`Story created by ${username}: ${data.storyId}`);
    });

    // Handle friend requests
    socket.on('friend:request', (data: { recipientId: string }) => {
      socket.to(`user:${data.recipientId}`).emit('notification:friend_request', {
        senderId: userId,
        senderUsername: username
      });

      logger.info(`Friend request sent from ${username} to user: ${data.recipientId}`);
    });

    // Handle call events
    socket.on('call:initiate', (data: {
      recipientId: string;
      type: 'video' | 'audio';
      offer: any;
    }) => {
      socket.to(`user:${data.recipientId}`).emit('call:incoming', {
        callerId: userId,
        callerUsername: username,
        type: data.type,
        offer: data.offer
      });

      logger.info(`${data.type} call initiated from ${username} to user: ${data.recipientId}`);
    });

    socket.on('call:answer', (data: {
      callerId: string;
      answer: any;
    }) => {
      socket.to(`user:${data.callerId}`).emit('call:answered', {
        answer: data.answer
      });
    });

    socket.on('call:reject', (data: { callerId: string }) => {
      socket.to(`user:${data.callerId}`).emit('call:rejected');
    });

    socket.on('call:end', (data: { recipientId: string }) => {
      socket.to(`user:${data.recipientId}`).emit('call:ended');
    });

    // Handle ICE candidates for WebRTC
    socket.on('call:ice-candidate', (data: {
      recipientId: string;
      candidate: any;
    }) => {
      socket.to(`user:${data.recipientId}`).emit('call:ice-candidate', {
        candidate: data.candidate
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${username} (${socket.id})`);

      // Remove user from connected users
      connectedUsers.delete(userId);

      // Skip Redis for testing
      logger.info(`User ${username} last seen updated (Redis skipped for testing)`);

      // Notify friends that user is offline
      socket.broadcast.emit('user:offline', {
        userId: userId,
        username: username,
        lastSeen: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${username}:`, error);
    });
  });

  logger.info('Socket.IO server initialized');
};

// Helper functions
export const getConnectedUsers = (): ISocketUser[] => {
  return Array.from(connectedUsers.values());
};

export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId);
};

export const getUserSocket = (userId: string): ISocketUser | undefined => {
  return connectedUsers.get(userId);
};

export const emitToUser = (io: Server, userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToConversation = (io: Server, conversationId: string, event: string, data: any): void => {
  io.to(`conversation:${conversationId}`).emit(event, data);
};