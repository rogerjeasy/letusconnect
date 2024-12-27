import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";
import { Participants } from "@/store/project";

/**
 * Function to leave a group.
 * @param groupChatId 
 * @param token  
 */
export const handleLeaveGroup = async (groupChatId: string, token: string): Promise<void> => {
  try {
    const response = await api.delete(
      `/api/group-chats/${groupChatId}/participants/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(response.data.message || "Left the group successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "An error occurred while leaving the group");
  }
};

/**
 * Function to add participants to a group.
 * @param groupChatId - The ID of the group chat to update participants.
 * @param participants - List of participants to be added.
 * @param token - Authorization token for API requests.
 */
export const handleAddParticipants = async (
    groupChatId: string,
    participants: Participants[],
    token: string
): Promise<void> => {
    try {
        const response = await api.put(
            `/api/group-chats/${groupChatId}/participants`,
            { participants },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || "Participants added successfully");
        } else {
            throw new Error(response.data.error || "Failed to add participants");
        }
    } catch (error) {
        const errorMessage = handleError(error);
        toast.error(errorMessage || "An error occurred while adding participants");
        throw errorMessage;
    }
};

/**
 * Function to remove participants from a group.
 * @param groupChatId - The ID of the group chat to remove participants from.
 * @param participantIds - List of participant IDs to be removed.
 * @param token - Authorization token for API requests.
 */
export const handleRemoveParticipantsFromGroup = async (
    groupChatId: string,
    participantIds: string[],
    token: string
  ): Promise<void> => {
    try {
      const response = await api.post(
        `/api/group-chats/${groupChatId}/remove-participants`,
        { participantIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message || "Participants removed successfully");
      } else {
        throw new Error(response.data.error || "Failed to remove participants");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while removing participants");
      throw errorMessage;
    }
  };
  
  interface UnreadMessagesParams {
    token: string;
    groupChatId?: string;
    projectId?: string;
  }
  
  /**
   * Function to fetch the count of unread messages for a group or project.
   * @param params - Object containing token, groupChatId, and projectId.
   * @returns Promise<number> - The count of unread messages.
   */
  export const handleGetUnreadMessagesGroup = async (
    params: UnreadMessagesParams
  ): Promise<number> => {
    try {
      const { token, groupChatId, projectId } = params;
  
      const queryParams = new URLSearchParams();
      if (groupChatId) queryParams.append("groupChatId", groupChatId);
      if (projectId) queryParams.append("projectId", projectId);
  
      const response = await api.get(`/api/group-chats/unread-messages/count?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status >= 200 && response.status < 300) {
        return response.data.unreadCount;
      } else {
        throw new Error(response.data.error || "Failed to fetch unread messages count");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while fetching unread messages count");
      throw new Error(errorMessage);
    }
  };
  

/**
 * Function to mark messages as read in a specific group chat.
 * @param groupChatId - The ID of the group chat.
 * @param token - Authorization token for API requests.
 */
export const handleMarkMessagesAsRead = async (
    groupChatId: string,
    token: string
  ): Promise<void> => {
    try {
      const response = await api.patch(
        `/api/group-chats/${groupChatId}/mark-messages-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        // toast.success(response.data.message || "Messages marked as read successfully");
      } else {
        throw new Error(response.data.error || "Failed to mark messages as read");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while marking messages as read");
      throw errorMessage;
    }
  };
  