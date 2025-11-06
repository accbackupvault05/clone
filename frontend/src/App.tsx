import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import HomePage from '@/pages/HomePage';
import CameraPage from '@/pages/CameraPage';
import ChatPage from '@/pages/ChatPage';
import StoriesPage from '@/pages/StoriesPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

const App: React.FC = () => {
  const location = useLocation();
  
  // Pages that should not show the main layout (full-screen experiences)
  const fullScreenPages = ['/camera'];
  const isFullScreen = fullScreenPages.includes(location.pathname);

  return (
    <Routes>
      {/* Full-screen routes (no layout) */}
      <Route path="/camera" element={<CameraPage />} />
      
      {/* Routes with main layout */}
      <Route path="/*" element={
        <MainLayout 
          showBottomNavigation={!isFullScreen}
          showHeader={!isFullScreen}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/discover" element={<div>Discover Page Coming Soon</div>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
};

export default App;