"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Connection, ConnectionRequest, UserConnections, SentRequest } from "@/store/userConnections";

interface ConnectionsResponse {
  pendingRequests: Record<string, ConnectionRequest>;
  sentRequests: Record<string, SentRequest>;
  connections: Record<string, Connection>;
}

interface ConnectionRequestResponse {
  connectionStatus: string;
}

interface ConnectionActionResponse {
  success: boolean;
  message: string;
  connection?: Connection;
}

interface SendConnectionRequestResponse {
  success: boolean;
  message: string;
}

/**
 * Function to send a connection request to another user.
 * @param toUid - The UID of the user to send the request to
 * @param message - Optional message to include with the request
 * @returns A promise that resolves to the send request response
 */
export const sendConnectionRequest = async (
  toUid: string,
  message: string
): Promise<SendConnectionRequestResponse> => {
  try {
    const response = await api.post<SendConnectionRequestResponse>(
      API_CONFIG.ENDPOINTS.CONNECTIONS.REQUESTS.SEND,
      { toUid, message }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to send connection request");
  }
};

/**
 * Function to fetch all connections for the current user.
 * @returns A promise that resolves to the user's connections, pending requests, and sent requests
 */
export const getUserConnections = async (): Promise<ConnectionsResponse> => {
    try {
        const response = await api.get<ConnectionsResponse>(
          API_CONFIG.ENDPOINTS.CONNECTIONS.BASE
        );
        return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch user connections");
  }
};

/**
 * Function to get connection status between current user and target user
 * @param uid - The UID of the target user
 * @returns A promise that resolves to the connection request response
 */
export const getConnectionRequests = async (uid: string): Promise<ConnectionRequestResponse> => {
  try {
    const response = await api.get<ConnectionRequestResponse>(
      API_CONFIG.ENDPOINTS.CONNECTIONS.REQUESTS.BASE + `/${uid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch connection status");
  }
};

/**
 * Function to accept a connection request.
 * @param fromUID - The UID of the user who sent the request
 * @returns A promise that resolves to the connection action response
 */
export const acceptConnectionRequest = async (fromUID: string): Promise<ConnectionActionResponse> => {
  try {
    const response = await api.put<ConnectionActionResponse>(
      API_CONFIG.ENDPOINTS.CONNECTIONS.REQUESTS.ACCEPT(fromUID)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to accept connection request");
  }
};

/**
 * Function to reject a connection request.
 * @param fromUID - The UID of the user who sent the request
 * @returns A promise that resolves to the connection action response
 */
export const rejectConnectionRequest = async (fromUID: string): Promise<ConnectionActionResponse> => {
  try {
    const response = await api.post<ConnectionActionResponse>(
      API_CONFIG.ENDPOINTS.CONNECTIONS.REQUESTS.REJECT(fromUID)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to reject connection request");
  }
};

/**
 * Function to remove a connection.
 * @param uid - The UID of the connected user to remove
 * @returns A promise that resolves to the connection action response
 */
export const removeConnection = async (uid: string): Promise<ConnectionActionResponse> => {
  try {
    const response = await api.delete<ConnectionActionResponse>(
      API_CONFIG.ENDPOINTS.CONNECTIONS.REMOVE(uid)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || `Failed to remove connection with user: ${uid}`);
  }
};

/**
 * Function to cancel a sent connection request
 * @param toUID - The UID of the user to whom the request was sent
 * @returns A promise that resolves to the connection action response
 */
export const cancelSentRequest = async (toUID: string): Promise<ConnectionActionResponse> => {
    try {
      const response = await api.delete<ConnectionActionResponse>(
        API_CONFIG.ENDPOINTS.CONNECTIONS.REQUESTS.CANCEL(toUID)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to cancel connection request");
    }
  };