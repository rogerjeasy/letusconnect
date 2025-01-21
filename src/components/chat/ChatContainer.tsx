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
import { DirectMessage, Message } from '@/store/message';
import { GroupChat, GroupSettings } from '@/store/groupChat';
import { useGroupChatStore } from '@/store/useGroupChatStore';
import { toast } from 'react-toastify';

interface ChatProps {
  currentUserId: string;
  directChats: DirectMessage[];
  onSendMessage: (content: string, chatId: string, chatType: 'direct' | 'group') => Promise<void>;
  onCreateGroup?: (group: GroupChat) => Promise<void>;
  onLeaveGroup?: (groupId: string) => Promise<void>;
  onUpdateSettings?: (groupId: string, settings: GroupSettings) => Promise<void>;
  onDeleteGroup?: (groupId: string) => Promise<void>;
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
  onSendMessage,
  onCreateGroup,
  onLeaveGroup,
  onUpdateSettings,
  onDeleteGroup
}: ChatProps) => {
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');
  const [pendingChats, setPendingChats] = useState<DirectMessage[]>([]);

  const groupChats = useGroupChatStore(state => state.groupChats);

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
      const pendingChat = pendingChats.find(chat => 
        chat.receiverId === selectedChat.id || chat.senderId === selectedChat.id
      );
      if (pendingChat) return pendingChat;

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
    
    // Combine pending and existing messages
    const existingMessages = directChats.filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === chatPartnerId) ||
      (msg.receiverId === currentUserId && msg.senderId === chatPartnerId)
    );
    
    const pendingMessages = pendingChats.filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === chatPartnerId) ||
      (msg.receiverId === currentUserId && msg.senderId === chatPartnerId)
    );
    
    return [...existingMessages, ...pendingMessages];
  };

  const handleTabChange = (tab: 'direct' | 'groups') => {
    setActiveTab(tab);
    setSelectedChat(null);
  };

  const handleChatSelect = (chatId: string, type: 'direct' | 'group') => {
    if ((type === 'direct' && activeTab === 'direct') || 
        (type === 'group' && activeTab === 'groups')) {
      setSelectedChat({ id: chatId, type });
    }
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleNewDirectMessage = (message: Message) => {
    setPendingChats(prev => [...prev, message as DirectMessage]);
    setSelectedChat({ id: message.receiverId, type: 'direct' });
    setActiveTab('direct');
  };

  const handleSendMessage = async (content: string) => {
    if (selectedChat) {
      await onSendMessage(content, selectedChat.id, selectedChat.type);
    }
  };

  const getPartnerId = (chat: DirectMessage | GroupChat | null): string | undefined => {
    if (!chat || isGroupChat(chat)) return undefined;
    return chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
  };

  const currentChat = getCurrentChat();
  
  const getChatName = (chat: DirectMessage | GroupChat | null): string => {
    if (!chat) return 'Chat';
    if (isGroupChat(chat)) return chat.name;
    return chat.senderId === currentUserId ? chat.receiverName : chat.senderName;
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await onDeleteGroup?.(groupId);
      setSelectedChat(null);
      setShowSettings(false);
    } catch (error) {
      console.error('Error deleting group chat:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (selectedChat?.type === 'group') {
      try {
        await onLeaveGroup?.(selectedChat.id);
        setSelectedChat(null);
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
  };

  const handleCreateNewGroup = async (group: GroupChat) => {
    try {
      await onCreateGroup?.(group);
      handleChatSelect(group.id, 'group');
      setActiveTab('groups');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleSettingsUpdate = async (groupId: string, settings: GroupSettings) => {
    if (!currentChat || !isGroupChat(currentChat)) {
      return;
    }
    try {
      await onUpdateSettings?.(groupId, settings);
      setShowSettings(false); 
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update group settings');
    }
  };


  const renderSidebar = () => (
    <ChatSidebar
      directChats={[...pendingChats, ...directChats]}
      groupChats={groupChats}
      currentUserId={currentUserId}
      selectedChatId={selectedChat?.id}
      onChatSelect={handleChatSelect}
      onCreateGroup={handleCreateNewGroup}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSidebarClose={() => setIsMobileOpen(false)}
      onNewDirectMessage={handleNewDirectMessage}
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
              partnerId={getPartnerId(currentChat)}
              membersCount={
                isGroupChat(currentChat)
                  ? currentChat.participants?.length
                  : undefined
              }
              onSettingsClick={() => setShowSettings(true)}
              onLeaveGroup={handleLeaveGroup}
              onDeleteGroup={handleDeleteGroup}
              groupId={selectedChat?.type === 'group' ? selectedChat.id : undefined}
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
            onUpdate={(settings) => handleSettingsUpdate(selectedChat.id, settings)}
            type="group"
            chatId={selectedChat.id}
        />
    )}
    </div>
  );
};