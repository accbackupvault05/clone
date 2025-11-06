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

const StoriesPage: React.FC = () => {
  return (
    <Container>
      <Title>📖 Stories</Title>
      <Description>
        Stories functionality will be implemented here. This will include viewing friends' stories,
        creating your own stories, and managing story privacy settings.
      </Description>
    </Container>
  );
};

export default StoriesPage;