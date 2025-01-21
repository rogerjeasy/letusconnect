// src/components/chat/types/chat.d.ts

import { BaseMessage, GroupChat, GroupSettings } from "@/store/groupChat";
import { DirectMessage } from "@/store/message";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface ChatProps {
  currentUserId: string;
  directChats: DirectMessage[];
  groupChats: GroupChat[];
  onSendMessage: (message: string, receiverId: string) => Promise<void>;
  onCreateGroup?: () => void;
  onLeaveGroup?: (groupId: string) => Promise<void>;
  onUpdateSettings?: (settings: Partial<GroupSettings>) => Promise<void>;
}

export interface MessageBubbleProps {
  message: BaseMessage | DirectMessage;
  isOwn: boolean;
}

export interface MessageInputProps {
  onSend: (content: string) => void;
  onAttach?: (files: FileList) => void;
  disabled?: boolean;
}

export interface ChatHeaderProps {
  title: string;
  avatar?: string;
  status?: string;
  membersCount?: number;
  type: 'direct' | 'group';
  onSettingsClick: () => void;
}

export interface ChatSidebarProps {
  directChats: DirectMessage[];
  groupChats: GroupChat[];
  currentUserId: string;
  selectedChatId?: string;
  activeTab?: 'direct' | 'groups';
  onChatSelect: (chatId: string, type: 'direct' | 'group') => void;
  onTabChange?: (tab: 'direct' | 'groups') => void;
  onCreateGroup: () => void;
}

export interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GroupSettings;
  onUpdate: (settings: GroupSettings) => void;
  type: 'direct' | 'group';
  chatId: string;
}