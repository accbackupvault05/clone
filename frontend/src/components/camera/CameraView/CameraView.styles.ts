import styled, { css } from 'styled-components';
import { layout, animations } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

export const CameraContainer = styled.div`
  ${layout.fullScreen}
  ${layout.flexColumn}
  background-color: ${({ theme }) => theme.colors.black};
  overflow: hidden;
  position: relative;
`;

export const CameraViewport = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  /* Ensure proper aspect ratio on different devices */
  @media ${device.mobile} {
    /* Mobile: Full screen */
    height: 100vh;
    width: 100vw;
  }
  
  @media ${device.tablet} {
    /* Tablet: Centered with aspect ratio */
    max-width: 80vh;
    max-height: 80vh;
    margin: 0 auto;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
  }
  
  @media ${device.desktop} {
    /* Desktop: Centered camera view */
    max-width: 60vh;
    max-height: 80vh;
    margin: 0 auto;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

export const WebcamWrapper = styled.div<{ $isRecording: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  
  video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    transform: scaleX(-1); /* Mirror front camera */
  }
  
  ${({ $isRecording }) =>
    $isRecording &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid ${({ theme }) => theme.colors.error};
        border-radius: inherit;
        animation: recordingPulse 1s infinite;
      }
      
      @keyframes recordingPulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}
`;

export const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
`;

export const TopControls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;
  pointer-events: auto;
  
  @media ${device.mobile} {
    padding: ${({ theme }) => theme.spacing.md};
    /* Account for notch on modern phones */
    padding-top: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-top));
  }
`;

export const BottomControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  z-index: 3;
  pointer-events: auto;
  
  @media ${device.mobile} {
    padding: ${({ theme }) => theme.spacing.lg};
    /* Account for home indicator on modern phones */
    padding-bottom: max(${({ theme }) => theme.spacing.xl}, env(safe-area-inset-bottom));
  }
`;

export const ControlButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme }) => theme.colors.white};
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return theme.colors.primary;
      case 'danger':
        return theme.colors.error;
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: scale(1.1);
    background-color: ${({ $variant, theme }) => {
      switch ($variant) {
        case 'primary':
          return theme.colors.primary;
        case 'danger':
          return theme.colors.error;
        default:
          return 'rgba(255, 255, 255, 0.3)';
      }
    }};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media ${device.mobile} {
    width: 44px;
    height: 44px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const CaptureButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const MainCaptureButton = styled.button<{ $isRecording: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 4px solid ${({ theme }) => theme.colors.white};
  background-color: ${({ $isRecording, theme }) =>
    $isRecording ? theme.colors.error : theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${({ $isRecording }) => ($isRecording ? '20px' : '60px')};
    height: ${({ $isRecording }) => ($isRecording ? '20px' : '60px')};
    background-color: ${({ $isRecording, theme }) =>
      $isRecording ? theme.colors.white : theme.colors.primary};
    border-radius: ${({ $isRecording, theme }) =>
      $isRecording ? theme.borderRadius.sm : theme.borderRadius.full};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
  
  @media ${device.mobile} {
    width: 70px;
    height: 70px;
    
    &::after {
      width: ${({ $isRecording }) => ($isRecording ? '16px' : '50px')};
      height: ${({ $isRecording }) => ($isRecording ? '16px' : '50px')};
    }
  }
`;

export const FilterCarouselContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const RecordingTimer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  backdrop-filter: blur(10px);
  ${animations.fadeIn}
  
  &::before {
    content: '●';
    color: ${({ theme }) => theme.colors.error};
    margin-right: ${({ theme }) => theme.spacing.xs};
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
`;

export const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  max-width: 300px;
  backdrop-filter: blur(10px);
  ${animations.fadeIn}
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export const PermissionPrompt = styled.div`
  ${layout.absoluteCenter}
  background-color: rgba(0, 0, 0, 0.9);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  max-width: 300px;
  backdrop-filter: blur(10px);
  ${animations.fadeIn}
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fonts.sizes.lg};
    font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: ${({ theme }) => theme.fonts.lineHeights.relaxed};
  }
`;