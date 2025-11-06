import React, { useCallback } from 'react';
import { StoryRingProps } from './StoryRing.types';
import {
  RingContainer,
  RingWrapper,
  Avatar,
  AddStoryButton,
  Label,
  StoryCount,
  LiveIndicator,
} from './StoryRing.styles';

/**
 * StoryRing component for displaying user story rings
 * Shows avatar with gradient border for unviewed stories
 */
export const StoryRing: React.FC<StoryRingProps> = ({
  ring,
  size = 'medium',
  onClick,
  showLabel = true,
  className,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(ring);
  }, [onClick, ring]);

  const isCurrentUser = ring.userId === 'current-user'; // TODO: Get from auth context
  const hasUnviewedStories = ring.hasUnviewed;
  const isAllViewed = ring.stories.every(story => story.isViewed);
  const unviewedCount = ring.stories.filter(story => !story.isViewed).length;

  return (
    <RingContainer $size={size} onClick={handleClick} className={className}>
      <RingWrapper
        $size={size}
        $hasUnviewed={hasUnviewedStories}
        $isViewed={isAllViewed}
      >
        <Avatar
          $src={ring.avatar}
          $size={size}
        >
          {!ring.avatar && ring.displayName.charAt(0).toUpperCase()}
        </Avatar>
        
        {isCurrentUser && (
          <AddStoryButton $size={size} />
        )}
        
        {unviewedCount > 1 && (
          <StoryCount>{unviewedCount}</StoryCount>
        )}
        
        {/* TODO: Add live indicator for live stories */}
      </RingWrapper>
      
      {showLabel && (
        <Label $size={size}>
          {isCurrentUser ? 'Your Story' : ring.displayName}
        </Label>
      )}
    </RingContainer>
  );
};

export default StoryRing;