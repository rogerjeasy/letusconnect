import { api, fileApi, handleError } from "@/helpers/api";
import { toast } from "react-toastify";

/**
 * Function to update the pinned messages state.
 * @param groupChatId - The ID of the group chat.
 * @param messageId - The ID of the message.
 * @param isUnpin - Optional flag indicating whether the message is being unpinned.
 */
type UpdatePinnedMessages = (
    groupChatId: string,
    messageId: string,
    isUnpin?: boolean
  ) => void;
  

/**
 * Function to pin a message.
 * @param groupChatId - The ID of the group chat.
 * @param messageId - The ID of the message to pin.
 * @param token - The user authorization token.
 * @param updatePinnedMessages - Callback to update the pinned messages state.
 */
export const handlePinMessage = async (
    groupChatId: string,
    messageId: string,
    token: string,
    updatePinnedMessages: UpdatePinnedMessages
  ): Promise<void> => {
    try {
      const payload = { groupChatId, messageId };
  
      const response = await api.post(`/api/group-chats/pin-message`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      updatePinnedMessages(groupChatId, messageId); // Update pinned messages state
      toast.success(response.data.message || "Message pinned successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "An error occurred while pinning the message");
    }
  };
  
  /**
   * Function to unpin a message.
   * @param groupChatId - The ID of the group chat.
   * @param messageId - The ID of the message to unpin.
   * @param token - The user authorization token.
   * @param updatePinnedMessages - Callback to update the pinned messages state.
   */
  export const handleUnPinMessage = async (
    groupChatId: string,
    messageId: string,
    token: string,
    updatePinnedMessages: UpdatePinnedMessages
  ): Promise<void> => {
    try {
      const payload = { groupChatId, messageId };
  
      const response = await api.post(`/api/group-chats/unpin-message`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      updatePinnedMessages(groupChatId, messageId, true); // Update pinned messages state with unpin flag
      toast.success(response.data.message || "Message unpinned successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "An error occurred while unpinning the message");
    }
  };
  

/**
 * Function to reply to a message.
 * @param messageId - The ID of the message to reply to.
 * @param replyContent - The content of the reply.
 * @param token - The user authorization token.
 */
export const handleReplyToMessage = async (
  messageId: string,
  replyContent: string,
  token: string
): Promise<void> => {
  try {
    const payload = { messageId, replyContent };

    const response = await api.post(`/group-chats/reply-message`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success(response.data.message || "Reply sent successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error(errorMessage || "An error occurred while replying to the message");
  }
};

/**
 * Function to copy a message content to the clipboard.
 * @param messageContent - The content of the message to copy.
 */
export const handleCopyMessage = (messageContent: string): void => {
  try {
    navigator.clipboard.writeText(messageContent);
    toast.success("Message copied to clipboard");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error(errorMessage || "Failed to copy the message");
  }
};

/**
 * Function to handle adding documents.
 * @param files - The files to upload.
 * @param groupChatId - The ID of the group chat.
 * @param token - The user authorization token.
 */
export const handleAddDocuments = async (
    files: File[],
    groupChatId: string,
    content: string,
    token: string
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("groupChatId", groupChatId);
      formData.append("content", content);
      files.forEach((file) => formData.append("files", file)); // Updated field name to match the server
  
      const response = await fileApi.post(`/api/group-chats/attach-files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success(response.data.message || "Documents added successfully");
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while adding documents");
    }
  };
  