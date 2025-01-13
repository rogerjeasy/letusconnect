"use client";
import { Time } from "@internationalized/date";

export interface ConnectionState {
  count: number;
  loading: boolean;
  error: string | null;
}

export interface ConnectionsResponse {
    pendingRequests: Record<string, ConnectionRequest>;
    sentRequests: Record<string, SentRequest>;
    connections: Record<string, Connection>;
  }
  
export interface ConnectionRequestResponse {
    connections: {
      [uid: string]: {
        acceptedAt: string;
        sentAt: string;
        status: string;
        targetName: string;
        targetUid: string;
      };
    };
    pendingRequests: {
      [uid: string]: {
        fromName: string;
        fromUid: string;
        message: string;
        sentAt: string;
        status: string;
        toUid: string;
      }
    };
    sentRequests: {
      [uid: string]: {
        accepted: Time;
        message: string;
        sentAt: string;
        status: string;
        toUid: string;
      }
    };
  }
  
export interface ConnectionRequest {
    fromUid: string;
    fromName: string;
    toUid: string;
    sentAt: string;
    message: string;
    status: string;  // "pending", "accepted", "rejected"
}

export interface ConnectionActionResponse {
    success: boolean;
    message: string;
    connection?: Connection;
  }
  
export interface SendConnectionRequestResponse {
    success: boolean;
    message: string;
  }

export interface Connection {
    targetUid: string;
    targetName: string;
    sentAt: string;
    acceptedAt: string;
    status: string;  // "active", "blocked", etc.
}



export interface SentRequest {
    toUid: string;
    sentAt: string;
    message: string;
    status: string;  // "pending", "accepted", "rejected"
    accepted: Time;
}

export interface UserConnections {
    id: string;
    uid: string;
    connections: Record<string, Connection>;
    pendingRequests: Record<string, ConnectionRequest>;
    sentRequests: Record<string, SentRequest>;
}

export interface UserConnectionsCount {
    count: number;
}