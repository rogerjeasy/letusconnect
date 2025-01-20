"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef, useState, useMemo } from 'react';
import { format, isToday, isYesterday } from "date-fns";
import { User, useUserStore } from '@/store/userStore';
import { getUserByUid } from '@/services/users.services';
import _ from "lodash";

interface MessageListProps {
  messages: (BaseMessage | DirectMessage)[] | null;
  currentUserId: string;
  chatType: 'direct' | 'group' | undefined;
}

interface GroupedMessages {
  date: Date;
  messages: (BaseMessage | DirectMessage)[];
}

const isDirectMessage = (message: BaseMessage | DirectMessage): message is DirectMessage => {
  return 'receiverId' in message;
};

export const MessageList = ({ messages: rawMessages = null, currentUserId, chatType }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [partnerUsers, setPartnerUsers] = useState<Record<string, User>>({});
  const currentUser = useUserStore(state => state.user) || undefined;

  // Memoize the messages array to prevent unnecessary re-renders
  const messages = useMemo(() => rawMessages || [], [rawMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch partner users' data
  useEffect(() => {
    let isMounted = true;

    const fetchPartnerUsers = async () => {
      if (!Array.isArray(messages) || messages.length === 0) {
        if (isMounted) {
          setPartnerUsers({});
        }
        return;
      }

      // Get unique partner IDs based on chat type and message sender
      const uniquePartnerIds = new Set(
        messages
          .filter(message => message !== null)
          .map(message => {
            if (chatType === 'direct' && isDirectMessage(message)) {
              return message.senderId === currentUserId ? message.receiverId : message.senderId;
            }
            return message.senderId !== currentUserId ? message.senderId : null;
          })
          .filter(Boolean)
      );

      // Only proceed if we have partner IDs to fetch
      if (uniquePartnerIds.size === 0) {
        if (isMounted) {
          setPartnerUsers({});
        }
        return;
      }

      try {
        const userPromises = Array.from(uniquePartnerIds).map(async (partnerId) => {
          try {
            const user = await getUserByUid(partnerId as string);
            return user ? [partnerId, user] as [string, User] : null;
          } catch (error) {
            console.error(`Error fetching user ${partnerId}:`, error);
            return null;
          }
        });

        const users = await Promise.all(userPromises);
        if (isMounted) {
          const usersMap = Object.fromEntries(users.filter(Boolean) as [string, User][]);
          setPartnerUsers(usersMap);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        if (isMounted) {
          setPartnerUsers({});
        }
      }
    };

    fetchPartnerUsers();

    return () => {
      isMounted = false;
    };
  }, [messages, currentUserId, chatType]); // Added chatType to dependencies

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

  // Memoize the grouping function to prevent unnecessary recalculations
  const groupMessagesByDay = useMemo(() => {
    if (!Array.isArray(messages)) {
      return [];
    }
    
    const validMessages = messages.filter(isValidMessage);
    if (validMessages.length === 0) {
      return [];
    }

    try {
      const sortedMessages = _.sortBy(validMessages, msg => new Date(msg.createdAt));
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
  }, [messages]);

  const formatDateHeader = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy');
  };

  // If no messages, render empty state
  if (groupMessagesByDay.length === 0) {
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
        {groupMessagesByDay.map(({ date, messages }) => (
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
                currentUser={currentUser}
                partnerUsers={partnerUsers}
              />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};