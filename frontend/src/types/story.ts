export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  duration: number; // in seconds
  createdAt: Date;
  expiresAt: Date;
  views: StoryView[];
  isViewed?: boolean;
  caption?: string;
  filters?: string[];
  music?: {
    id: string;
    title: string;
    artist: string;
    url: string;
  };
}

export interface StoryView {
  id: string;
  userId: string;
  viewedAt: Date;
}

export interface StoryRing {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  stories: Story[];
  hasUnviewed: boolean;
  lastStoryAt: Date;
}

export interface StoryState {
  rings: StoryRing[];
  currentStoryIndex: number;
  currentRingIndex: number;
  isViewing: boolean;
  isLoading: boolean;
  error: string | null;
}