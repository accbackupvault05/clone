import styled, { css } from 'styled-components';
import { animations } from '../../../styles/mixins';
import { device } from '../../../styles/breakpoints';

export const MessageContainer = styled.div<{ $isOwn: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ $isOwn }) =>
    $isOwn
      ? css`
          flex-direction: row-reverse;
          justify-content: flex-start;
        `
      : css`
          flex-direction: row;
          justify-content: flex-start;
        `}
  
  ${animations.fadeIn}
`;

export const Avatar = styled.div<{ $src?: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  background-image: ${({ $src }) => $src ? `url(${$src})` : 'none'};
  background-size: cover;
  background-position: center;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  
  flex-shrink: 0;
  
  @media ${device.mobile} {
    width: 28px;
    height: 28px;
    font-size: ${({ theme }) => theme.fonts.sizes.xs};
  }
`;

export const MessageBubble = styled.div<{ $isOwn: boolean; $type: string }>`
  max-width: 280px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  word-wrap: break-word;
  
  ${({ $isOwn, theme }) =>
    $isOwn
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border-bottom-right-radius: ${theme.borderRadius.sm};
        `
      : css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border-bottom-left-radius: ${theme.borderRadius.sm};
        `}
  
  ${({ $type }) =>
    ($type === 'image' || $type === 'video' || $type === 'snap') &&
    css`
      padding: 0;
      overflow: hidden;
    `}
  
  @media ${device.mobile} {
    max-width: 240px;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

export const MessageContent = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  line-height: ${({ theme }) => theme.fonts.lineHeights.relaxed};
  
  @media ${device.mobile} {
    font-size: ${({ theme }) => theme.fonts.sizes.xs};
  }
`;

export const MediaContainer = styled.div<{ $type: string }>`
  position: relative;
  cursor: pointer;
  
  ${({ $type }) =>
    $type === 'snap' &&
    css`
      &::after {
        content: '👻';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}
`;

export const MediaImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  @media ${device.mobile} {
    width: 160px;
    height: 160px;
  }
`;

export const MediaVideo = styled.video`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  @media ${device.mobile} {
    width: 160px;
    height: 160px;
  }
`;

export const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  
  &::after {
    content: '▶';
    margin-left: 2px;
  }
`;

export const MessageMeta = styled.div<{ $isOwn: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  ${({ $isOwn }) =>
    $isOwn
      ? css`
          justify-content: flex-end;
        `
      : css`
          justify-content: flex-start;
        `}
`;

export const Timestamp = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.7;
`;

export const MessageStatus = styled.div<{ $status: 'sent' | 'delivered' | 'read' }>`
  display: flex;
  align-items: center;
  
  svg {
    width: 12px;
    height: 12px;
    
    ${({ $status, theme }) => {
      switch ($status) {
        case 'sent':
          return css`color: ${theme.colors.textSecondary};`;
        case 'delivered':
          return css`color: ${theme.colors.textSecondary};`;
        case 'read':
          return css`color: ${theme.colors.primary};`;
        default:
          return css`color: ${theme.colors.textSecondary};`;
      }
    }}
  }
`;

export const SnapTimer = styled.div<{ $isViewed: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
  
  ${({ $isViewed }) =>
    $isViewed &&
    css`
      background-color: rgba(255, 0, 0, 0.7);
    `}
`;

export const AudioMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 200px;
`;

export const AudioButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const AudioWaveform = styled.div`
  flex: 1;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: inherit;
  }
`;

export const AudioDuration = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 32px;
  text-align: right;
`;