"use client";

import React from 'react';
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MessageBubbleOptions } from './MessageBubbleOptions';

interface MessageBubbleProps {
  message: BaseMessage | DirectMessage;
  isOwn: boolean;
  isAdmin?: boolean;
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

export const MessageBubble = ({ message, isOwn, isAdmin }: MessageBubbleProps) => {
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
        
        <Card className={cn(
          isOwn ? "bg-blue-500 text-white" : "bg-muted"
        )}>
          <CardHeader className={cn(
            "p-2 flex flex-row items-center justify-between",
            isOwn ? "bg-blue-600" : "bg-gray-100"
          )}>
            <MessageBubbleOptions 
              isAdmin={isAdmin}
              onPin={() => console.log('Pin message')}
              onUnpin={() => console.log('Unpin message')}
              onReply={() => console.log('Reply to message')}
              onForward={() => console.log('Forward message')}
              onCopy={() => console.log('Copy message')}
              onStar={() => console.log('Star message')}
              onDelete={() => console.log('Delete message')}
            />
          </CardHeader>
          <CardContent className={cn(
            "p-3",
            isOwn ? "bg-blue-500" : "bg-gray-50"
          )}>
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
          </CardContent>
        </Card>

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