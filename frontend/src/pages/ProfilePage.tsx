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

const ProfilePage: React.FC = () => {
  return (
    <Container>
      <Title>👤 Profile</Title>
      <Description>
        Profile management functionality will be implemented here. This will include
        viewing and editing profile information, managing friends, and viewing snap scores.
      </Description>
    </Container>
  );
};

export default ProfilePage;