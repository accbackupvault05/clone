import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 40 }) => size}px;
  height: ${({ size = 40 }) => size}px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
`;

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  text = 'Loading...', 
  fullScreen = true 
}) => {
  if (fullScreen) {
    return (
      <SpinnerContainer>
        <div>
          <Spinner size={size} />
          {text && <LoadingText>{text}</LoadingText>}
        </div>
      </SpinnerContainer>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </div>
  );
};

export default LoadingSpinner;