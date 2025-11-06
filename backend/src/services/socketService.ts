import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import { IJwtPayload, ISocketUser } from '@/types';
import redisClient from '@/config/redis';

// Store connected users
const connectedUsers = new Map<string, ISocketUser>();

export const initializeSocket = (io: Server): void => {
  // Authentication middleware for socket connections
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
      
      // Attach user info to socket
      (socket as any).user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as IJwtPayload;
    
    logger.info(`User connected: ${user.username} (${socket.id})`);

    // Store user connection
    const socketUser: ISocketUser = {
      userId: user.userId,
      socketId: socket.id,
      username: user.username,
      isOnline: true,
      lastSeen: new Date()
    };
    
    connectedUsers.set(user.userId, socketUser);

    // Join user to their personal room
    socket.join(`user:${user.userId}`);

    // Notify friends that user is online
    socket.broadcast.emit('user:online', {
      userId: user.userId,
      username: user.username
    });

    // Handle joining conversation rooms
    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${user.username} joined conversation: ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${user.username} left conversation: ${conversationId}`);
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
          senderId: user.userId,
          senderUsername: user.username,
          timestamp: new Date()
        });

        // Emit to recipient's personal room for notifications
        socket.to(`user:${data.recipientId}`).emit('notification:message', {
          senderId: user.userId,
          senderUsername: user.username,
          conversationId: data.conversationId,
          type: data.type,
          preview: data.text?.substring(0, 50) || 'Media message'
        });

        logger.info(`Message sent from ${user.username} in conversation: ${data.conversationId}`);
      } catch (error) {
        logger.error('Error handling message send:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { conversationId: string; recipientId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:start', {
        userId: user.userId,
        username: user.username
      });
    });

    socket.on('typing:stop', (data: { conversationId: string; recipientId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
        userId: user.userId,
        username: user.username
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
          senderId: user.userId,
          senderUsername: user.username,
          snapId: data.snapId,
          type: data.type
        });
      });

      logger.info(`Snap sent from ${user.username} to ${data.recipientIds.length} recipients`);
    });

    // Handle story notifications
    socket.on('story:create', (data: {
      storyId: string;
      type: string;
    }) => {
      // Notify all friends about new story
      socket.broadcast.emit('notification:story', {
        userId: user.userId,
        username: user.username,
        storyId: data.storyId,
        type: data.type
      });

      logger.info(`Story created by ${user.username}: ${data.storyId}`);
    });

    // Handle friend requests
    socket.on('friend:request', (data: { recipientId: string }) => {
      socket.to(`user:${data.recipientId}`).emit('notification:friend_request', {
        senderId: user.userId,
        senderUsername: user.username
      });

      logger.info(`Friend request sent from ${user.username} to user: ${data.recipientId}`);
    });

    // Handle call events
    socket.on('call:initiate', (data: {
      recipientId: string;
      type: 'video' | 'audio';
      offer: any;
    }) => {
      socket.to(`user:${data.recipientId}`).emit('call:incoming', {
        callerId: user.userId,
        callerUsername: user.username,
        type: data.type,
        offer: data.offer
      });

      logger.info(`${data.type} call initiated from ${user.username} to user: ${data.recipientId}`);
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
      logger.info(`User disconnected: ${user.username} (${socket.id})`);

      // Remove user from connected users
      connectedUsers.delete(user.userId);

      // Update last seen in Redis
      await redisClient.setEx(`user:${user.userId}:last_seen`, 24 * 60 * 60, new Date().toISOString());

      // Notify friends that user is offline
      socket.broadcast.emit('user:offline', {
        userId: user.userId,
        username: user.username,
        lastSeen: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${user.username}:`, error);
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