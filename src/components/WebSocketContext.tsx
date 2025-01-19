"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from "@/store/useWebSocket";
import { useUserStore } from "@/store/userStore";
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-toastify';
import { DirectMessage } from '@/store/message';
import { Notification, NotificationType } from '@/store/notification';
import { getUnreadMessageCount } from '@/services/message.service';
import { getUnreadNotificationCount } from '@/services/notification.service';
import { getDomain } from '@/helpers/getDomain';

interface WebSocketMessage {
    type: string;
    content: any;
    from: string;
    to?: string;
    time: number;
}

interface WebSocketContextType {
    isConnected: boolean;
    status: 'Connected' | 'Disconnected' | 'Connecting' | 'Error';
    lastPing?: number;
    sendMessage: (type: string, content: any, to?: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { user } = useUserStore();
    const [wsUrl, setWsUrl] = useState<string>('');

    // Initialize WebSocket URL after component mount
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || getDomain();
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = process.env.NEXT_PUBLIC_WS_URL || baseUrl.replace(/^https?:\/\//, '');
        setWsUrl(`${wsProtocol}//${wsHost}${API_CONFIG.VERSION}/ws`);
    }, []);

    const handleChatMessage = async (data: WebSocketMessage) => {
        const { content, from, time, to } = data;
        const message: DirectMessage = {
            id: `${from}-${time}`,
            senderId: from,
            receiverId: to || '',
            content: content.message,
            createdAt: new Date(time * 1000).toISOString(), // Convert to milliseconds
            messageType: content.messageType || 'text',
            attachments: content.attachments || [],
            senderName: content.senderName || '',
            receiverName: content.receiverName || ''
        };

        if (to === user?.uid) {
            await getUnreadMessageCount();
            if (!document.hasFocus()) {
                toast.info(`New message from ${message.senderName || from}`);
            }
        }
    };

    const handleNotification = async (data: WebSocketMessage) => {
        const { content, from, time } = data;
        const notification: Notification = {
            id: `${from}-${time}`,
            userId: content.userId,
            type: content.type as NotificationType,
            title: content.title,
            content: content.message,
            category: content.category || 'general',
            priority: content.priority || 'normal',
            status: 'unread',
            isRead: false,
            isArchived: {},
            isImportant: content.isImportant || false,
            createdAt: new Date(time * 1000).toISOString(), 
            updatedAt: new Date(time * 1000).toISOString(),
            actorId: from,
            actorName: content.actorName,
            metadata: content.metadata
        };

        await getUnreadNotificationCount();
        if (notification.isImportant) {
            toast.info(notification.title);
        }
    };

    const { isConnected, status, lastPing, sendMessage } = useWebSocket(wsUrl, {
        onMessage: (data: WebSocketMessage) => {
            try {
                console.log('Received WebSocket message:', data);
                switch (data.type) {
                    case 'chat':
                        handleChatMessage(data);
                        break;
                    case 'notification':
                        handleNotification(data);
                        break;
                    case 'error':
                        console.error('WebSocket error:', data.content);
                        toast.error('Connection error. Please try again later.');
                        break;
                    default:
                        console.warn('Unhandled message type:', data.type);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
                toast.error('Error processing message');
            }
        },
        onConnect: () => {
            console.log('Connected to WebSocket server');
            toast.success('Connected to chat server');
        },
        onDisconnect: () => {
            console.log('Disconnected from WebSocket server');
            toast.warning('Disconnected from chat server. Attempting to reconnect...');
        },
        reconnectInterval: 5000,
        reconnectAttempts: 5,
        enabled: !!user && !!wsUrl,
    });

    return (
        <WebSocketContext.Provider value={{ isConnected, status, lastPing, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};