"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";

interface ChatMessage {
    id: string;
    chatId: string;
    userId: string;
    message: string;
    response: string;
    createdAt: string;
  }
  
  interface ChatHistoryResponse {
    history: ChatMessage[];
  }
  
  interface ChatResponse {
    success: boolean;
    message: string;
    chatMessage?: ChatMessage;
  }
  
  /**
   * Send Chat Request Response
   */
  interface SendChatRequestResponse {
    response: string;
    chatId?: string;
    success: boolean;
  }
  
/**
 * Function to send a message to the chat endpoint.
 * @param message - The user's message
 * @returns A promise that resolves to the chat response
 */
export const sendChatMessage = async (
    message: string
  ): Promise<SendChatRequestResponse> => {
    try {
      const response = await api.post<SendChatRequestResponse>(
        API_CONFIG.ENDPOINTS.CHATGPT.POST_MESSAGE,
        { message }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to send chat message");
    }
  };
  
  /**
   * Function to fetch the chat history for the current user.
   * @returns A promise that resolves to the chat history response
   */
  export const getChatHistory = async (): Promise<ChatHistoryResponse> => {
    try {
      const response = await api.get<ChatHistoryResponse>(
        API_CONFIG.ENDPOINTS.CHATGPT.GET_HISTORY
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to fetch chat history");
    }
  };
  
  /**
   * Function to delete a specific chat message by ID.
   * @param id - The ID of the chat message to delete
   * @returns A promise that resolves to the chat action response
   */
  export const deleteChatMessage = async (id: string): Promise<ChatResponse> => {
    try {
      const response = await api.delete<ChatResponse>(
        API_CONFIG.ENDPOINTS.CHATGPT.DELETE_HISTORY(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || `Failed to delete chat message with ID: ${id}`);
    }
  };