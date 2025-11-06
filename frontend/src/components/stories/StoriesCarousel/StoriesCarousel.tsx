import React, { useRef, useState, useCallback } from 'react';
import { StoryRing } from '../StoryRing';
import { StoriesCarouselProps } from './StoriesCarousel.types';
import {
  CarouselContainer,
  CarouselWrapper,
  CarouselTrack,
  StoryRingWrapper,
  LoadingContainer,
  EmptyState,
  ScrollButton,
  CreateStoryButton,
  CreateButton,
  CreateLabel,
} from './StoriesCarousel.styles';

// Arrow icons
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

/**
 * StoriesCarousel component for displaying story rings in a horizontal scrollable list
 */
export const StoriesCarousel: React.FC<StoriesCarouselProps> = ({
  rings,
  onStoryClick,
  onCreateStory,
  isLoading = false,
  className,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (!trackRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const scrollLeft = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  }, [checkScrollButtons]);

  const scrollRight = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  }, [checkScrollButtons]);

  const handleStoryClick = useCallback((ring: any) => {
    onStoryClick?.(ring);
  }, [onStoryClick]);

  const handleCreateStory = useCallback(() => {
    onCreateStory?.();
  }, [onCreateStory]);

  // Check scroll buttons on mount and scroll
  React.useEffect(() => {
    checkScrollButtons();
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', checkScrollButtons);
      return () => track.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons, rings]);

  if (isLoading) {
    return (
      <CarouselContainer className={className}>
        <LoadingContainer>
          <div className="spinner" />
        </LoadingContainer>
      </CarouselContainer>
    );
  }

  if (rings.length === 0) {
    return (
      <CarouselContainer className={className}>
        <EmptyState>
          <h3>📖 No Stories Yet</h3>
          <p>
            Be the first to share a story! Stories disappear after 24 hours.
          </p>
        </EmptyState>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer className={className}>
      <CarouselWrapper>
        <ScrollButton
          $direction="left"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeftIcon />
        </ScrollButton>
        
        <CarouselTrack ref={trackRef}>
          {/* Create Story Button */}
          <CreateStoryButton onClick={handleCreateStory}>
            <CreateButton />
            <CreateLabel>Add Story</CreateLabel>
          </CreateStoryButton>
          
          {/* Story Rings */}
          {rings.map((ring) => (
            <StoryRingWrapper key={ring.userId}>
              <StoryRing
                ring={ring}
                size="medium"
                onClick={handleStoryClick}
                showLabel={true}
              />
            </StoryRingWrapper>
          ))}
        </CarouselTrack>
        
        <ScrollButton
          $direction="right"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRightIcon />
        </ScrollButton>
      </CarouselWrapper>
    </CarouselContainer>
  );
};

export default StoriesCarousel;