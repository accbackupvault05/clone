export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'snap';
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // for video/audio messages
  snapData?: {
    viewDuration: number;
    isViewed: boolean;
    viewedAt?: Date;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>; // conversationId -> userIds
}