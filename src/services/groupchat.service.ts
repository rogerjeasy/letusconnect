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
 * @param updateMessages - Callback to handle updating the message state.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendMessageToGroup = async (
    groupChatId: string,
    content: string,
    updateMessages: (newMessage: BaseMessage) => void,
    setNewMessage: Dispatch<SetStateAction<string>>,
    setSendingMessage: Dispatch<SetStateAction<boolean>>,
    updateEntity: (entityId: string, updatedEntity: Partial<ChatEntity>) => void,
    currentMessages: BaseMessage[]
  ) => {
    if (!content.trim()) return;
  
    try {
      setSendingMessage(true);
  
      const payload = { groupChatId, content };
      const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.MESSAGES, payload);
  
      const sentMessage: BaseMessage = response.data.data;
      
      // Update local messages state
      updateMessages(sentMessage);
      
      // Update entity in Zustand store with new message
      updateEntity(groupChatId, {
        groupMessages: [...currentMessages, sentMessage]
      });
      
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
 * Get total unread messages count across all group chats for current user
 * @param setTotalUnreadCount Optional function to set the total unread count
 * @returns Promise with the total unread count
 */
export const getAllUnreadGroupMessagesForUser = async (
  setTotalUnreadCount?: (count: number) => void
): Promise<number> => {
  try {
    const response = await api.get<{ unreadCount: number }>(
      API_CONFIG.ENDPOINTS.GROUP_CHATS.TOTAL_UNREAD_FOR_USER
    );
    
    const totalUnreadCount = response.data.unreadCount;
    
    // Update state if setter function is provided
    if (setTotalUnreadCount) {
      setTotalUnreadCount(totalUnreadCount);
    }
    
    return totalUnreadCount;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch total unread group messages count");
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
 * @param groupId ID of the group chat
 * @param settingsData New settings data
 */
export const updateGroupSettings = async (
  groupId: string,
  settingsData: GroupSettings
): Promise<void> => {
  try {
    await api.put(API_CONFIG.ENDPOINTS.GROUP_CHATS.SETTINGS(groupId), settingsData);
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

/**
 * Delete a single group chat
 * @param groupChatId ID of the group chat to delete
 * @returns Promise<void>
 */
export const deleteGroupChat = async (groupChatId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_CHATS.DELETE_GROUP_CHAT(groupChatId));
    toast.success("Group chat deleted successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    if (errorMessage.includes("unauthorized")) {
      toast.error("You don't have permission to delete this group chat");
    } else {
      toast.error(errorMessage || "Failed to delete group chat");
    }
    throw new Error(errorMessage || "Failed to delete group chat");
  }
};

/**
 * Delete multiple group chats at once
 * @param groupChatIds Array of group chat IDs to delete
 * @returns Promise<void>
 */
export const deleteMultipleGroupChats = async (groupChatIds: string[]): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.GROUP_CHATS.DELETE_MULTIPLE_GROUP_CHATS, {
      data: { chatIds: groupChatIds }
    });
    toast.success("Group chats deleted successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    if (errorMessage.includes("Unauthorized")) {
      toast.error("You don't have permission to delete one or more group chats");
    } else {
      toast.error(errorMessage || "Failed to delete group chats");
    }
    throw new Error(errorMessage || "Failed to delete group chats");
  }
};

interface CreateGroupRequest {
  name: string;
  description: string;
  participants: Participants[];
}

interface CreateGroupResponse {
  groupId: string;
  projectId?: string;
  message?: string;
  data: GroupChat;
}

/**
 * Create a new group chat
 * @param groupData Group creation data containing name, description and participants
 * @param currentUser Current user information
 * @param onSuccess Optional callback function to handle successful group creation
 * @returns Promise with the created GroupChat
 */
export const createGroupChat = async (
  groupData: CreateGroupRequest,
): Promise<GroupChat> => {
  try {
    const response = await api.post<CreateGroupResponse>(
      API_CONFIG.ENDPOINTS.GROUP_CHATS.BASE,
      groupData
    );

    const groupChatData: GroupChat = {
      ...response.data.data,
      messages: response.data.data.messages || [],
    };

    toast.success(response.data.message || "Group created successfully.");
    return groupChatData;

  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to create group: " + errorMessage);
    throw new Error(errorMessage || "Failed to create group chat");
  }
};