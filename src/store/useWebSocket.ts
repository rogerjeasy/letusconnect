// hooks/useWebSocket.ts
import { useEffect, useCallback, useRef, useState } from 'react';
import { websocketService } from '@/services/websocket.service';
import { DirectMessage } from '@/store/message';
import { BaseMessage } from '@/store/groupChat';
import { toast } from 'react-toastify';

export type WebSocketMessageType =
  | 'chat_message'
  | 'user_connected'
  | 'user_disconnected'
  | 'typing'
  | 'read_receipt'
  | 'message_edited'
  | 'message_deleted';

interface WebSocketMessage {
  type: WebSocketMessageType;
  userId: string;
  content?: any;
  metadata?: {
    recipientId?: string;
    groupId?: string;
  };
  timestamp: number;
}

interface UseWebSocketProps {
  userId: string;
  onNewMessage?: (message: DirectMessage | BaseMessage) => void;
  onUserConnected?: (userId: string) => void;
  onUserDisconnected?: (userId: string) => void;
  onTyping?: (userId: string) => void;
  onReadReceipt?: (messageId: string, userId: string) => void;
  onMessageEdited?: (messageId: string, newContent: string) => void;
  onMessageDeleted?: (messageId: string) => void;
}

export const useWebSocket = ({
  userId,
  onNewMessage,
  onUserConnected,
  onUserDisconnected,
  onTyping,
  onReadReceipt,
  onMessageEdited,
  onMessageDeleted
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const handlersRef = useRef<Array<() => void>>([]);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);

  const setupMessageHandlers = useCallback(() => {
    const handlers: Array<[WebSocketMessageType, (message: WebSocketMessage) => void]> = [];

    // Chat message handler
    if (onNewMessage) {
      const handler = (message: WebSocketMessage) => {
        if (!message.content) return;
        
        try {
          if (message.metadata?.groupId) {
            onNewMessage(message.content as BaseMessage);
          } else {
            onNewMessage(message.content as DirectMessage);
          }
        } catch (error) {
          console.error('Error processing new message:', error);
        }
      };
      websocketService.on('chat_message', handler);
      handlers.push(['chat_message', handler]);
    }

    // Connection status handlers
    if (onUserConnected) {
      const handler = (message: WebSocketMessage) => {
        onUserConnected(message.userId);
        setIsConnected(true);
      };
      websocketService.on('user_connected', handler);
      handlers.push(['user_connected', handler]);
    }

    if (onUserDisconnected) {
      const handler = (message: WebSocketMessage) => {
        onUserDisconnected(message.userId);
        setIsConnected(false);
      };
      websocketService.on('user_disconnected', handler);
      handlers.push(['user_disconnected', handler]);
    }

    // Typing indicator handler
    if (onTyping) {
      const handler = (message: WebSocketMessage) => {
        if (message.metadata?.recipientId === userId) {
          onTyping(message.userId);
        }
      };
      websocketService.on('typing', handler);
      handlers.push(['typing', handler]);
    }

    // Read receipt handler
    if (onReadReceipt) {
      const handler = (message: WebSocketMessage) => {
        if (message.content?.messageId && message.userId) {
          onReadReceipt(message.content.messageId, message.userId);
        }
      };
      websocketService.on('read_receipt', handler);
      handlers.push(['read_receipt', handler]);
    }

    // Message edited handler
    if (onMessageEdited) {
      const handler = (message: WebSocketMessage) => {
        if (message.content?.messageId && message.content?.newContent) {
          onMessageEdited(message.content.messageId, message.content.newContent);
        }
      };
      websocketService.on('message_edited', handler);
      handlers.push(['message_edited', handler]);
    }

    // Message deleted handler
    if (onMessageDeleted) {
      const handler = (message: WebSocketMessage) => {
        if (message.content?.messageId) {
          onMessageDeleted(message.content.messageId);
        }
      };
      websocketService.on('message_deleted', handler);
      handlers.push(['message_deleted', handler]);
    }

    // Store cleanup functions
    handlersRef.current = handlers.map(([type, handler]) => 
      () => websocketService.off(type, handler)
    );
  }, [userId, onNewMessage, onUserConnected, onUserDisconnected, onTyping, 
      onReadReceipt, onMessageEdited, onMessageDeleted]);

  const processMessageQueue = useCallback(() => {
    while (messageQueueRef.current.length > 0 && isConnected) {
      const message = messageQueueRef.current.shift();
      if (message) {
        websocketService.sendMessage(message);
      }
    }
  }, [isConnected]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (!isConnected) {
      messageQueueRef.current.push(message);
      return false;
    }
    return websocketService.sendMessage(message);
  }, [isConnected]);

  const sendTyping = useCallback((recipientId: string) => {
    if (!isConnected) return false;
    return websocketService.sendTyping(recipientId);
  }, [isConnected]);

  useEffect(() => {
    const connect = async () => {
      if (!userId) return;

      try {
        await websocketService.connect(userId);
        setIsConnected(true);
        setupMessageHandlers();
        processMessageQueue();
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        
        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        // Set up reconnection
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      handlersRef.current.forEach(cleanup => cleanup());
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [userId, setupMessageHandlers, processMessageQueue]);

  return {
    sendMessage,
    sendTyping,
    isConnected
  };
};