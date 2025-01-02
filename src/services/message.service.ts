"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Dispatch, SetStateAction } from "react";

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