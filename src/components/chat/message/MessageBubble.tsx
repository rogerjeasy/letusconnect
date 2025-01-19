"use client";

import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: BaseMessage | DirectMessage;
  isOwn: boolean;
}

type MessageReadStatus = {
  [userId: string]: boolean;
};

const hasReadStatus = (message: BaseMessage | DirectMessage): message is BaseMessage & { readStatus: MessageReadStatus } => {
  return 'readStatus' in message && message.readStatus !== undefined;
};

const hasAttachments = (message: BaseMessage | DirectMessage): message is BaseMessage & { attachments: string[] } => {
  return 'attachments' in message && Array.isArray(message.attachments);
};

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const formatMessageTime = (timestamp: string) => {
    try {
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h23',
          }).format(new Date(timestamp));
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const isMessageRead = () => {
    if (hasReadStatus(message)) {
      return Object.values(message.readStatus).some(status => status);
    }
    return false;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback>
          {message.senderName?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-muted-foreground">
            {message.senderName}
          </span>
        </div>

        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {hasAttachments(message) && message.attachments?.length > 0 && (
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
          {!isOwn && isMessageRead() && (
            <span className="text-xs text-blue-500">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};