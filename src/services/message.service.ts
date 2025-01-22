"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Dispatch, SetStateAction } from "react";
import { DirectMessage, MarkReadRequest, Messages, SendMessageRequest, TypingStatusRequest } from "@/store/message";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/userStore";
import { BaseMessage } from "@/store/groupChat";
import axios from "axios";

interface UnreadCountResponse {
  unreadCount: number;
}

/**
 * Fetch unread message count.
 * @param setUnreadCount - Optional function to set the total unread count
 * @param setUnreadCounts - Optional function to set unread counts per user
 * @param userId - Optional user ID to fetch unread count for specific user
 * @returns Promise with the unread count
 */
export const getUnreadDirectMessageCount = async (
  setUnreadCount?: (count: number) => void,
  setUnreadCounts?: Dispatch<SetStateAction<Record<string, number>>>,
  userId?: string
): Promise<number> => {
  try {
    const url = userId 
      ? `${API_CONFIG.ENDPOINTS.MESSAGES.UNREAD}?senderId=${userId}`
      : API_CONFIG.ENDPOINTS.MESSAGES.UNREAD;
    const response = await api.get<UnreadCountResponse>(url);
    const unreadCount = response.data.unreadCount;

    // Update state if setter functions are provided
    if (userId && setUnreadCounts) {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [userId]: unreadCount,
      }));
    } else if (setUnreadCount) {
      setUnreadCount(unreadCount);
    }

    return unreadCount;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch unread messages count");
  }
};

/**
 * Fetch direct messages for the current user
 * @returns Promise with array of Messages
 */
export const getDirectMessages = async (): Promise<Messages[]> => {
  try {
    const response = await api.get<{ messages: Messages[] }>(API_CONFIG.ENDPOINTS.MESSAGES.DIRECT);
    return response.data.messages;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch direct messages");
  }
};


/**
 * Update typing status
 * @param typingData - Typing status data including receiver ID and typing state
 */
export const updateTypingStatus = async (typingData: TypingStatusRequest): Promise<void> => {
  try {
    await api.post(API_CONFIG.ENDPOINTS.MESSAGES.TYPING, typingData);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to update typing status");
  }
};

// /**
//  * Fetch unread message count
//  * @param setUnreadCount - Optional function to set the total unread count
//  * @param setUnreadCounts - Optional function to set unread counts per user
//  * @param userId - Optional user ID to fetch unread count for specific user
//  * @returns Promise with the unread count
//  */
// export const getUnreadMessageCount = async (
//   setUnreadCount?: (count: number) => void,
//   setUnreadCounts?: Dispatch<SetStateAction<Record<string, number>>>,
//   userId?: string
// ): Promise<number> => {
//   try {
//     const url = userId
//       ? `${API_CONFIG.ENDPOINTS.MESSAGES.UNREAD}?senderId=${userId}`
//       : API_CONFIG.ENDPOINTS.MESSAGES.UNREAD;
    
//     const response = await api.get<UnreadCountResponse>(url);
//     const unreadCount = response.data.unreadCount;
    
//     if (userId && setUnreadCounts) {
//       setUnreadCounts((prevCounts) => ({
//         ...prevCounts,
//         [userId]: unreadCount,
//       }));
//     } else if (setUnreadCount) {
//       setUnreadCount(unreadCount);
//     }
    
//     return unreadCount;
//   } catch (error) {
//     const errorMessage = handleError(error);
//     throw new Error(errorMessage || "Failed to fetch unread messages count");
//   }
// };

/**
 * Mark messages as read
 * @param senderId - ID of the sender whose messages to mark as read
 * @returns A promise that resolves when the operation is complete
 */
export const markMessagesAsRead = async (senderId: string): Promise<void> => {
  try {
    const data: MarkReadRequest = { senderId };
    const response = await api.patch(API_CONFIG.ENDPOINTS.MESSAGES.MARK_READ, data);
    
    if (response.data?.success?.includes("No unread messages to mark as read.")) {
      return;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return;
    }
    
    const errorMessage = handleError(error);
    toast.error("Failed to mark messages as read. " + errorMessage);
    throw new Error(errorMessage || "Failed to mark messages as read");
  }
};

/**
 * Process and organize direct messages by user
 * @param messages - Array of Messages objects
 * @returns Record of user IDs to their direct messages
 */
export const organizeDirectMessages = (messages: Messages[]): Record<string, DirectMessage[]> => {
  const directMessagesMap: Record<string, DirectMessage[]> = {};
  
  messages.forEach((message) => {
    message.directMessages.forEach((dm) => {
      // Create a unique key based on senderId and receiverId to group messages
      const userKey = [dm.senderId, dm.receiverId].sort().join("-");
      if (!directMessagesMap[userKey]) {
        directMessagesMap[userKey] = [];
      }
      directMessagesMap[userKey].push(dm);
    });
  });
  
  return directMessagesMap;
};

/////////////////////
export type SendMessage = BaseMessage | DirectMessage;

/**
 * Send a new direct message to a user.
 * @param receiverId - The ID of the receiver.
 * @param content - The message content to send.
 * @param addMessageToState - Function to add the new message to the state.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendDirectMessage = async (
  receiverId: string,
  content: string,
  addMessageToState: (newMessage: SendMessage) => void,
  setNewMessage: Dispatch<SetStateAction<string>>,
  setSendingMessage: Dispatch<SetStateAction<boolean>>
) => {
  if (!content.trim()) return;

  try {
    setSendingMessage(true);

    const user = useUserStore.getState().user;
    const payload = {
      senderId: user?.uid || "",
      receiverId,
      content,
      senderName: user?.username || "Anonymous",
    };

    const response = await api.post(API_CONFIG.ENDPOINTS.MESSAGES.DIRECT, payload);

    const sentMessage: DirectMessage = response.data.message;
    addMessageToState(sentMessage);
    setNewMessage("");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to send message. " + errorMessage);
  } finally {
    setSendingMessage(false);
  }
};
