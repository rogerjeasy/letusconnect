"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import { DirectMessage, Message } from "@/store/message";
import { GroupChat } from "@/store/groupChat";
import { User, useUserStore } from '@/store/userStore';
import { getUserByUid } from '@/services/users.services';
import { EmptyState } from './EmptyState';
import { useUnreadMessageCounts } from '@/store/useUnreadMessageCounts';
import { Badge } from "@/components/ui/badge";
import { markMessagesAsRead } from '@/services/message.service';
import { markGroupMessagesAsRead } from '@/services/groupchat.service';
import React from 'react';

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
  const [partnerUsers, setPartnerUsers] = useState<Record<string, User>>({});
  const currentUser = useUserStore(state => state.user);
  const [recentlySelectedUser, setRecentlySelectedUser] = useState<string | null>(null);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  

  const {
    directUnreadCounts,
    groupUnreadCounts,
    totalUnreadCounts,
    isLoading: isInitialLoading,
    refreshUnreadCounts
  } = useUnreadMessageCounts(currentUserId, directChats, groupChats);

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

  // Process direct chats with unread counts
  const processedDirectChats = useMemo(() => {
    const chatGroups: { [key: string]: {
      messages: DirectMessage[];
      partnerId: string;
      partnerName: string;
      lastMessage: DirectMessage | null;
      unreadCount: number;
      profilePicture?: string;
      isRecentlySelected?: boolean;
    }} = {};
   
    // Process existing chats
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
          lastMessage: null,
          unreadCount: directUnreadCounts[partnerId] || 0,
          isRecentlySelected: partnerId === recentlySelectedUser
        };
      }

      chatGroups[partnerId].messages.push(message);
      
      const messageDate = new Date(message.createdAt);
      if (!chatGroups[partnerId].lastMessage || 
          messageDate > new Date(chatGroups[partnerId].lastMessage.createdAt)) {
        chatGroups[partnerId].lastMessage = message;
      }
    });

    // Add recently selected user if they don't exist in chats
    if (recentlySelectedUser && !chatGroups[recentlySelectedUser]) {
      const user = partnerUsers[recentlySelectedUser];
      chatGroups[recentlySelectedUser] = {
        messages: [],
        partnerId: recentlySelectedUser,
        partnerName: user?.username || 'Unknown User',
        profilePicture: user?.profilePicture,
        lastMessage: null,
        unreadCount: directUnreadCounts[recentlySelectedUser] || 0,
        isRecentlySelected: true
      };
    }

    return Object.values(chatGroups).sort((a, b) => {
      if (a.isRecentlySelected) return -1;
      if (b.isRecentlySelected) return 1;
      
      // Sort by unread count first, then by date
      if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;
      
      const aDate = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bDate = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [directChats, currentUserId, partnerUsers, recentlySelectedUser, directUnreadCounts]);

  // Process group chats with unread counts
  const processedGroupChats = useMemo(() => {
    return groupChats.map((group) => ({
      id: group.id,
      name: group.name || 'Unnamed Group',
      lastMessage: group.messages?.[group.messages.length - 1]?.content || '',
      unreadCount: groupUnreadCounts[group.id] || 0
    }));
  }, [groupChats, groupUnreadCounts]);

  const handleChatSelect = useCallback(async (chatId: string, type: 'direct' | 'group') => {
    if (loadingChatId === chatId) return;
      
    setSelectedChatType(type);
    onChatSelect(chatId, type);
    setLoadingChatId(chatId);
  
    try {
      // Only mark messages as read if there are unread messages
      if (type === 'direct' && directUnreadCounts[chatId] > 0) {
        await markMessagesAsRead(chatId);
        await refreshUnreadCounts();
      } else if (type === 'group' && groupUnreadCounts[chatId] > 0) {
        await markGroupMessagesAsRead(chatId);
        await refreshUnreadCounts();
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    } finally {
      setLoadingChatId(null);
    }
  }, [loadingChatId, onChatSelect, refreshUnreadCounts, directUnreadCounts, groupUnreadCounts]);

  const handleTabChange = (value: string) => {
    const newTab = value as 'direct' | 'groups';
    setActiveTab(newTab);
    onTabChange?.(newTab);
  };

  const handleNewChat = async (newDirectMessage: DirectMessage) => {
    const receiverId = newDirectMessage.receiverId;
    setRecentlySelectedUser(receiverId);
    
    if (!partnerUsers[receiverId]) {
      try {
        const user = await getUserByUid(receiverId);
        setPartnerUsers(prev => ({ ...prev, [receiverId]: user }));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    onNewDirectMessage?.(newDirectMessage);
    handleChatSelect(receiverId, 'direct');
    setActiveTab('direct');
  };

  return (
    <Tabs 
      defaultValue="direct" 
      className="flex flex-col h-full"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="w-full">
        <TabsTrigger value="direct" className="flex-1 relative">
          Direct Messages
          {totalUnreadCounts.direct > 0 && (
            <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
              {totalUnreadCounts.direct}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex-1 relative">
          Groups
          {totalUnreadCounts.group > 0 && (
            <Badge variant="secondary" className="ml-2 bg-green-500 text-white">
              {totalUnreadCounts.group}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {isInitialLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading messages...
            </div>
          ) : (
            <>
              <TabsContent value="direct" className="m-0">
                {processedDirectChats.length > 0 ? (
                  processedDirectChats.map((chat) => (
                    <ChatListItem
                      key={chat.partnerId}
                      id={chat.partnerId}
                      name={chat.partnerName}
                      avatar={chat.profilePicture}
                      lastMessage={chat.lastMessage?.content}
                      unreadCount={chat.unreadCount}
                      type="direct"
                      isActive={selectedChatId === chat.partnerId && selectedChatType === 'direct'}
                      isLoading={loadingChatId === chat.partnerId}
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
            </>
          )}
        </ScrollArea>
      </div>
    </Tabs>
  );
};