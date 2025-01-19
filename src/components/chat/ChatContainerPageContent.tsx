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

  const handleSendDirectMessage = async (content: string, receiverId: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in to send messages');
      return;
    }

    const tempMessage: DirectMessage = {
      id: Date.now().toString(),
      senderId: user.uid,
      senderName: user.username || 'Anonymous',
      receiverId,
      receiverName: directChats.find(chat => chat.senderId === receiverId)?.senderName || '',
      content,
      messageType: 'text',
      createdAt: new Date().toISOString(),
      attachments: []
    };

    try {
        setDirectChats(prev => [...prev, tempMessage]);

        // await sendDirectMessage(
        //     receiverId,
        //     content,
        //     (newMessage: Message) => {
        //       if ('receiverId' in newMessage) {
        //         // Handle DirectMessage
        //         setDirectChats((prev) =>
        //           prev.map((m) =>
        //             m.id === tempMessage.id ? (newMessage as DirectMessage) : m
        //           )
        //         );
        //       } else {
        //         console.error("Unexpected message type received:", newMessage);
        //       }
        //     },
        //     () => {}, // setNewMessage handled by child component
        //     () => {}  // setSendingMessage handled by child component
        //   );
          
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('Error sending message:', err);
      toast.error(errorMessage);
      
      setDirectChats(prev => prev.filter(m => m.id !== tempMessage.id));
    }
  };

  const handleSendGroupMessage = async (content: string, groupId: string) => {
    if (!user?.uid) {
      toast.error('You must be logged in to send messages');
      return;
    }

    const group = groupChats.find((g) => g.id === groupId);
    if (!group) {
      toast.error('Group not found');
      return;
    }

    const tempMessage: BaseMessage = {
      id: Date.now().toString(),
      senderId: user.uid,
      senderName: user.username || 'Anonymous',
      content,
      createdAt: new Date().toISOString(),
      readStatus: {},
      isDeleted: false,
      messageType: 'text',
      isPinned: false
    };

    try {
      setGroupChats(prev =>
        prev.map(g =>
          g.id === groupId
            ? { ...g, messages: [...g.messages, tempMessage] }
            : g
        )
      );

      await sendMessageToGroup(
        groupId,
        content,
        (message: BaseMessage) => {
          setGroupChats(prev =>
            prev.map(g =>
              g.id === groupId
                ? {
                    ...g,
                    messages: g.messages.map(m =>
                      m.id === tempMessage.id ? message : m
                    ),
                  }
                : g
            )
          );
        },
        () => {}, // setNewMessage handled by child component
        () => {}, // setSendingMessage handled by child component
        () => {}, // updateEntity handled by store
        group.messages
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message to group';
      console.error('Error sending group message:', err);
      toast.error(errorMessage);
      
      setGroupChats(prev =>
        prev.map(g =>
          g.id === groupId
            ? {
                ...g,
                messages: g.messages.filter(m => m.id !== tempMessage.id),
              }
            : g
        )
      );
    }
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
        onSendMessage={handleSendDirectMessage}
        onCreateGroup={handleCreateGroup}
        onLeaveGroup={handleLeaveGroup}
        onUpdateSettings={handleUpdateSettings}
      />
    </ContainerWrapper>
  );
}