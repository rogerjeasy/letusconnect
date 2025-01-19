"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import { DirectMessage } from "@/store/message";
import { GroupChat } from "@/store/groupChat";

interface ChatListProps {
  directChats: DirectMessage[];
  groupChats: GroupChat[];
  selectedChatId?: string;
  currentUserId: string;
  activeTab?: 'direct' | 'groups';
  onChatSelect: (chatId: string, type: 'direct' | 'group') => void;
  onTabChange?: (tab: 'direct' | 'groups') => void;
}

interface ProcessedGroupChat {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
}

export const ChatList = ({
  directChats = [],
  groupChats = [],
  selectedChatId,
  currentUserId,
  activeTab: initialTab = 'direct',
  onChatSelect,
  onTabChange
}: ChatListProps) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>(initialTab);
  const [selectedChatType, setSelectedChatType] = useState<'direct' | 'group' | null>(null);
  const [processedGroupChats, setProcessedGroupChats] = useState<ProcessedGroupChat[]>([]);

  // Process group chats whenever they change
  useEffect(() => {
    const processGroups = () => {
      return groupChats.map((group) => {
        if (!group || !group.messages) {
          return {
            id: group.id,
            name: group.name || 'Unnamed Group',
            lastMessage: '',
            unreadCount: 0
          };
        }

        const messages = Array.isArray(group.messages) ? group.messages : [];
        const lastGroupMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        const unreadCount = messages.filter(
          msg => msg && msg.senderId !== currentUserId && !msg.readStatus
        ).length;

        return {
          id: group.id,
          name: group.name || 'Unnamed Group',
          lastMessage: lastGroupMessage?.content || '',
          unreadCount: unreadCount
        };
      });
    };

    setProcessedGroupChats(processGroups());
  }, [groupChats, currentUserId]);

  // Process direct chats
  const processedDirectChats = useMemo(() => {
    const chatGroups: { [key: string]: {
      messages: DirectMessage[];
      partnerId: string;
      partnerName: string;
      lastMessage: DirectMessage;
      unreadCount: number;
    }} = {};
   
    directChats.forEach(message => {
      const isMessageFromCurrentUser = message.senderId === currentUserId;
      const partnerId = isMessageFromCurrentUser ? message.receiverId : message.senderId;
      const partnerName = isMessageFromCurrentUser ? message.receiverName : message.senderName;

      if (!chatGroups[partnerId]) {
        chatGroups[partnerId] = {
          messages: [],
          partnerId,
          partnerName,
          lastMessage: message,
          unreadCount: 0
        };
      }

      chatGroups[partnerId].messages.push(message);
      
      if (new Date(message.createdAt) > new Date(chatGroups[partnerId].lastMessage.createdAt)) {
        chatGroups[partnerId].lastMessage = message;
      }

      if (!isMessageFromCurrentUser && !message.readStatus) {
        chatGroups[partnerId].unreadCount++;
      }
    });

    return Object.values(chatGroups).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }, [directChats, currentUserId]);

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    setSelectedChatType(type);
    onChatSelect(chatId, type);
  };

  const handleTabChange = (value: string) => {
    const newTab = value as 'direct' | 'groups';
    setActiveTab(newTab);
    onTabChange?.(newTab);
  };

  // Update selected chat type when selectedChatId changes
  useEffect(() => {
    if (!selectedChatId) {
      setSelectedChatType(null);
      return;
    }

    const isDirectChat = processedDirectChats.some(chat => chat.partnerId === selectedChatId);
    if (isDirectChat) {
      setSelectedChatType('direct');
      return;
    }

    const isGroupChat = processedGroupChats.some(chat => chat.id === selectedChatId);
    if (isGroupChat) {
      setSelectedChatType('group');
    }
  }, [selectedChatId, processedDirectChats, processedGroupChats]);

  return (
    <Tabs 
      defaultValue="direct" 
      className="flex flex-col h-full"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="w-full">
        <TabsTrigger value="direct" className="flex-1">
          Direct Messages
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex-1">
          Groups
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <TabsContent value="direct" className="m-0">
            {processedDirectChats.map((chat) => (
              <ChatListItem
                key={chat.partnerId}
                id={chat.partnerId}
                name={chat.partnerName}
                lastMessage={chat.lastMessage.content}
                unreadCount={chat.unreadCount}
                type="direct"
                isActive={selectedChatId === chat.partnerId && selectedChatType === 'direct'}
                onClick={() => handleChatSelect(chat.partnerId, 'direct')}
              />
            ))}
          </TabsContent>
          <TabsContent value="groups" className="m-0">
            {processedGroupChats.map((group) => (
              <ChatListItem
                key={group.id}
                id={group.id}
                name={group.name}
                lastMessage={group.lastMessage}
                unreadCount={group.unreadCount}
                type="group"
                isActive={selectedChatId === group.id && selectedChatType === 'group'}
                onClick={() => handleChatSelect(group.id, 'group')}
              />
            ))}
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
};