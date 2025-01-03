"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Dispatch, SetStateAction } from "react";
import { DirectMessage, MarkReadRequest, Message, Messages, SendMessageRequest, TypingStatusRequest } from "@/store/message";

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
export const getUnreadMessageCount = async (
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
 * Send a new message
 * @param messageData - Message data including receiver ID and content
 * @returns Promise with the sent message
 */
export const sendMessage = async (messageData: SendMessageRequest): Promise<Message> => {
  try {
    const response = await api.post<Message>(API_CONFIG.ENDPOINTS.MESSAGES.SEND, messageData);
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to send message");
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
 * @param messageIds - Array of message IDs to mark as read
 */
export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
  try {
    const data: MarkReadRequest = { messageIds };
    await api.post(API_CONFIG.ENDPOINTS.MESSAGES.MARK_READ, data);
  } catch (error) {
    const errorMessage = handleError(error);
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