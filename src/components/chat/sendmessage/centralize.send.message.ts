"use client";

import { DirectMessage } from '@/store/message';
import { BaseMessage, GroupChat } from '@/store/groupChat';
import { toast } from 'react-toastify';
import { sendDirectMessage, SendMessage } from '@/services/message.service';
import { sendMessageToGroup } from '@/services/groupchat.service';
import { useGroupChatStore } from '@/store/useGroupChatStore';

interface SendMessageParams {
  content: string;
  chatId: string;
  chatType: 'direct' | 'group';
  currentUserId: string;
  username: string;
  updateDirectChats: (updater: (prev: DirectMessage[]) => DirectMessage[]) => void;
  updateGroupChats: (updater: (prev: GroupChat[]) => GroupChat[]) => void;
  groupChats: GroupChat[];
}

export const handleSendMessage = async ({
  content,
  chatId,
  chatType,
  currentUserId,
  username,
  updateDirectChats,
  updateGroupChats,
  groupChats
}: SendMessageParams): Promise<void> => {
  if (!content.trim()) {
    return;
  }

  if (!currentUserId) {
    toast.error('You must be logged in to send messages');
    return;
  }

  if (chatType === 'direct') {
    await handleDirectMessage({
      content,
      receiverId: chatId,
      currentUserId,
      username,
      updateDirectChats
    });
  } else {
    await handleGroupMessage({
      content,
      groupId: chatId,
      currentUserId,
      username,
      updateGroupChats,
      groupChats
    });
  }
};

interface DirectMessageParams {
  content: string;
  receiverId: string;
  currentUserId: string;
  username: string;
  updateDirectChats: (updater: (prev: DirectMessage[]) => DirectMessage[]) => void;
}

const handleDirectMessage = async ({
  content,
  receiverId,
  currentUserId,
  username,
  updateDirectChats
}: DirectMessageParams): Promise<void> => {
  const tempMessage: DirectMessage = {
    id: Date.now().toString(),
    senderId: currentUserId,
    senderName: username || 'Anonymous',
    receiverId,
    receiverName: 'Placeholder',
    content,
    messageType: 'text',
    createdAt: new Date().toISOString(),
    attachments: []
  };

  try {
    updateDirectChats(prev => [...prev, tempMessage]);

    await sendDirectMessage(
      receiverId,
      content,
      (newMessage: SendMessage) => {
        if ('receiverId' in newMessage) {
          updateDirectChats(prev =>
            prev.map(m => m.id === tempMessage.id ? newMessage : m)
          );
        }
      },
      () => {}, // setNewMessage handled by child component
      () => {}  // setSendingMessage handled by child component
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
    console.error('Error sending direct message:', err);
    toast.error(errorMessage);
    
    updateDirectChats(prev => prev.filter(m => m.id !== tempMessage.id));
  }
};

interface GroupMessageParams {
  content: string;
  groupId: string;
  currentUserId: string;
  username: string;
  updateGroupChats: (updater: (prev: GroupChat[]) => GroupChat[]) => void;
  groupChats: GroupChat[];
}

const handleGroupMessage = async ({
  content,
  groupId,
  currentUserId,
  username,
  updateGroupChats,
  groupChats
}: GroupMessageParams): Promise<void> => {
  const group = groupChats.find(g => g.id === groupId);
  if (!group) {
    toast.error('Group not found');
    return;
  }

  if (!Array.isArray(group.messages)) {
    group.messages = [];
  }

  const tempMessage: BaseMessage = {
    id: Date.now().toString(),
    senderId: currentUserId,
    senderName: username || 'Anonymous',
    content,
    createdAt: new Date().toISOString(),
    readStatus: {},
    isDeleted: false,
    messageType: 'text',
    isPinned: false
  };

  const { addMessage, updateMessage, removeMessage } = useGroupChatStore.getState();

  try {
    addMessage(groupId, tempMessage);

    await sendMessageToGroup(
      groupId,
      content,
      (message: BaseMessage) => {
        updateMessage(groupId, tempMessage.id, message);
      },
      () => {}, 
      () => {},
      () => {}, 
      Array.isArray(group.messages) ? group.messages : []
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send message to group';
    console.error('Error sending group message:', err);
    toast.error(errorMessage);
    
    removeMessage(groupId, tempMessage.id);
    }
  };