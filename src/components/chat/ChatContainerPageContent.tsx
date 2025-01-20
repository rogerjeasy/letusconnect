"use client";

import { useEffect, useState } from 'react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { useUserStore } from '@/store/userStore';
import { DirectMessage, Message, Messages } from '@/store/message';
import { GroupChat, GroupSettings, BaseMessage } from '@/store/groupChat';
import { toast } from 'react-toastify';
import {
  getDirectMessages,
  sendDirectMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
} from '@/services/message.service';
import {
  getMyGroupChats,
  sendMessageToGroup,
  markGroupMessagesAsRead,
  updateGroupSettings,
  leaveGroupChat,
  processGroupChats,
} from '@/services/groupchat.service';
import { handleSendMessage } from './sendmessage/centralize.send.message';

const ContainerWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-[calc(100vh-4rem)] p-4 flex items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="flex w-[300%] h-full animate-slide">
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
        </div>
      </div>
      <div className="w-full max-w-4xl relative z-10">
        {children}
      </div>
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.66%);
          }
        }
        .animate-slide {
          animation: slide 20s linear infinite;
        }
      `}</style>
    </div>
  );


export default function ChatContainerPage() {
  const user = useUserStore((state) => state.user);
  const [directChats, setDirectChats] = useState<DirectMessage[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);

      const messagesResponse = await getDirectMessages();
      const allDirectMessages = messagesResponse.flatMap((m: Messages) => m.directMessages || []);
      setDirectChats(allDirectMessages);

      const groupChatsResponse = await getMyGroupChats();
      setGroupChats(groupChatsResponse);

      if (user?.uid) {
        await markMessagesAsRead(user.uid);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat messages';
      console.error('Error fetching chats:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchChats();
    }
  }, [user?.uid]);


  const handleSendingMessage = async (content: string, chatId: string, chatType: 'direct' | 'group') => {
    if (!user?.uid || !user?.username) {
      toast.error('You must be logged in to send messages');
      return;
    }

    await handleSendMessage({
      content,
      chatId,
      chatType,
      currentUserId: user.uid,
      username: user.username,
      updateDirectChats: setDirectChats,
      updateGroupChats: setGroupChats,
      groupChats
    });
  };

  const handleCreateGroup = async (name: string, description: string) => {
    toast.info('Group creation not implemented yet');
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroupChat(groupId);
      setGroupChats(prev => prev.filter(g => g.id !== groupId));
      toast.success('Successfully left the group');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave group';
      console.error('Error leaving group:', err);
      toast.error(errorMessage);
    }
  };

  const handleUpdateSettings = async (groupId: string, settings: Partial<GroupSettings>) => {
    try {
      await updateGroupSettings({ groupId, settings });
      setGroupChats(prev =>
        prev.map(g =>
          g.id === groupId
            ? { ...g, groupSettings: { ...g.groupSettings, ...settings } }
            : g
        )
      );
      toast.success('Group settings updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update group settings';
      console.error('Error updating group settings:', err);
      toast.error(errorMessage);
    }
  };

  if (!user?.uid) {
    return (
      <ContainerWrapper>
        <div className="h-[600px] flex items-center justify-center rounded-lg border bg-white">
          <p className="text-muted-foreground">Please log in to access chat</p>
        </div>
      </ContainerWrapper>
    );
  }

  if (loading) {
    return (
      <ContainerWrapper>
        <div className="h-[600px] flex items-center justify-center rounded-lg border bg-white">
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </ContainerWrapper>
    );
  }

  if (error) {
    return (
      <ContainerWrapper>
        <div className="h-[600px] flex items-center justify-center rounded-lg border bg-white">
          <p className="text-red-500">{error}</p>
        </div>
      </ContainerWrapper>
    );
  }

  return (
    <ContainerWrapper>
      <ChatContainer
        currentUserId={user.uid}
        directChats={directChats}
        groupChats={groupChats}
        onSendMessage={handleSendingMessage}
        onCreateGroup={handleCreateGroup}
        onLeaveGroup={handleLeaveGroup}
        onUpdateSettings={handleUpdateSettings}
      />
    </ContainerWrapper>
  );
}