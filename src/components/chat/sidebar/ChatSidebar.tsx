"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatList } from "./ChatList";
import { ChatSidebarProps } from "../types/chat";
import ChatManagement from "@/components/messages/ChatManagement";

interface ExtendedChatSidebarProps extends ChatSidebarProps {
  onSidebarClose?: () => void;
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
  onSidebarClose
}: ExtendedChatSidebarProps) => {
  return (
    <Card className="w-64 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <h2 className="font-semibold">Messages</h2>
        <div className="relative isolate">
          <div onClick={() => onSidebarClose?.()}>
            <ChatManagement />
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
          onChatSelect={onChatSelect}
          onTabChange={onTabChange}
        />
      </div>
    </Card>
  );
};