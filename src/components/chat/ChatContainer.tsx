"use client";

import { useState, useEffect } from 'react';
import { ChatSidebar } from './sidebar/ChatSidebar';
import { ChatHeader } from './header/ChatHeader';
import { MessageList } from './message/MessageList';
import { MessageInput } from './message/MessageInput';
import { ChatSettings } from './settings/ChatSettings';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { DirectMessage } from '@/store/message';
import { GroupChat, GroupSettings } from '@/store/groupChat';

interface ChatProps {
  currentUserId: string;
  directChats: DirectMessage[];
  groupChats: GroupChat[];
  onSendMessage: (content: string, receiverId: string) => Promise<void>;
  onCreateGroup?: (name: string, description: string) => Promise<void>;
  onLeaveGroup?: (groupId: string) => Promise<void>;
  onUpdateSettings?: (groupId: string, settings: Partial<GroupSettings>) => Promise<void>;
}

type SelectedChat = {
  id: string;
  type: 'direct' | 'group';
} | null;

const isGroupChat = (chat: DirectMessage | GroupChat): chat is GroupChat => {
  return 'participants' in chat;
};

const isDirectChat = (chat: any): chat is DirectMessage => {
  return 'receiverId' in chat && 'senderId' in chat;
};

export const ChatContainer = ({
  currentUserId,
  directChats,
  groupChats,
  onSendMessage,
  onCreateGroup,
  onLeaveGroup,
  onUpdateSettings
}: ChatProps) => {
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCurrentChat = (): DirectMessage | GroupChat | null => {
    if (!selectedChat || selectedChat.type !== activeTab.replace('s', '')) {
      return null;
    }
    
    if (selectedChat.type === 'direct') {
      const relevantMessages = directChats.filter(msg => 
        msg.senderId === selectedChat.id || msg.receiverId === selectedChat.id
      );
      if (relevantMessages.length === 0) return null;
      return relevantMessages[relevantMessages.length - 1];
    }
    
    return groupChats.find(group => group.id === selectedChat.id) || null;
  };

  const getMessagesForChat = (chat: DirectMessage | GroupChat | null, directChats: DirectMessage[], currentUserId: string) => {
    if (!chat) return [];
    
    if (isGroupChat(chat)) {
      return chat.messages;
    }
    
    const chatPartnerId = chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
    return directChats.filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === chatPartnerId) ||
      (msg.receiverId === currentUserId && msg.senderId === chatPartnerId)
    );
  };

  const handleTabChange = (tab: 'direct' | 'groups') => {
    setActiveTab(tab);
    setSelectedChat(null); // Reset selected chat when switching tabs
  };

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    // Only set selected chat if the type matches the active tab
    if ((type === 'direct' && activeTab === 'direct') || 
        (type === 'group' && activeTab === 'groups')) {
      setSelectedChat({ id: chatId, type });
    }
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (selectedChat) {
      await onSendMessage(content, selectedChat.id);
    }
  };

  const currentChat = getCurrentChat();
  
  const getChatName = (chat: DirectMessage | GroupChat | null): string => {
    if (!chat) return 'Chat';
    if (isGroupChat(chat)) return chat.name;
    return chat.senderId === currentUserId ? chat.receiverName : chat.senderName;
  };

  const renderSidebar = () => (
    <ChatSidebar
      directChats={directChats}
      groupChats={groupChats}
      currentUserId={currentUserId}
      selectedChatId={selectedChat?.id}
      onChatSelect={handleChatSelect}
      onCreateGroup={() => setShowCreateGroup(true)}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSidebarClose={() => setIsMobileOpen(false)}
    />
  );

  return (
    <div className="h-[600px] max-w-4xl mx-auto flex rounded-lg border">
      <div className="hidden md:block w-64">
        {renderSidebar()}
      </div>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <button className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors">
            <Menu className="h-6 w-6 text-emerald-500 hover:text-emerald-600" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-4 py-2 border-b">
              <SheetTitle>Chat Menu</SheetTitle>
            </SheetHeader>
            {renderSidebar()}
          </div>
        </SheetContent>
      </Sheet>

      <Card className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ChatHeader
              title={getChatName(currentChat)}
              type={selectedChat?.type || 'direct'}
              participants={isGroupChat(currentChat) ? currentChat.participants : undefined}
              membersCount={
                isGroupChat(currentChat)
                  ? currentChat.participants?.length
                  : undefined
              }
              onSettingsClick={() => setShowSettings(true)}
            />

            <MessageList
                messages={getMessagesForChat(currentChat, directChats, currentUserId)}
                currentUserId={currentUserId}
                chatType={selectedChat?.type}
            />

            <MessageInput
              onSend={handleSendMessage}
              onAttach={(files) => console.log('Attachments:', files)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a {activeTab === 'direct' ? 'conversation' : 'group'} to start messaging
          </div>
        )}
      </Card>

      {selectedChat?.type === 'group' && currentChat && isGroupChat(currentChat) && (
        <ChatSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={currentChat.groupSettings}
          onUpdate={(settings) => 
            onUpdateSettings?.(selectedChat.id, settings)
          }
          type="group"
          chatId={selectedChat.id}
        />
      )}
    </div>
  );
};