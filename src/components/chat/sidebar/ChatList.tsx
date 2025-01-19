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
  onChatSelect: (chatId: string, type: 'direct' | 'group') => void;
}

export const ChatList = ({
  directChats,
  groupChats,
  selectedChatId,
  onChatSelect
}: ChatListProps) => {
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
            {directChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                id={chat.id}
                name={chat.senderName}
                lastMessage={chat.content}
                isActive={selectedChatId === chat.id}
                type="direct"
                onClick={() => onChatSelect(chat.id, 'direct')}
              />
            ))}
          </TabsContent>
          <TabsContent value="groups" className="m-0">
            {groupChats.map((group) => (
              <ChatListItem
                key={group.id}
                id={group.id}
                name={group.name}
                lastMessage={group.messages[group.messages.length - 1]?.content}
                type="group"
                isActive={selectedChatId === group.id}
                onClick={() => onChatSelect(group.id, 'group')}
              />
            ))}
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
};