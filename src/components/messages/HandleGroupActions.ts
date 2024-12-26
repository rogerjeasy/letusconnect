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