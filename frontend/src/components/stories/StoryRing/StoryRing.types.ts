import { StoryRing } from '../../../types/story';

export interface StoryRingProps {
  ring: StoryRing;
  size?: 'small' | 'medium' | 'large';
  onClick?: (ring: StoryRing) => void;
  showLabel?: boolean;
  className?: string;
}