"use client";
import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";

interface Message {
  id: string;
  createdAt: string;
  message: string;
  response: string;
  role: string;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface SendChatRequestPayload {
  message: string;
  id?: string; // Optional conversation ID for continuing a conversation
}

/**
 * Function to send a message to the chat endpoint.
 * @param message - The user's message
 * @param conversationId - Optional ID of existing conversation
 * @returns A promise that resolves to the conversation containing the message
 */
export const sendChatMessage = async (
  message: string,
  conversationId?: string
): Promise<Conversation> => {
  try {
    const payload: SendChatRequestPayload = {
      message,
      id: conversationId
    };
    
    const response = await api.post<Conversation>(
      API_CONFIG.ENDPOINTS.CHATGPT.POST_MESSAGE,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to send chat message");
  }
};

/**
 * Function to fetch all conversations for the current user.
 * @returns A promise that resolves to an array of conversations
 */
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await api.get<Conversation[]>(
      API_CONFIG.ENDPOINTS.CHATGPT.GET_CONVERSATIONS
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch conversations");
  }
};

/**
 * Function to fetch a specific conversation by ID.
 * @param id - The ID of the conversation to fetch
 * @returns A promise that resolves to the conversation
 */
export const getConversation = async (id: string): Promise<Conversation> => {
  try {
    const response = await api.get<Conversation>(
      API_CONFIG.ENDPOINTS.CHATGPT.GET_CONVERSATION(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || `Failed to fetch conversation with ID: ${id}`);
  }
};

/**
 * Function to delete a specific conversation by ID.
 * @param id - The ID of the conversation to delete
 * @returns A promise that resolves when the conversation is deleted
 */
export const deleteConversation = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      API_CONFIG.ENDPOINTS.CHATGPT.DELETE_CONVERSATION(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || `Failed to delete conversation with ID: ${id}`);
  }
};