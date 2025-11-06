// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bitmoji?: string;
  snapcode: string;
  bio?: string;
  snapScore: number;
  friends: User[];
  bestFriends: User[];
  settings: UserSettings;
  createdAt: string;
}

export interface UserSettings {
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



// Message Types
export interface Message {
  id: string;
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
  readAt?: string;
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface SendMessageData {
  recipientId: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'location';
  text?: string;
  mediaFile?: File;
  location?: {
    lat: number;
    lng: number;
  };
}

// Conversation Types
export interface Conversation {
  id: string;
  participantIds: string[];
  participants: User[];
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  lastMessageAt: string;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  groupAdmin?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Snap Types
export interface Snap {
  id: string;
  senderId: string;
  sender: User;
  recipientIds: string[];
  recipients: User[];
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: string;
  duration?: number;
  viewDuration: number;
  views: SnapView[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SnapView {
  userId: string;
  user: User;
  viewedAt: string;
  screenshot: boolean;
}

export interface SendSnapData {
  recipientIds: string[];
  type: 'image' | 'video';
  mediaFile: File;
  caption?: string;
  viewDuration: number;
  filterUsed?: string;
}

// Story Types
export interface Story {
  id: string;
  userId: string;
  user: User;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: string;
  duration?: number;
  visibility: 'public' | 'friends' | 'custom';
  customViewers: string[];
  views: StoryView[];
  replies: StoryReply[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoryView {
  userId: string;
  user: User;
  viewedAt: string;
  screenshot: boolean;
}

export interface StoryReply {
  userId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface CreateStoryData {
  type: 'image' | 'video';
  mediaFile: File;
  caption?: string;
  visibility: 'public' | 'friends' | 'custom';
  customViewers?: string[];
  filterUsed?: string;
}

// Friendship Types
export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  friend: User;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: string;
  acceptedAt?: string;
  blockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'snap' | 'message' | 'story' | 'friendRequest' | 'call';
  relatedUserId: string;
  relatedUser: User;
  relatedItemId?: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
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

// Socket Types
export interface SocketMessage {
  conversationId: string;
  recipientId: string;
  type: string;
  text?: string;
  mediaUrl?: string;
}

export interface SocketNotification {
  type: 'message' | 'snap' | 'story' | 'friend_request' | 'call';
  senderId: string;
  senderUsername: string;
  data: any;
}

// UI Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    weights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// File Upload Types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Camera Types
export interface CameraSettings {
  facingMode: 'user' | 'environment';
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
}

// Call Types
export interface CallData {
  callerId: string;
  callerUsername: string;
  type: 'video' | 'audio';
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

// Location Types
export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  timestamp: number;
}