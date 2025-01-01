"use client";

import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";
import { Connection, ConnectionRequest } from "@/store/userConnections";

interface Connections {
  connections: Record<string, Connection>;
  pendingRequests: Record<string, ConnectionRequest>;
}

export const handleGetConnections = async (token: string): Promise<Connections | null> => {
  try {
    const response = await api.get("/api/connections", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    toast.error(handleError(error) || "Failed to fetch connections");
    return null;
  }
};

export const handleSendConnectionRequest = async (
  toUid: string,
  message: string,
  token: string
): Promise<boolean> => {
  try {
    const response = await api.post("/api/connections/requests", { toUid, message }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success(response.data.message || "Connection request sent");
    return true;
  } catch (error) {
    toast.error(handleError(error) || "Failed to send request");
    return false;
  }
};

export const handleAcceptRequest = async (
  fromUID: string, 
  token: string
): Promise<boolean> => {
  try {
    const response = await api.put(`/api/connections/requests/${fromUID}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success(response.data.message || "Connection request accepted");
    return true;
  } catch (error) {
    toast.error(handleError(error) || "Failed to accept request");
    return false;
  }
};

export const handleRejectRequest = async (
  fromUID: string,
  token: string
): Promise<boolean> => {
  try {
    await api.put(`/api/connections/requests/${fromUID}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Connection request rejected");
    return true;
  } catch (error) {
    toast.error(handleError(error) || "Failed to reject request");
    return false;
  }
};

export const handleRemoveConnection = async (
  uid: string,
  token: string
): Promise<boolean> => {
  try {
    await api.delete(`/api/connections/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Connection removed");
    return true;
  } catch (error) {
    toast.error(handleError(error) || "Failed to remove connection");
    return false;
  }
};