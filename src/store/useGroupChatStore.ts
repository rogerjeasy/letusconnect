import { create } from 'zustand';
import { GroupChat, BaseMessage, GroupSettings } from "@/store/groupChat";
import { Participants } from './project';

interface GroupChatStore {
  // State
  groupChats: GroupChat[];
  activeGroupChatId: string | null;
  
  // Actions for managing group chat list
  addGroupChat: (groupChat: GroupChat) => void;
  removeGroupChat: (groupChatId: string) => void;
  updateGroupChat: (groupChatId: string, updates: Partial<GroupChat>) => void;
  
  // Actions for managing active group chat
  setActiveGroupChat: (groupChatId: string | null) => void;
  
  // Actions for managing messages
  addMessage: (groupChatId: string, message: BaseMessage) => void;
  updateMessage: (groupChatId: string, messageId: string, updates: Partial<BaseMessage>) => void;
  removeMessage: (groupChatId: string, messageId: string) => void;
  
  // Actions for managing participants
  addParticipant: (groupChatId: string, participant: Participants) => void;
  removeParticipant: (groupChatId: string, participantId: string) => void;
  
  // Actions for managing pinned messages
  pinMessage: (groupChatId: string, messageId: string) => void;
  unpinMessage: (groupChatId: string, messageId: string) => void;
  
  // Actions for managing group settings
  updateGroupSettings: (groupChatId: string, settings: Partial<GroupSettings>) => void;
}

export const useGroupChatStore = create<GroupChatStore>((set) => ({
  // Initial state
  groupChats: [],
  activeGroupChatId: null,

  // Group chat list management
  addGroupChat: (groupChat) =>
    set((state) => ({
      groupChats: state.groupChats.some((chat) => chat.id === groupChat.id)
        ? state.groupChats
        : [...state.groupChats, groupChat],
    })),
  
  
  removeGroupChat: (groupChatId) =>
    set((state) => ({
      groupChats: state.groupChats.filter((chat) => chat.id !== groupChatId),
      activeGroupChatId: state.activeGroupChatId === groupChatId ? null : state.activeGroupChatId
    })),

  updateGroupChat: (groupChatId, updates) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId ? { ...chat, ...updates } : chat
      )
    })),

  // Active group chat management
  setActiveGroupChat: (groupChatId) =>
    set(() => ({
      activeGroupChatId: groupChatId
    })),

  // Message management
  addMessage: (groupChatId, message) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    })),

  updateMessage: (groupChatId, messageId, updates) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              )
            }
          : chat
      )
    })),

  removeMessage: (groupChatId, messageId) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              messages: chat.messages.filter((msg) => msg.id !== messageId)
            }
          : chat
      )
    })),

  // Participant management
  addParticipant: (groupChatId, participant) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? { ...chat, participants: [...chat.participants, participant] }
          : chat
      )
    })),

  removeParticipant: (groupChatId, participantId) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              participants: chat.participants.filter(
                (p) => p.userId !== participantId
              )
            }
          : chat
      )
    })),

  // Pinned messages management
  pinMessage: (groupChatId, messageId) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              pinnedMessages: [...chat.pinnedMessages, messageId]
            }
          : chat
      )
    })),

  unpinMessage: (groupChatId, messageId) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              pinnedMessages: chat.pinnedMessages.filter((id) => id !== messageId)
            }
          : chat
      )
    })),

  // Group settings management
  updateGroupSettings: (groupChatId, settings) =>
    set((state) => ({
      groupChats: state.groupChats.map((chat) =>
        chat.id === groupChatId
          ? {
              ...chat,
              groupSettings: { ...chat.groupSettings, ...settings }
            }
          : chat
      )
    }))
}));