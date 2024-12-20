import { api, handleError } from "@/helpers/api";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

/**
 * Marks messages as read for a specific user.
 * @param userId - The ID of the user whose messages are to be marked as read.
 * @param updateUnreadCounts - Function to update unread counts.
 */
const handleMessagesClick = async (
  userId: string | undefined,
  updateUnreadCounts: (count: number) => void | Dispatch<SetStateAction<Record<string, number>>>
) => {
  try {
    await api.post(
      "/api/messages/mark-as-read",
      { senderId: userId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // Reset the unread count based on the passed function type
    if (typeof updateUnreadCounts === "function") {
      updateUnreadCounts(0);
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.response && error.response.status === 404) {
      console.warn("No conversation found or no unread messages to mark as read.");
      if (typeof updateUnreadCounts === "function") {
        updateUnreadCounts(0);
      }
    } else {
      const errorMessage = handleError(err);
      console.error("Failed to mark messages as read", errorMessage);
    }
  }
};

export default handleMessagesClick;
