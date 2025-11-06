import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fonts.sizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.md};
  text-align: center;
  max-width: 500px;
`;

const SettingsPage: React.FC = () => {
  return (
    <Container>
      <Title>⚙️ Settings</Title>
      <Description>
        Settings functionality will be implemented here. This will include privacy settings,
        notification preferences, account management, and app customization options.
      </Description>
    </Container>
  );
};

export default SettingsPage;