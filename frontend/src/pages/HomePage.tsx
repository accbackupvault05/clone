import React from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.xl};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.background};
`;

const Username = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
`;

const StatusIndicator = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ connected, theme }) => 
    connected ? theme.colors.success : theme.colors.error};
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const WelcomeMessage = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 800px;
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

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Logo>👻 Snapchat Clone</Logo>
        <UserInfo>
          <Avatar>
            {user?.displayName?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          <Username>{user?.displayName}</Username>
          <StatusIndicator connected={isConnected} title={isConnected ? 'Connected' : 'Disconnected'} />
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <Content>
        <WelcomeMessage>
          Welcome to Snapchat Clone, {user?.displayName}! 👋
        </WelcomeMessage>
        
        <Description>
          This is a modern Snapchat clone built with React 18, TypeScript, Node.js, and Socket.IO. 
          The application features real-time messaging, media sharing, stories, and more!
        </Description>

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
      </Content>
    </Container>
  );
};

export default HomePage;