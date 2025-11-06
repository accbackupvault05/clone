import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../components/chat/ChatMessage';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Message, User } from '../types/chat';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const ChatHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div<{ $src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary};
  background-image: ${({ $src }) => $src ? `url(${$src})` : 'none'};
  background-size: cover;
  background-position: center;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fonts.weights.semibold};
`;

const UserInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonts.sizes.md};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonts.sizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MessageInputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const TypingIndicator = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fonts.sizes.sm};
  font-style: italic;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 400px;
  }
`;

// Mock data for demonstration
const mockUsers: Record<string, User> = {
  'user1': {
    id: 'user1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '',
    isOnline: true,
  },
  'user2': {
    id: 'user2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: '',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'Hey! How are you doing?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: true,
    isDelivered: true,
  },
  {
    id: '2',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'I\'m doing great! Just working on some new features.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
    isRead: true,
    isDelivered: true,
  },
  {
    id: '3',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'That sounds awesome! Can\'t wait to see what you\'re building.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    isRead: false,
    isDelivered: true,
  },
];

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock current user
  const currentUserId = 'user1';
  const currentUser = mockUsers[currentUserId];
  
  // Mock conversation partner
  const partnerId = conversationId || 'user2';
  const partner = mockUsers[partnerId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: partnerId,
      content: messageText,
      type: 'text',
      timestamp: new Date(),
      isRead: false,
      isDelivered: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return (
      <ChatContainer>
        <EmptyState>
          <h2>💬 Welcome to Chat</h2>
          <p>
            Select a conversation to start messaging, or create a new chat with your friends.
            Real-time messaging with typing indicators, read receipts, and media sharing.
          </p>
        </EmptyState>
      </ChatContainer>
    );
  }

  if (!partner) {
    return (
      <ChatContainer>
        <EmptyState>
          <h2>User Not Found</h2>
          <p>The conversation you're looking for doesn't exist.</p>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <UserAvatar $src={partner.avatar}>
          {!partner.avatar && partner.displayName.charAt(0).toUpperCase()}
        </UserAvatar>
        <UserInfo>
          <h3>{partner.displayName}</h3>
          <p>
            {partner.isOnline 
              ? 'Online' 
              : partner.lastSeen 
                ? `Last seen ${partner.lastSeen.toLocaleTimeString()}`
                : 'Offline'
            }
          </p>
        </UserInfo>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((message) => {
          const sender = mockUsers[message.senderId];
          const isOwn = message.senderId === currentUserId;
          
          return (
            <ChatMessage
              key={message.id}
              message={message}
              sender={sender}
              isOwn={isOwn}
              showAvatar={!isOwn}
              showTimestamp={true}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageInputContainer>
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          fullWidth
          variant="filled"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          variant="primary"
        >
          Send
        </Button>
      </MessageInputContainer>
    </ChatContainer>
  );
};

export default ChatPage;