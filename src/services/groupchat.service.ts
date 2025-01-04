"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Dispatch, SetStateAction } from "react";
import { BaseMessage, GroupChat, GroupSettings } from "@/store/groupChat";
import { Participants } from "@/store/project";
import { ChatEntity } from "@/store/chatEntitiesStore";
import { toast } from "react-toastify";

interface GroupChatResponse {
  data: GroupChat[];
}

interface UnreadCountResponse {
  unreadCount: number;
}

interface SendGroupMessageRequest {
  groupId: string;
  content: string;
  messageType?: string;
  attachments?: string[];
  replyToId?: string;
  priority?: string;
}

interface PinMessageRequest {
  groupId: string;
  messageId: string;
}

interface ReactionRequest {
  groupId: string;
  messageId: string;
  reaction: string;
}

interface RoleUpdateRequest {
  groupId: string;
  participantId: string;
  role: string;
}

interface GroupSettingsUpdateRequest {
  groupId: string;
  settings: Partial<GroupSettings>;
}

/**
 * Fetch all group chats for the current user
 * @returns Promise with array of GroupChat
 */
export const getMyGroupChats = async (): Promise<GroupChat[]> => {
  try {
    const response = await api.get<GroupChatResponse>(API_CONFIG.ENDPOINTS.GROUP_CHATS.MY_CHATS);
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch group chats");
  }
};

/**
 * Send a new message to a group chat.
 * @param groupChatId - The ID of the group chat.
 * @param content - The message content to send.
 * @param token - User's authorization token.
 * @param updateMessages - Callback to handle updating the message state.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendMessageToGroup = async (
    groupChatId: string,
    content: string,
    token: string,
    updateMessages: (newMessage: BaseMessage) => void,
    setNewMessage: Dispatch<SetStateAction<string>>,
    setSendingMessage: Dispatch<SetStateAction<boolean>>
  ) => {
    if (!content.trim()) return;
  
    try {
      setSendingMessage(true);
  
      const payload = { groupChatId, content };
      const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.MESSAGES, payload);
  
      const sentMessage: BaseMessage = response.data.data;
      updateMessages(sentMessage);
      setNewMessage("");
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error("Failed to send message. " + errorMessage);
    } finally {
      setSendingMessage(false);
    }
};



/**
 * Mark messages as read in a group chat
 * @param groupChatId ID of the group chat
 */
export const markGroupMessagesAsRead = async (groupChatId: string): Promise<void> => {
  try {
    await api.patch(API_CONFIG.ENDPOINTS.GROUP_CHATS.MARK_READ(groupChatId));
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to mark group messages as read");
  }
};

/**
 * Get unread message count for group chats
 * @param setUnreadCount Optional function to set the unread count
 */
export const getGroupUnreadCount = async (
    groupChatId?: string,
    setUnreadCount?: (count: number) => void,
    setUnreadCounts?: Dispatch<SetStateAction<Record<string, number>>>
  ): Promise<number> => {
    try {
      const url = groupChatId 
        ? `${API_CONFIG.ENDPOINTS.GROUP_CHATS.UNREAD_COUNT}?groupChatId=${groupChatId}`
        : API_CONFIG.ENDPOINTS.GROUP_CHATS.UNREAD_COUNT;
        
      const response = await api.get<UnreadCountResponse>(url);
      const unreadCount = response.data.unreadCount;
      
      if (groupChatId && setUnreadCounts) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [groupChatId]: unreadCount,
        }));
      } else if (setUnreadCount) {
        setUnreadCount(unreadCount);
      }
      
      return unreadCount;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(errorMessage || "Failed to fetch group unread count");
    }
  };

/**
 * Pin a message in a group chat
 * @param pinData Data containing group ID and message ID
 */
export const pinMessage = async (pinData: PinMessageRequest): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.PIN.ADD, pinData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to pin message");
  }
};

/**
 * Unpin a message from a group chat
 * @param pinData Data containing group ID and message ID
 */
export const unpinMessage = async (pinData: PinMessageRequest): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.PIN.REMOVE, pinData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to unpin message");
  }
};

/**
 * Add a reaction to a message
 * @param reactionData Data containing group ID, message ID and reaction
 */
export const addReaction = async (reactionData: ReactionRequest): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.REACTIONS, reactionData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to add reaction");
  }
};

/**
 * Update participant role in a group chat
 * @param roleData Data containing group ID, participant ID and new role
 */
export const updateParticipantRole = async (roleData: RoleUpdateRequest): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.ROLES, roleData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to update participant role");
  }
};

/**
 * Update group chat settings
 * @param settingsData New settings data
 */
export const updateGroupSettings = async (
  settingsData: GroupSettingsUpdateRequest
): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.SETTINGS, settingsData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to update group settings");
  }
};

/**
 * Leave a group chat
 * @param groupChatId ID of the group chat to leave
 */
export const leaveGroupChat = async (groupChatId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_CHATS.LEAVE(groupChatId));
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to leave group chat");
  }
};

/**
 * Process group chats data for the UI
 * @param groupChats Array of GroupChat objects
 * @param setPinnedMessagesMap Function to set pinned messages map
 * @param addParticipant Function to add participants to store
 * @returns Processed chat entities
 */
export const processGroupChats = (
  groupChats: GroupChat[],
  setPinnedMessagesMap: (map: Record<string, string[]>) => void,
  addParticipant: (groupId: string, participants: Participants[]) => void
): ChatEntity[] => {
  // Map each group's pinned messages
  const newPinnedMessagesMap: Record<string, string[]> = {};
  groupChats.forEach((group) => {
    newPinnedMessagesMap[group.id] = group.pinnedMessages || [];
  });
  setPinnedMessagesMap(newPinnedMessagesMap);

  return groupChats.map((group) => {
    const groupMessages: BaseMessage[] = group.messages || [];
    const participants: Participants[] = group.participants || [];
    addParticipant(group.id, participants);

    return {
      id: group.id,
      name: group.name,
      avatar: "",
      type: "group",
      groupMessages: groupMessages,
      directMessages: [],
      participants: participants,
    };
  });
};