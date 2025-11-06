import styled, { css, keyframes } from 'styled-components';
import { animations } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

const gradientAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const RingContainer = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          width: 60px;
        `;
      case 'large':
        return css`
          width: 100px;
        `;
      default:
        return css`
          width: 80px;
        `;
    }
  }}
`;

export const RingWrapper = styled.div<{ 
  $size: 'small' | 'medium' | 'large';
  $hasUnviewed: boolean;
  $isViewed: boolean;
}>`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 3px;
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          width: 60px;
          height: 60px;
        `;
      case 'large':
        return css`
          width: 100px;
          height: 100px;
        `;
      default:
        return css`
          width: 80px;
          height: 80px;
        `;
    }
  }}
  
  ${({ $hasUnviewed, $isViewed, theme }) => {
    if ($hasUnviewed && !$isViewed) {
      return css`
        background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
        
        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
          border-radius: inherit;
          z-index: -1;
          animation: ${gradientAnimation} 2s linear infinite;
        }
      `;
    } else if ($isViewed) {
      return css`
        background: ${theme.colors.gray[300]};
      `;
    } else {
      return css`
        background: ${theme.colors.border};
      `;
    }
  }}
`;

export const Avatar = styled.div<{ 
  $src?: string;
  $size: 'small' | 'medium' | 'large';
}>`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.surface};
  background-image: ${({ $src }) => $src ? `url(${$src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: 3px solid ${({ theme }) => theme.colors.background};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return css`
          font-size: ${theme.fonts.sizes.sm};
        `;
      case 'large':
        return css`
          font-size: ${theme.fonts.sizes.xl};
        `;
      default:
        return css`
          font-size: ${theme.fonts.sizes.lg};
        `;
    }
  }}
`;

export const AddStoryButton = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          width: 18px;
          height: 18px;
          font-size: 12px;
        `;
      case 'large':
        return css`
          width: 32px;
          height: 32px;
          font-size: 18px;
        `;
      default:
        return css`
          width: 24px;
          height: 24px;
          font-size: 14px;
        `;
    }
  }}
  
  &::after {
    content: '+';
  }
`;

export const Label = styled.span<{ $size: 'small' | 'medium' | 'large' }>`
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return theme.fonts.sizes.xs;
      case 'large':
        return theme.fonts.sizes.sm;
      default:
        return theme.fonts.sizes.xs;
    }
  }};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  
  @media ${device.mobile} {
    font-size: ${({ theme }) => theme.fonts.sizes.xs};
  }
`;

export const StoryCount = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const LiveIndicator = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  
  &::after {
    content: 'LIVE';
  }
`;