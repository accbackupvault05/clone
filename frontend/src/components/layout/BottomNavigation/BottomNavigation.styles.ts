import styled, { css } from 'styled-components';
import { layout } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

export const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(20px);
  z-index: 1000;
  
  /* Safe area support for modern phones */
  padding-bottom: env(safe-area-inset-bottom);
  
  @media ${device.tablet} {
    display: none; /* Hide on tablet and desktop */
  }
`;

export const NavigationList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin: 0;
  list-style: none;
  min-height: 60px;
`;

export const NavigationItem = styled.li<{ $isActive: boolean; $disabled: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

export const NavigationButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  background: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 44px; /* iOS minimum touch target */
  min-height: 44px;
  
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.textSecondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      color: ${theme.colors.primary};
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background-color: ${theme.colors.primary};
        border-radius: 50%;
      }
    `}
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  svg {
    width: 24px;
    height: 24px;
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1;
  text-align: center;
  
  @media (max-width: 320px) {
    display: none; /* Hide labels on very small screens */
  }
`;

export const Badge = styled.div`
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
  
  /* Hide badge if count is 0 */
  &:empty {
    display: none;
  }
`;

export const CameraButton = styled(NavigationButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: 56px;
  height: 56px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
  
  /* Remove the active indicator for camera button */
  &::after {
    display: none;
  }
`;