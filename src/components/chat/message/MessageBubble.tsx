"use client";

import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: BaseMessage | DirectMessage;
  isOwn: boolean;
}

type MessageReadStatus = {
  [userId: string]: boolean;
};

// Type guard to check if message has readStatus
const hasReadStatus = (message: BaseMessage | DirectMessage): message is BaseMessage & { readStatus: MessageReadStatus } => {
  return 'readStatus' in message && message.readStatus !== undefined;
};

// Type guard to check if message has attachments
const hasAttachments = (message: BaseMessage | DirectMessage): message is BaseMessage & { attachments: string[] } => {
  return 'attachments' in message && Array.isArray(message.attachments);
};

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  // Function to format time with proper timezone handling
  const formatMessageTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Function to check if message is read
  const isMessageRead = () => {
    if (hasReadStatus(message)) {
      return Object.values(message.readStatus).some(status => status);
    }
    return false;
  };

  return (
    <div className={cn(
      "flex flex-col max-w-[70%] mb-4",
      isOwn ? "ml-auto items-end" : "items-start"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2",
        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
        {hasAttachments(message) && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment, index) => (
              <div 
                key={index} 
                className="text-xs underline cursor-pointer hover:text-primary transition-colors"
              >
                {attachment}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </span>
        {isMessageRead() && (
          <span className="text-xs text-blue-500">✓</span>
        )}
      </div>
    </div>
  );
};