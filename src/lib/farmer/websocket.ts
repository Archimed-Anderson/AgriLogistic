/**
 * WebSocket Client for Real-time Updates
 */

type MessageHandler = (data: any) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(channel: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
    }
    this.handlers.get(channel)!.add(handler);

    // Send subscription message
    this.send({
      type: 'subscribe',
      channel,
    });

    // Return unsubscribe function
    return () => {
      const channelHandlers = this.handlers.get(channel);
      if (channelHandlers) {
        channelHandlers.delete(handler);
        if (channelHandlers.size === 0) {
          this.handlers.delete(channel);
          this.send({
            type: 'unsubscribe',
            channel,
          });
        }
      }
    };
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, message not sent:', data);
    }
  }

  private handleMessage(message: any): void {
    const { channel, data } = message;
    const handlers = this.handlers.get(channel);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    wsClient = new WebSocketClient(wsUrl);
  }
  return wsClient;
}

// React Hook for WebSocket
export function useWebSocket(channel: string, handler: MessageHandler) {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const client = getWebSocketClient();
    
    // Connect if not already connected
    if (!client.isConnected()) {
      client.connect()
        .then(() => setIsConnected(true))
        .catch((error) => console.error('WebSocket connection failed:', error));
    } else {
      setIsConnected(true);
    }

    // Subscribe to channel
    const unsubscribe = client.subscribe(channel, handler);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [channel, handler]);

  return { isConnected };
}
