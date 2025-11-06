import styled from 'styled-components';
import { animations } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

export const CarouselContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const CarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media ${device.mobile} {
    padding: 0 ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const StoryRingWrapper = styled.div`
  flex-shrink: 0;
  ${animations.fadeIn}
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const EmptyState = styled.div`
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
    max-width: 300px;
  }
`;

export const ScrollButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => $direction}: ${({ theme }) => theme.spacing.sm};
  
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  z-index: 10;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: translateY(-50%);
      background-color: ${({ theme }) => theme.colors.surface};
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media ${device.mobile} {
    display: none;
  }
`;

export const CreateStoryButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const CreateButton = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border: 3px solid ${({ theme }) => theme.colors.background};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.white};
  font-size: 32px;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  
  &::after {
    content: '+';
  }
`;

export const CreateLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
`;