import { api } from "@/helpers/api";
import { Dispatch, SetStateAction } from "react";
import { BaseMessage, GroupChat } from "@/store/groupChat";
import { Participants } from "@/store/project";
import { handleError } from "@/helpers/api";

/**
 * Send a new message to a group chat.
 * @param groupChatId - The ID of the group chat.
 * @param content - The message content to send.
 * @param token - User's authorization token.
 * @param setMessages - Function to update the list of messages.
 * @param setNewMessage - Function to clear the message input.
 * @param setSendingMessage - Function to indicate message-sending state.
 */
export const sendMessageToGroup = async (
  groupChatId: string,
  content: string,
  token: string,
  setMessages: Dispatch<SetStateAction<BaseMessage[]>>,
  setNewMessage: Dispatch<SetStateAction<string>>,
  setSendingMessage: Dispatch<SetStateAction<boolean>>
) => {
  if (!content.trim()) return;

  try {
    setSendingMessage(true);
    const payload = { groupChatId, content };

    const response = await api.post(`/api/group-chats/messages`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sentMessage: BaseMessage = response.data.data;
    setMessages((prevMessages) => [...prevMessages, sentMessage]);
    setNewMessage("");
  } catch (error) {
    const errorMessage = handleError(error);
    alert("Failed to send message. " + errorMessage);
  } finally {
    setSendingMessage(false);
  }
};

/**
 * Fetch details of a specific group chat.
 * @param groupId - The ID of the group chat to fetch.
 * @param token - User's authorization token.
 * @param setGroupChatId - Function to set the group chat ID.
 * @param setMessages - Function to set the list of messages.
 * @param setParticipants - Function to set the list of participants.
 * @param setGroupName - Function to set the group chat name.
 * @param setLoadingMessages - Function to indicate loading state for messages.
 */
export const fetchGroupChatDetails = async (
    groupId: string,
    token: string,
    setGroupChatId: Dispatch<SetStateAction<string>>,
    setMessages: Dispatch<SetStateAction<BaseMessage[]>>,
    setParticipants: Dispatch<SetStateAction<Participants[]>>,
    setGroupName: Dispatch<SetStateAction<string>>,
    setLoadingMessages: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      setLoadingMessages(true);
  
      const response = await api.get(`/api/group-chats/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const groupChat: GroupChat = response.data.data;
  
      setGroupChatId(groupChat.id);
      setMessages(groupChat.messages || []);
      setParticipants(
        groupChat.participants.sort((a, b) =>
          a.role === "owner" && b.role !== "owner" ? -1 : 1
        )
      );
      setGroupName(groupChat.name);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Failed to fetch group chat details:", errorMessage);
      alert("Failed to fetch group chat details. " + errorMessage);
    } finally {
      setLoadingMessages(false);
    }
  };