import { Participants } from "./project";

export interface BaseMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    readStatus: Record<string, boolean>;
    isDeleted: boolean;
    attachments?: string[];
    reactions?: Record<string, number>;
    messageType: string;
    replyToId?: string;
    isPinned: boolean;
    priority?: string;
  }
  
  export interface GroupSettings {
    allowFileSharing: boolean;
    allowPinning: boolean;
    allowReactions: boolean;
    allowReplies: boolean;
    muteNotifications: boolean;
    onlyAdminsCanPost: boolean;
  }
  
  export interface GroupChat {
    id: string;
    projectId: string;
    createdByUid: string;
    createdByName: string;
    name: string;
    description?: string;
    participants: Participants[];
    messages: BaseMessage[];
    pinnedMessages: string[];
    isArchived: boolean;
    notifications: Record<string, boolean>;
    createdAt: string;
    updatedAt: string;
    readStatus: Record<string, boolean>;
    groupSettings: GroupSettings;
  }
  