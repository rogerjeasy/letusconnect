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

export const MessageList = ({ messages, currentUserId, chatType }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isBaseMessage = (message: BaseMessage | DirectMessage): message is BaseMessage => {
    return 'isDeleted' in message && 'isPinned' in message;
  };
  
  const groupMessagesByDay = (messages: (BaseMessage | DirectMessage)[]): GroupedMessages[] => {
    const baseMessages = messages.filter(isBaseMessage);
  
    const sortedMessages = _.sortBy(baseMessages, msg => new Date(msg.createdAt));
  
    const groups = _.groupBy(sortedMessages, msg =>
      format(new Date(msg.createdAt), 'yyyy-MM-dd')
    );
  
    return Object.entries(groups)
      .map(([dateStr, messages]) => ({
        date: new Date(dateStr),
        messages: messages,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
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

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-6">
        {groupedMessages.map(({ date, messages }) => (
          <div key={date.toISOString()} className="space-y-4">
            {/* Date Header */}
            <div className="text-center text-sm font-medium text-gray-500">
              {formatDateHeader(date)}
            </div>

            {/* Messages */}
            {messages.map((message) => (
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
