"use client";

import { Time } from "@internationalized/date";

export interface Connection {
    targetUid: string;
    targetName: string; 
    sentAt: Time;
    acceptedAt: Time;
    status: string;  // "active", "blocked", etc.
   }
   
   export interface ConnectionRequest {
    fromUid: string;
    fromName: string;
    toUid: string;
    sentAt: Time;
    message: string;
    status: string;  // "pending", "accepted", "rejected"
   }
   
   export interface UserConnections {
    id: string;
    uid: string;
    connections: Record<string, Connection>;
    pendingRequests: Record<string, ConnectionRequest>;
   }