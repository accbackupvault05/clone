import React, { useState, useCallback } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { ChatMessageProps } from './ChatMessage.types';
import {
  MessageContainer,
  Avatar,
  MessageBubble,
  MessageContent,
  MediaContainer,
  MediaImage,
  MediaVideo,
  PlayButton,
  MessageMeta,
  Timestamp,
  MessageStatus,
  SnapTimer,
  AudioMessage,
  AudioButton,
  AudioWaveform,
  AudioDuration,
} from './ChatMessage.styles';

// Status icons
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const DoubleCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

/**
 * ChatMessage component for displaying individual messages
 * Supports text, image, video, audio, and snap messages
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onMediaClick,
  onSnapView,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTimestamp = useCallback((date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  }, []);

  const getMessageStatus = useCallback(() => {
    if (message.isRead) return 'read';
    if (message.isDelivered) return 'delivered';
    return 'sent';
  }, [message.isRead, message.isDelivered]);

  const handleMediaClick = useCallback(() => {
    if (message.type === 'snap' && onSnapView) {
      onSnapView(message.id);
    } else if (onMediaClick && message.mediaUrl) {
      onMediaClick(message.mediaUrl, message.type);
    }
  }, [message, onMediaClick, onSnapView]);

  const handleAudioToggle = useCallback(() => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  }, [isPlaying]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <MediaContainer $type="image" onClick={handleMediaClick}>
            <MediaImage
              src={message.mediaUrl || message.thumbnailUrl}
              alt="Shared image"
              loading="lazy"
            />
          </MediaContainer>
        );

      case 'video':
        return (
          <MediaContainer $type="video" onClick={handleMediaClick}>
            <MediaVideo
              src={message.thumbnailUrl}
              poster={message.thumbnailUrl}
              preload="metadata"
            />
            <PlayButton />
            {message.duration && (
              <SnapTimer $isViewed={false}>
                {formatDuration(message.duration)}
              </SnapTimer>
            )}
          </MediaContainer>
        );

      case 'snap':
        return (
          <MediaContainer $type="snap" onClick={handleMediaClick}>
            <MediaImage
              src={message.thumbnailUrl || '/placeholder-snap.jpg'}
              alt="Snap"
              loading="lazy"
            />
            {message.snapData && (
              <SnapTimer $isViewed={message.snapData.isViewed}>
                {message.snapData.isViewed ? 'Viewed' : `${message.snapData.viewDuration}s`}
              </SnapTimer>
            )}
          </MediaContainer>
        );

      case 'audio':
        return (
          <AudioMessage>
            <AudioButton onClick={handleAudioToggle}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </AudioButton>
            <AudioWaveform />
            <AudioDuration>
              {message.duration ? formatDuration(message.duration) : '0:00'}
            </AudioDuration>
          </AudioMessage>
        );

      default:
        return <MessageContent>{message.content}</MessageContent>;
    }
  };

  return (
    <MessageContainer $isOwn={isOwn} className={className}>
      {showAvatar && !isOwn && (
        <Avatar $src={sender.avatar}>
          {!sender.avatar && sender.displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      
      <div>
        <MessageBubble $isOwn={isOwn} $type={message.type}>
          {renderMessageContent()}
        </MessageBubble>
        
        {showTimestamp && (
          <MessageMeta $isOwn={isOwn}>
            <Timestamp>{formatTimestamp(message.timestamp)}</Timestamp>
            {isOwn && (
              <MessageStatus $status={getMessageStatus()}>
                {message.isRead ? (
                  <DoubleCheckIcon />
                ) : message.isDelivered ? (
                  <DoubleCheckIcon />
                ) : (
                  <CheckIcon />
                )}
              </MessageStatus>
            )}
          </MessageMeta>
        )}
      </div>
    </MessageContainer>
  );
};

export default ChatMessage;