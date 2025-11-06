import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// User Types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  bitmoji?: string;
  snapcode: string;
  bio?: string;
  snapScore: number;
  streaks: IStreak[];
  bestFriends: string[];
  friends: string[];
  blockedUsers: string[];
  settings: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSettings {
  privacy: {
    whoCanSendMeSnaps: 'everyone' | 'friends' | 'custom';
    whoCanViewMyStory: 'everyone' | 'friends' | 'custom';
    whoCanSeeMyLocation: 'everyone' | 'friends' | 'nobody';
  };
  notifications: {
    snapNotifications: boolean;
    messageNotifications: boolean;
    storyNotifications: boolean;
    friendRequestNotifications: boolean;
  };
}

export interface IStreak {
  friendId: string;
  count: number;
  lastUpdate: Date;
}

// Message Types
export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'location';
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  duration?: number;
  location?: {
    lat: number;
    lng: number;
  };
  read: boolean;
  readAt?: Date;
  deletedFor: string[];
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

// Snap Types
export interface ISnap {
  _id: string;
  senderId: string;
  recipientIds: string[];
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: string;
  duration?: number;
  viewDuration: number;
  views: ISnapView[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISnapView {
  userId: string;
  viewedAt: Date;
  screenshot: boolean;
}

// Story Types
export interface IStory {
  _id: string;
  userId: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: string;
  duration?: number;
  visibility: 'public' | 'friends' | 'custom';
  customViewers: string[];
  views: IStoryView[];
  replies: IStoryReply[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStoryView {
  userId: string;
  viewedAt: Date;
  screenshot: boolean;
}

export interface IStoryReply {
  userId: string;
  text: string;
  createdAt: Date;
}

// Conversation Types
export interface IConversation {
  _id: string;
  participantIds: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: Date;
  };
  lastMessageAt: Date;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  groupAdmin?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Friendship Types
export interface IFriendship {
  _id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: Date;
  acceptedAt?: Date;
  blockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface INotification {
  _id: string;
  userId: string;
  type: 'snap' | 'message' | 'story' | 'friendRequest' | 'call';
  relatedUserId: string;
  relatedItemId?: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Types
export interface IJwtPayload extends JwtPayload {
  userId: string;
  username: string;
  email: string;
}

// Express Request with User
export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

// Socket Types
export interface ISocketUser {
  userId: string;
  socketId: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// File Upload Types
export interface IFileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Pagination Types
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}