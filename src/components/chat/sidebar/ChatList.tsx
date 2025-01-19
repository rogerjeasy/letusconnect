"use client";

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
  onChatSelect: (chatId: string, type: 'direct' | 'group') => void;
}

export const ChatList = ({
  directChats = [],
  groupChats = [],
  selectedChatId,
  currentUserId,
  onChatSelect
}: ChatListProps) => {
  // Helper function to group messages by chat partner
  const groupDirectMessagesByChat = () => {
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
      
      // Update last message if current message is newer
      if (new Date(message.createdAt) > new Date(chatGroups[partnerId].lastMessage.createdAt)) {
        chatGroups[partnerId].lastMessage = message;
      }

      // Count unread messages
      if (!isMessageFromCurrentUser && !message.readStatus) {
        chatGroups[partnerId].unreadCount++;
      }
    });

    return chatGroups;
  };

  const chatGroups = groupDirectMessagesByChat();

  // Sort chats by last message time
  const sortedDirectChats = Object.values(chatGroups).sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  // Helper function to render group chats
  const renderGroupChats = () => {
    return groupChats.map((group) => {
      // Return early with default values if messages is null
      if (!group || group.messages === null) {
        return (
          <ChatListItem
            key={group.id}
            id={group.id}
            name={group.name || 'Unnamed Group'}
            lastMessage=""
            unreadCount={0}
            type="group"
            isActive={selectedChatId === group.id}
            onClick={() => onChatSelect(group.id, 'group')}
          />
        );
      }

      // Handle case where messages exists
      const messages = Array.isArray(group.messages) ? group.messages : [];
      const lastGroupMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      const unreadCount = messages.filter(
        msg => msg && msg.senderId !== currentUserId && !msg.readStatus
      ).length;

      return (
        <ChatListItem
          key={group.id}
          id={group.id}
          name={group.name || 'Unnamed Group'}
          lastMessage={lastGroupMessage?.content || ''}
          unreadCount={unreadCount}
          type="group"
          isActive={selectedChatId === group.id}
          onClick={() => onChatSelect(group.id, 'group')}
        />
      );
    });
  };

  return (
    <Tabs defaultValue="direct" className="flex flex-col h-full">
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
            {sortedDirectChats.map((chat) => (
              <ChatListItem
                key={chat.partnerId}
                id={chat.partnerId}
                name={chat.partnerName}
                lastMessage={chat.lastMessage.content}
                unreadCount={chat.unreadCount}
                isActive={selectedChatId === chat.partnerId}
                type="direct"
                onClick={() => onChatSelect(chat.partnerId, 'direct')}
              />
            ))}
          </TabsContent>
          <TabsContent value="groups" className="m-0">
            {renderGroupChats()}
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
};