import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { StoriesCarousel } from '../components/stories/StoriesCarousel';
import { StoryRing } from '../types/story';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fonts.sizes.xl};
    margin: 0;
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FeaturedSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  
  h2 {
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StoryCard = styled.div`
  aspect-ratio: 9/16;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StoryPreview = styled.div<{ $backgroundImage?: string }>`
  width: 100%;
  height: 100%;
  background-image: ${({ $backgroundImage }) => $backgroundImage ? `url(${$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const StoryInfo = styled.div`
  color: ${({ theme }) => theme.colors.white};
  
  h3 {
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    font-weight: ${({ theme }) => theme.fonts.weights.semibold};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: ${({ theme }) => theme.fonts.sizes.xs};
    margin: 0;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    max-width: 400px;
  }
`;

// Mock data for demonstration
const mockStoryRings: StoryRing[] = [
  {
    userId: 'user1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '',
    hasUnviewed: true,
    lastStoryAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    stories: [
      {
        id: 'story1',
        userId: 'user1',
        mediaUrl: '/story1.jpg',
        type: 'image',
        duration: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.5), // 23.5 hours from now
        views: [],
        isViewed: false,
        caption: 'Beautiful sunset today! 🌅',
      },
    ],
  },
  {
    userId: 'user2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: '',
    hasUnviewed: true,
    lastStoryAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    stories: [
      {
        id: 'story2',
        userId: 'user2',
        mediaUrl: '/story2.jpg',
        type: 'image',
        duration: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23),
        views: [],
        isViewed: false,
        caption: 'Coffee time ☕',
      },
      {
        id: 'story3',
        userId: 'user2',
        mediaUrl: '/story3.mp4',
        type: 'video',
        duration: 10,
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.25),
        views: [],
        isViewed: false,
        caption: 'Quick workout session 💪',
      },
    ],
  },
  {
    userId: 'user3',
    username: 'mike_wilson',
    displayName: 'Mike Wilson',
    avatar: '',
    hasUnviewed: false,
    lastStoryAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    stories: [
      {
        id: 'story4',
        userId: 'user3',
        mediaUrl: '/story4.jpg',
        type: 'image',
        duration: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22),
        views: [{ id: 'view1', userId: 'current-user', viewedAt: new Date() }],
        isViewed: true,
        caption: 'New haircut! What do you think? ✂️',
      },
    ],
  },
];

const StoriesPage: React.FC = () => {
  const [storyRings] = useState<StoryRing[]>(mockStoryRings);

  const handleStoryClick = useCallback((ring: StoryRing) => {
    console.log('Opening story for:', ring.displayName);
    // TODO: Open story viewer
  }, []);

  const handleCreateStory = useCallback(() => {
    console.log('Creating new story');
    // TODO: Open story creator
  }, []);

  return (
    <Container>
      <Header>
        <h1>📖 Stories</h1>
      </Header>
      
      <Content>
        <StoriesCarousel
          rings={storyRings}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />
        
        <FeaturedSection>
          <h2>Recent Stories</h2>
          {storyRings.length > 0 ? (
            <StoryGrid>
              {storyRings.flatMap(ring => 
                ring.stories.map(story => (
                  <StoryCard key={story.id} onClick={() => handleStoryClick(ring)}>
                    <StoryPreview $backgroundImage={story.thumbnailUrl || story.mediaUrl}>
                      <StoryInfo>
                        <h3>{ring.displayName}</h3>
                        <p>{story.caption || `${story.type} story`}</p>
                      </StoryInfo>
                    </StoryPreview>
                  </StoryCard>
                ))
              )}
            </StoryGrid>
          ) : (
            <EmptyState>
              <h3>No Stories Yet</h3>
              <p>
                Stories from your friends will appear here. Create your first story to get started!
              </p>
            </EmptyState>
          )}
        </FeaturedSection>
      </Content>
    </Container>
  );
};

export default StoriesPage;