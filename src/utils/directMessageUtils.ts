import { api, handleError } from "@/helpers/api";
import { Dispatch, SetStateAction } from "react";
import { DirectMessage } from "@/store/message";
import { BaseMessage } from "@/store/groupChat";
import { useUserStore } from "@/store/userStore";

type Message = BaseMessage | DirectMessage;

/**
 * Send a new direct message to a user.
 * @param receiverId - The ID of the receiver.
 * @param content - The message content to send.
 * @param token - User's authorization token.
 * @param setMessages - Function to update the list of messages.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendDirectMessage = async (
  receiverId: string,
  content: string,
  token: string,
  setMessages: Dispatch<SetStateAction<Message[]>>,
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

    const sentMessage: DirectMessage = response.data.data;
    setMessages((prevMessages) => [...prevMessages, sentMessage]);
    setNewMessage("");
  } catch (error) {
    const errorMessage = handleError(error);
    alert("Failed to send message. " + errorMessage);
  } finally {
    setSendingMessage(false);
  }
};
