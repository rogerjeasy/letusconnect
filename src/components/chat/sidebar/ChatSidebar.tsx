"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ChatList } from "./ChatList";
import { ChatSidebarProps } from "../types/chat";
import ChatManagement from "@/components/messages/ChatManagement";

export const ChatSidebar = ({
  directChats,
  groupChats,
  selectedChatId,
  currentUserId,
  onChatSelect,
}: ChatSidebarProps) => {
  return (
    <Card className="w-64 h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center shrink-0">
        <h2 className="font-semibold">Messages</h2>
        <ChatManagement />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatList
          directChats={directChats}
          groupChats={groupChats}
          currentUserId={currentUserId}
          selectedChatId={selectedChatId}
          onChatSelect={onChatSelect}
        />
      </div>
    </Card>
  );
};