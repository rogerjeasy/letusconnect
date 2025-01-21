"use client";

import { Card } from "@/components/ui/card";
import { ChatList } from "./ChatList";
import { ChatSidebarProps } from "../types/chat";
import { Message } from "@/store/message";
import ChatManagementComponent from "../settings/ChatManagementComponent";
import { useUserStore } from "@/store/userStore";

interface ExtendedChatSidebarProps extends ChatSidebarProps {
  onSidebarClose?: () => void;
  onNewDirectMessage?: (message: Message) => void;
}

export const ChatSidebar = ({
  directChats,
  groupChats,
  selectedChatId,
  currentUserId,
  activeTab = 'direct',
  onChatSelect,
  onTabChange,
  onCreateGroup,
  onSidebarClose,
  onNewDirectMessage
}: ExtendedChatSidebarProps) => {
  // Get current user from store
  const currentUser = useUserStore(state => state.user);

  const handleNewDirectMessage = (message: Message) => {
    if (onNewDirectMessage) {
      onNewDirectMessage(message);
    }
  };

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    onChatSelect?.(chatId, type);
  };

  const handleTabChange = (tab: 'direct' | 'groups') => {
    onTabChange?.(tab);
  };

  return (
    <Card className="w-64 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <h2 className="font-semibold">Messages</h2>
        <div className="relative isolate">
          <div>
            <ChatManagementComponent
              currentUser={currentUser || undefined}
              onNewDirectMessage={handleNewDirectMessage}
              onChatSelect={handleChatSelect}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>
      <div
        className="flex-1 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <ChatList
          directChats={directChats}
          groupChats={groupChats}
          currentUserId={currentUserId}
          selectedChatId={selectedChatId}
          activeTab={activeTab}
          onChatSelect={handleChatSelect}
          onTabChange={handleTabChange}
          onNewDirectMessage={handleNewDirectMessage}
        />
      </div>
    </Card>
  );
};