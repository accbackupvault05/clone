import styled from 'styled-components';
import { layout } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

export const LayoutContainer = styled.div`
  ${layout.fullScreen}
  ${layout.flexColumn}
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(20px);
  z-index: 999;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  /* Safe area support for modern phones */
  padding-top: env(safe-area-inset-top);
  height: calc(60px + env(safe-area-inset-top));
  
  @media ${device.mobile} {
    padding: 0 ${({ theme }) => theme.spacing.md};
    padding-top: env(safe-area-inset-top);
  }
`;

export const MainContent = styled.main<{ $hasHeader: boolean; $hasBottomNav: boolean }>`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  
  /* Account for fixed header */
  padding-top: ${({ $hasHeader }) => ($hasHeader ? '60px' : '0')};
  
  /* Account for bottom navigation on mobile */
  @media ${device.mobile} {
    padding-bottom: ${({ $hasBottomNav }) => ($hasBottomNav ? '80px' : '0')};
    padding-top: ${({ $hasHeader }) => ($hasHeader ? 'calc(60px + env(safe-area-inset-top))' : '0')};
  }
  
  /* Desktop layout adjustments */
  @media ${device.desktop} {
    padding-bottom: 0; /* No bottom nav on desktop */
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  h1 {
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  
  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.1);
  }
`;