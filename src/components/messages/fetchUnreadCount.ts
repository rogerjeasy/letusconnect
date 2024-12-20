import { api } from "@/helpers/api";
import { Dispatch, SetStateAction } from "react";

/**
 * Fetch unread message count.
 * @param setUnreadCount - Function to set the total unread count.
 * @param setUnreadCounts - Function to set unread counts per user.
 * @param userId - Optional. If provided, fetches unread count for a specific user.
 */
const fetchUnreadCount = async (
  setUnreadCount?: (count: number) => void,
  setUnreadCounts?: Dispatch<SetStateAction<Record<string, number>>>,
  userId?: string
) => {
  try {
    const url = userId ? `/api/messages/unread?senderId=${userId}` : "/api/messages/unread";
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const unreadCount: number = response.data.unreadCount;

    if (userId && setUnreadCounts) {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [userId]: unreadCount,
      }));
    } else if (setUnreadCount) {
      setUnreadCount(unreadCount);
    }
  } catch (err) {
    console.error("Failed to fetch unread messages count", err);
  }
};

export default fetchUnreadCount;



