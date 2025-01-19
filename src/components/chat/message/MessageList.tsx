"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from "date-fns";
import _ from "lodash";

interface MessageListProps {
  messages: (BaseMessage | DirectMessage)[];
  currentUserId: string;
  chatType: 'direct' | 'group' | undefined;
}

interface GroupedMessages {
  date: Date;
  messages: (BaseMessage | DirectMessage)[];
}

export const MessageList = ({ messages = [], currentUserId, chatType }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isBaseMessage = (message: BaseMessage | DirectMessage): message is BaseMessage => {
    return message !== null && 'isDeleted' in message && 'isPinned' in message;
  };

  const isValidMessage = (message: BaseMessage | DirectMessage | null): message is (BaseMessage | DirectMessage) => {
    return message !== null && 
           typeof message === 'object' && 
           'createdAt' in message &&
           'id' in message &&
           'senderId' in message;
  };

  const groupMessagesByDay = (messages: (BaseMessage | DirectMessage)[]): GroupedMessages[] => {
    if (!Array.isArray(messages)) {
      return [];
    }

    // Filter out null messages and validate remaining messages
    const validMessages = messages.filter(isValidMessage);
    
    // Filter base messages
    const baseMessages = validMessages.filter(isBaseMessage);

    // If no valid messages after filtering, return empty array
    if (baseMessages.length === 0) {
      return [];
    }

    try {
      const sortedMessages = _.sortBy(baseMessages, msg => new Date(msg.createdAt));

      const groups = _.groupBy(sortedMessages, msg => {
        const date = new Date(msg.createdAt);
        return format(date, 'yyyy-MM-dd');
      });

      return Object.entries(groups)
        .map(([dateStr, messages]) => ({
          date: new Date(dateStr),
          messages: messages,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error('Error grouping messages:', error);
      return [];
    }
  };

  const formatDateHeader = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy');
  };

  const groupedMessages = groupMessagesByDay(messages);

  // If no messages, render empty state
  if (groupedMessages.length === 0) {
    return (
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-6">
        {groupedMessages.map(({ date, messages }) => (
          <div key={date.toISOString()} className="space-y-4">
            <div className="text-center text-sm font-medium text-gray-500">
              {formatDateHeader(date)}
            </div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                isAdmin={chatType === 'group'}
              />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};