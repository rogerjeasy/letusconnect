"use client";

import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { DirectMessage } from '@/store/message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/chat/message/MessageBubble';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageGroupProps {
  messages: DirectMessage[];
  currentUserId: string;
}

const DirectMessagesGroupedByUid = ({ messages, currentUserId }: MessageGroupProps) => {
  // Group messages by date first
  const groupedByDate = messages.reduce((groups: { [key: string]: DirectMessage[] }, message) => {
    const dateKey = format(new Date(message.createdAt), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  // Format date headers
  const formatDateHeader = (date: string) => {
    const parsedDate = new Date(date);
    if (isToday(parsedDate)) {
      return 'Today';
    }
    if (isYesterday(parsedDate)) {
      return 'Yesterday';
    }
    return format(parsedDate, 'MMMM d, yyyy');
  };

  return (
    <ScrollArea className="h-full p-4">
      <div className="flex flex-col gap-6">
        {Object.entries(groupedByDate).map(([date, messagesByDate]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="text-center text-sm font-medium text-gray-500 mb-4">
              {formatDateHeader(date)}
            </div>

            {/* Messages */}
            {messagesByDate.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DirectMessagesGroupedByUid;