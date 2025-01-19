import { useEffect, useRef, useState, useCallback } from 'react';
import { useUserStore } from './userStore';

interface WebSocketOptions {
    onMessage?: (data: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
    reconnectInterval?: number;
    reconnectAttempts?: number;
    enabled?: boolean;
}

interface WebSocketStatus {
    isConnected: boolean;
    status: 'Connected' | 'Disconnected' | 'Connecting' | 'Error';
    lastPing?: number;
}

export const useWebSocket = (baseUrl: string, options: WebSocketOptions = {}) => {
    const {
        onMessage,
        onConnect,
        onDisconnect,
        onError,
        reconnectInterval = 3000,
        reconnectAttempts = Infinity,
        enabled = true,
    } = options;

    const [wsStatus, setWsStatus] = useState<WebSocketStatus>({
        isConnected: false,
        status: 'Disconnected'
    });
    const ws = useRef<WebSocket | null>(null);
    const reconnectCount = useRef(0);
    const reconnectTimeoutId = useRef<NodeJS.Timeout | null>(null);
    const pingIntervalId = useRef<NodeJS.Timeout | null>(null);

    const startPingInterval = useCallback(() => {
        if (pingIntervalId.current) {
            clearInterval(pingIntervalId.current);
        }

        pingIntervalId.current = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                try {
                    ws.current.send(JSON.stringify({
                        type: 'ping',
                        content: { timestamp: Date.now() },
                        from: useUserStore.getState().user?.uid,
                        time: Math.floor(Date.now() / 1000)
                    }));
                } catch (error) {
                    console.error('Error sending ping:', error);
                }
            }
        }, 30000); // Ping every 30 seconds

        return () => {
            if (pingIntervalId.current) {
                clearInterval(pingIntervalId.current);
            }
        };
    }, []);

    const connect = useCallback(async () => {
        if (!enabled || !baseUrl || reconnectCount.current >= reconnectAttempts) {
            setWsStatus({
                isConnected: false,
                status: 'Disconnected',
                lastPing: undefined
            });
            return;
        }
        
        if (ws.current?.readyState === WebSocket.CONNECTING) {
            return; // Already connecting
        }
    
        if (ws.current?.readyState === WebSocket.OPEN) {
            setWsStatus({
                isConnected: true,
                status: 'Connected',
                lastPing: Date.now()
            });
            return;
        }

        setWsStatus(prev => ({ ...prev, status: 'Connecting' }));
    
        try {
            const token = useUserStore.getState().token;
            if (!token) {
                throw new Error('No authentication token available');
            }
    
            const wsUrl = `${baseUrl}?token=${token}`;
            console.log(`Connecting to WebSocket at ${wsUrl}`);
            
            if (ws.current) {
                ws.current.close(1000, 'Reconnecting');
            }
    
            ws.current = new WebSocket(wsUrl);
    
            ws.current.addEventListener('open', () => {
                console.log('WebSocket connection established');
                setWsStatus({
                    isConnected: true,
                    status: 'Connected',
                    lastPing: Date.now()
                });
                reconnectCount.current = 0;
                startPingInterval();
                onConnect?.();
            });
    
            ws.current.addEventListener('close', (event) => {
                console.log(`WebSocket closed: ${event.code}`, {
                    wasClean: event.wasClean,
                    reason: event.reason
                });
                
                setWsStatus({
                    isConnected: false,
                    status: 'Disconnected',
                    lastPing: undefined
                });
                
                if (pingIntervalId.current) {
                    clearInterval(pingIntervalId.current);
                }

                onDisconnect?.();
    
                if (enabled && reconnectCount.current < reconnectAttempts) {
                    const backoffTime = Math.min(1000 * Math.pow(2, reconnectCount.current), 30000);
                    console.log(`Scheduling reconnection in ${backoffTime}ms`);
                    
                    reconnectTimeoutId.current = setTimeout(() => {
                        reconnectCount.current += 1;
                        console.log(`Reconnecting... Attempt ${reconnectCount.current}`);
                        connect();
                    }, backoffTime);
                }
            });
    
            ws.current.addEventListener('error', (event) => {
                console.error('WebSocket Error:', event);
                setWsStatus(prev => ({ ...prev, status: 'Error' }));
                onError?.(event);
            });
    
            ws.current.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'pong') {
                        setWsStatus(prev => ({ ...prev, lastPing: Date.now() }));
                    } else {
                        onMessage?.(data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });
    
        } catch (error) {
            console.error('WebSocket connection error:', error);
            setWsStatus({
                isConnected: false,
                status: 'Error',
                lastPing: undefined
            });

            if (enabled && reconnectCount.current < reconnectAttempts) {
                const backoffTime = Math.min(1000 * Math.pow(2, reconnectCount.current), 30000);
                console.log(`Scheduling reconnection after error in ${backoffTime}ms`);
                
                reconnectTimeoutId.current = setTimeout(() => {
                    reconnectCount.current += 1;
                    connect();
                }, backoffTime);
            }
        }
    }, [baseUrl, enabled, reconnectAttempts]);

    const sendMessage = useCallback((type: string, content: any, to?: string) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket is not open. Message not sent.');
            return;
        }

        try {
            const message = {
                type,
                content,
                to,
                from: useUserStore.getState().user?.uid,
                time: Math.floor(Date.now() / 1000),
            };
            ws.current.send(JSON.stringify(message));
            console.log('Message sent:', message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, []);

    useEffect(() => {
        if (enabled && baseUrl) {
            connect();
        }

        return () => {
            if (reconnectTimeoutId.current) {
                clearTimeout(reconnectTimeoutId.current);
            }
            if (pingIntervalId.current) {
                clearInterval(pingIntervalId.current);
            }
            if (ws.current) {
                ws.current.close(1000, 'Component unmounted');
            }
        };
    }, [connect, enabled, baseUrl]);

    return {
        isConnected: wsStatus.isConnected,
        status: wsStatus.status,
        lastPing: wsStatus.lastPing,
        sendMessage
    };
};