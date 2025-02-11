// services/websocket.service.ts
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

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageHandlers: Map<string, Set<(message: any) => void>> = new Map();
  private isConnecting = false;
  private userId: string | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pingTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.messageHandlers = new Map();
    // Bind methods to ensure correct 'this' context
    this.sendMessage = this.sendMessage.bind(this);
    this.sendTyping = this.sendTyping.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.startHeartbeat = this.startHeartbeat.bind(this);
    this.stopHeartbeat = this.stopHeartbeat.bind(this);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
        
        // Set a timeout to check if we receive a pong
        this.pingTimeout = setTimeout(() => {
          console.warn('No pong received, reconnecting...');
          this.handleReconnect();
        }, 5000);
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = null;
    }
  }

  async connect(userId: string): Promise<void> {
    if (!userId) {
      console.error('UserId is required for WebSocket connection');
      return;
    }

    if (this.isConnecting || (this.socket?.readyState === WebSocket.OPEN)) {
      return;
    }

    this.userId = userId;
    this.isConnecting = true;

    try {
      await this.cleanup();

      const socket = new WebSocket(`ws://localhost:8081/ws?userId=${encodeURIComponent(userId)}`);
      this.socket = socket;
      
      this.setupEventHandlers(socket);
      await this.waitForConnection(socket);
      this.startHeartbeat();

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private async cleanup(): Promise<void> {
    this.stopHeartbeat();
    
    const socket = this.socket;
    if (socket) {
      try {
        socket.onclose = null; // Prevent reconnection attempt
        socket.close(1000, 'Cleanup');
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setupEventHandlers(socket: WebSocket): void {
    socket.onopen = () => {
      console.log('WebSocket connected successfully');
      this.reconnectAttempts = 0;
      this.notifyHandlers('user_connected', { userId: this.userId });
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle pong response
        if (data.type === 'pong') {
          if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
            this.pingTimeout = null;
          }
          return;
        }

        const message: WebSocketMessage = data;
        this.notifyHandlers(message.type, message);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    socket.onclose = (event: CloseEvent) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.stopHeartbeat();
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };

    socket.onerror = (event: Event) => {
      const error = event instanceof ErrorEvent ? event.error : new Error('WebSocket error');
      console.error('WebSocket error:', error);
      if (this.reconnectAttempts > 2) {
        toast.error('Connection error. Retrying...');
      }
    };
  }

  private async waitForConnection(socket: WebSocket, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, timeout);

      const handleOpen = () => {
        clearTimeout(timer);
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = (error: Event) => {
        clearTimeout(timer);
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('error', handleError);
        reject(error);
      };

      socket.addEventListener('open', handleOpen);
      socket.addEventListener('error', handleError);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
      this.reconnectAttempts++;
      const delay = this.reconnectTimeout * Math.min(this.reconnectAttempts, 3);
      
      console.log(`Attempting to reconnect in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        if (this.userId) {
          this.connect(this.userId).catch(console.error);
        }
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error('Failed to connect to chat server. Please refresh the page.');
    }
  }

  private notifyHandlers(type: string, message: any): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error in message handler for type ${type}:`, error);
        }
      });
    }
  }

  on(type: string, handler: (message: any) => void): void {
    let handlers = this.messageHandlers.get(type);
    if (!handlers) {
      handlers = new Set();
      this.messageHandlers.set(type, handlers);
    }
    handlers.add(handler);
  }

  off(type: string, handler?: (message: any) => void): void {
    if (handler) {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(type);
        }
      }
    } else {
      this.messageHandlers.delete(type);
    }
  }

  sendMessage(message: any): boolean {
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }

    try {
      const fullMessage = {
        ...message,
        userId: this.userId,
        timestamp: Date.now()
      };
      socket.send(JSON.stringify(fullMessage));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  sendTyping(recipientId: string): boolean {
    return this.sendMessage({
      type: 'typing',
      metadata: { recipientId }
    });
  }

  async disconnect(): Promise<void> {
    await this.cleanup();
    this.userId = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    const socket = this.socket;
    return socket ? socket.readyState === WebSocket.OPEN : false;
  }
}

export const websocketService = new WebSocketService();