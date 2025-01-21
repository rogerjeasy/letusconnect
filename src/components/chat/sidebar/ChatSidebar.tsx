"use client";

import { Card } from "@/components/ui/card";
import { ChatList } from "./ChatList";
import { ChatSidebarProps } from "../types/chat";
import { Message } from "@/store/message";
import ChatManagementComponent from "../settings/ChatManagementComponent";
import { useUserStore } from "@/store/userStore";
import { GroupChat } from "@/store/groupChat";
import { useGroupChatStore } from "@/store/useGroupChatStore";
import { useEffect } from "react";

type BaseSidebarProps = Omit<ChatSidebarProps, 'onCreateGroup'>;

interface ExtendedChatSidebarProps extends BaseSidebarProps {
  onSidebarClose?: () => void;
  onNewDirectMessage?: (message: Message) => void;
  onCreateGroup?: (group: GroupChat) => Promise<void>;
}

export const ChatSidebar = ({
    directChats,
    selectedChatId,
    currentUserId,
    activeTab = 'direct',
    onChatSelect,
    onTabChange,
    onSidebarClose,
    onNewDirectMessage,
    onCreateGroup
  }: ExtendedChatSidebarProps) => {
  const currentUser = useUserStore(state => state.user);
  const groupChats = useGroupChatStore(state => state.groupChats);

  const handleNewDirectMessage = (message: Message) => {
    if (onNewDirectMessage) {
      onNewDirectMessage(message);
    }
  };

  const handleCreateGroup = async (group: GroupChat) => {
    if (onCreateGroup) {
      await onCreateGroup(group);
    }
    onTabChange?.('groups');
    onChatSelect?.(group.id, 'group');
  };

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    onChatSelect?.(chatId, type);
    if (onSidebarClose) {
      onSidebarClose();
    }
  };

  const handleTabChange = (tab: 'direct' | 'groups') => {
    onTabChange?.(tab);
  };

  useEffect(() => {
  }, [groupChats]);

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
              onCreateGroup={handleCreateGroup}
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