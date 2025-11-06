import { Message, User } from '../../../types/chat';

export interface ChatMessageProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onMediaClick?: (mediaUrl: string, type: Message['type']) => void;
  onSnapView?: (messageId: string) => void;
  className?: string;
}