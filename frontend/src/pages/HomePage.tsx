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

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const WelcomeSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const WelcomeMessage = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  max-width: 600px;
  line-height: 1.6;
  margin: 0 auto;
`;

const FeedSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.lg};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  line-height: 1.5;
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
    ],
  },
];

const HomePage: React.FC = () => {
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
      <Content>
        <WelcomeSection>
          <WelcomeMessage>
            Welcome to Snapchat Clone! 👋
          </WelcomeMessage>
          
          <Description>
            This is a modern Snapchat clone built with React 18, TypeScript, Node.js, and Socket.IO. 
            The application features real-time messaging, media sharing, stories, and more!
          </Description>
        </WelcomeSection>

        <StoriesCarousel
          rings={storyRings}
          onStoryClick={handleStoryClick}
          onCreateStory={handleCreateStory}
        />

        <FeedSection>
          <h3>Features</h3>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>📸</FeatureIcon>
              <FeatureTitle>Camera & Snaps</FeatureTitle>
              <FeatureDescription>
                Take photos and videos, add filters, and send disappearing snaps to friends.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💬</FeatureIcon>
              <FeatureTitle>Real-time Chat</FeatureTitle>
              <FeatureDescription>
                Send instant messages with typing indicators and read receipts.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📖</FeatureIcon>
              <FeatureTitle>Stories</FeatureTitle>
              <FeatureDescription>
                Share your moments with stories that disappear after 24 hours.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>Friends</FeatureTitle>
              <FeatureDescription>
                Add friends, manage your friend list, and see who's online.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📞</FeatureIcon>
              <FeatureTitle>Video Calls</FeatureTitle>
              <FeatureDescription>
                Make video and audio calls with WebRTC technology.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>⚙️</FeatureIcon>
              <FeatureTitle>Settings</FeatureTitle>
              <FeatureDescription>
                Customize your privacy settings and notification preferences.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </FeedSection>
      </Content>
    </Container>
  );
};

export default HomePage;