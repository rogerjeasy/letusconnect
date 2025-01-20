"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import { DirectMessage, Message } from "@/store/message";
import { GroupChat } from "@/store/groupChat";
import { User, useUserStore } from '@/store/userStore';
import { getUserByUid } from '@/services/users.services';
import { EmptyState } from './EmptyState';

interface ChatListProps {
  directChats: DirectMessage[];
  groupChats: GroupChat[];
  selectedChatId?: string;
  currentUserId: string;
  activeTab?: 'direct' | 'groups';
  onChatSelect: (chatId: string, type: 'direct' | 'group') => void;
  onTabChange?: (tab: 'direct' | 'groups') => void;
  onNewDirectMessage?: (message: Message) => void;
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
  onTabChange,
  onNewDirectMessage
}: ChatListProps) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>(initialTab);
  const [selectedChatType, setSelectedChatType] = useState<'direct' | 'group' | null>(null);
  const [processedGroupChats, setProcessedGroupChats] = useState<ProcessedGroupChat[]>([]);
  const [partnerUsers, setPartnerUsers] = useState<Record<string, User>>({});
    const currentUser = useUserStore(state => state.user);

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

  // Fetch partner users' data
  useEffect(() => {
    const fetchPartnerUsers = async () => {
      const uniquePartnerIds = new Set(
        directChats.map(message => 
          message.senderId === currentUserId ? message.receiverId : message.senderId
        )
      );

      const userPromises = Array.from(uniquePartnerIds).map(async (partnerId) => {
        try {
          const user = await getUserByUid(partnerId);
          return [partnerId, user] as [string, User];
        } catch (error) {
          console.error(`Error fetching user ${partnerId}:`, error);
          return null;
        }
      });

      const users = await Promise.all(userPromises);
      const usersMap = Object.fromEntries(users.filter(Boolean) as [string, User][]);
      setPartnerUsers(usersMap);
    };

    fetchPartnerUsers();
  }, [directChats, currentUserId]);

  // Process direct chats
  const processedDirectChats = useMemo(() => {
    const chatGroups: { [key: string]: {
      messages: DirectMessage[];
      partnerId: string;
      partnerName: string;
      lastMessage: DirectMessage;
      unreadCount: number;
      profilePicture?: string;
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
          profilePicture: partnerUsers[partnerId]?.profilePicture,
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
  }, [directChats, currentUserId, partnerUsers]);

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    setSelectedChatType(type);
    onChatSelect(chatId, type);
  };

  const handleTabChange = (value: string) => {
    const newTab = value as 'direct' | 'groups';
    setActiveTab(newTab);
    onTabChange?.(newTab);
  };

  const handleNewChat = (newDirectMessage: DirectMessage) => {
    onNewDirectMessage?.(newDirectMessage);
    handleChatSelect(newDirectMessage.receiverId, 'direct');
    setActiveTab('direct');
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
          {processedDirectChats.length > 0 ? (
              processedDirectChats.map((chat) => (
                <ChatListItem
                  key={chat.partnerId}
                  id={chat.partnerId}
                  name={chat.partnerName}
                  avatar={chat.profilePicture}
                  lastMessage={chat.lastMessage.content}
                  unreadCount={chat.unreadCount}
                  type="direct"
                  isActive={selectedChatId === chat.partnerId && selectedChatType === 'direct'}
                  onClick={() => handleChatSelect(chat.partnerId, 'direct')}
                />
              ))
            ) : (
                <EmptyState 
                    type="direct" 
                    onUserSelect={handleNewChat}
                    currentUser={currentUser as User}
              />
            )}
          </TabsContent>
          <TabsContent value="groups" className="m-0">
            {processedGroupChats.length > 0 ? (
                processedGroupChats.map((group) => (
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
                ))
                ) : (
                <EmptyState type="groups" />
                )}
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
};