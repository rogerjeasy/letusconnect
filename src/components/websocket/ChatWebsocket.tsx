"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocketContext } from "../WebSocketContext";
import { useUserStore } from '@/store/userStore';
import { DirectMessage } from '@/store/message';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

interface ChatProps {
    receiverId?: string;
    receiverName?: string;
}

const Chat: React.FC<ChatProps> = ({ receiverId, receiverName }) => {
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { isConnected, status, lastPing, sendMessage } = useWebSocketContext();
    const { user } = useUserStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const queryClient = useQueryClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle typing status with debounce
    const handleTyping = useCallback(() => {
        if (!isTyping) {
            setIsTyping(true);
            sendMessage('user_status', {
                status: 'typing',
                receiverId,
                isTyping: true
            });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendMessage('user_status', {
                status: 'typing',
                receiverId,
                isTyping: false
            });
        }, 2000);
    }, [isTyping, receiverId, sendMessage]);


    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !user || !receiverId) return;

        try {
            const messageContent = inputMessage.trim();
            sendMessage('chat', {
                message: messageContent,
                messageType: 'text',
                receiverId: receiverId,
                senderName: user.username || user.email
            });

            setMessages(prev => [...prev, {
                id: `temp-${Date.now()}`,
                senderId: user.uid,
                receiverId: receiverId,
                content: messageContent,
                createdAt: new Date().toISOString(),
                messageType: 'text',
                attachments: [],
                senderName: user.username || user.email || 'Unknown',
                receiverName: receiverName || 'Unknown'
            }]);

            setInputMessage('');
            setIsTyping(false);
            queryClient.invalidateQueries({
                queryKey: ['messages', receiverId]
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [inputMessage, user, receiverId, receiverName, sendMessage, queryClient]);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
            {/* Connection Status */}
            <div 
                className={cn(
                    "px-4 py-2 text-center text-sm transition-colors duration-200",
                    {
                        'bg-green-500/10 text-green-500': status === 'Connected',
                        'bg-yellow-500/10 text-yellow-500': status === 'Connecting',
                        'bg-red-500/10 text-red-500': status === 'Disconnected' || status === 'Error'
                    }
                )}
            >
                <span className="font-medium">{status}</span>
                {lastPing && (
                    <span className="text-xs ml-2 opacity-75">
                        Last ping: {new Date(lastPing).toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={cn(
                                "max-w-[70%] rounded-lg p-3 space-y-1",
                                message.senderId === user?.uid
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {message.senderId !== user?.uid && (
                                <p className="text-xs font-medium opacity-75">
                                    {message.senderName}
                                </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-75">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => {
                            setInputMessage(e.target.value);
                            handleTyping();
                        }}
                        placeholder={status === 'Connected' ? "Type a message..." : "Reconnecting..."}
                        className={cn(
                            "flex-1 px-3 py-2 bg-muted text-muted-foreground rounded-md",
                            "border border-input focus:outline-none focus:ring-2 focus:ring-ring",
                            "disabled:opacity-50 transition-colors duration-200"
                        )}
                        disabled={status !== 'Connected' || !receiverId}
                    />
                    <button
                        type="submit"
                        disabled={status !== 'Connected' || !inputMessage.trim() || !receiverId}
                        className={cn(
                            "px-4 py-2 bg-primary text-primary-foreground rounded-md",
                            "hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
                        )}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;