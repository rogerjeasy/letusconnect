"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: (BaseMessage | DirectMessage)[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
