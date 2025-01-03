"use client";
import { Time } from "@internationalized/date";

export interface Connection {
    targetUid: string;
    targetName: string;
    sentAt: string;
    acceptedAt: string;
    status: string;  // "active", "blocked", etc.
}

export interface ConnectionRequest {
    fromUid: string;
    fromName: string;
    toUid: string;
    sentAt: string;
    message: string;
    status: string;  // "pending", "accepted", "rejected"
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