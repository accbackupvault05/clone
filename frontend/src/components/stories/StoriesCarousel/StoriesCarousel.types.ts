import { StoryRing } from '../../../types/story';

export interface StoriesCarouselProps {
  rings: StoryRing[];
  onStoryClick?: (ring: StoryRing, storyIndex?: number) => void;
  onCreateStory?: () => void;
  isLoading?: boolean;
  className?: string;
}