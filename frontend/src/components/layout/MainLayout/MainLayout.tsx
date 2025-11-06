import React from 'react';
import { BottomNavigation, NavigationItem } from '../BottomNavigation';
import { MainLayoutProps } from './MainLayout.types';
import {
  LayoutContainer,
  Header,
  MainContent,
  Logo,
  HeaderActions,
  ActionButton,
  UserAvatar,
} from './MainLayout.styles';

// Navigation icons (you can replace with react-icons)
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 9c0-1.66-1.34-3-3-3s-3 1.34-3 3v3c0 1.66 1.34 3 3 3z" />
    <path d="M17 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);

const StoriesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const DiscoverIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const NotificationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

// Default navigation items
const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
    path: '/',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: <ChatIcon />,
    path: '/chat',
  },
  {
    id: 'camera',
    label: 'Camera',
    icon: <CameraIcon />,
    path: '/camera',
  },
  {
    id: 'stories',
    label: 'Stories',
    icon: <StoriesIcon />,
    path: '/stories',
  },
  {
    id: 'discover',
    label: 'Discover',
    icon: <DiscoverIcon />,
    path: '/discover',
  },
];

/**
 * MainLayout component providing the app structure
 * Includes responsive navigation and header
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showBottomNavigation = true,
  showHeader = true,
  className,
}) => {
  return (
    <LayoutContainer className={className}>
      {showHeader && (
        <Header>
          <Logo>
            <CameraIcon />
            <h1>SnapClone</h1>
          </Logo>
          
          <HeaderActions>
            <ActionButton aria-label="Search">
              <SearchIcon />
            </ActionButton>
            <ActionButton aria-label="Notifications">
              <NotificationIcon />
            </ActionButton>
            <UserAvatar>U</UserAvatar>
          </HeaderActions>
        </Header>
      )}
      
      <MainContent 
        $hasHeader={showHeader} 
        $hasBottomNav={showBottomNavigation}
      >
        {children}
      </MainContent>
      
      {showBottomNavigation && (
        <BottomNavigation items={defaultNavigationItems} />
      )}
    </LayoutContainer>
  );
};

export default MainLayout;