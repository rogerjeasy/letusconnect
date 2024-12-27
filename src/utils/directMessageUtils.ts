import { api, handleError } from "@/helpers/api";
import { Dispatch, SetStateAction } from "react";
import { DirectMessage } from "@/store/message";
import { BaseMessage } from "@/store/groupChat";
import { useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";

type Message = BaseMessage | DirectMessage;

/**
 * Send a new direct message to a user.
 * @param receiverId - The ID of the receiver.
 * @param content - The message content to send.
 * @param token - User's authorization token.
 * @param addMessageToState - Function to add the new message to the state.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendDirectMessage = async (
  receiverId: string,
  content: string,
  token: string,
  addMessageToState: (newMessage: Message) => void,
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

    const response = await api.post("/api/messages/direct", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
