// WebSocket Service
import { WSMessage } from '@/types/api';
import { TIMER_CONSTANTS } from '@/utils/constants';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (message: WSMessage) => void> = new Map();
  private connectionHandlers: Map<string, (connected: boolean) => void> = new Map();

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host || 'localhost:3000';
      const wsUrl = `${protocol}//${host}${TIMER_CONSTANTS.API_ENDPOINTS.WEBSOCKET}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.notifyConnectionHandlers(true);
        this.clearReconnectTimeout();
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.notifyConnectionHandlers(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyConnectionHandlers(false);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.notifyConnectionHandlers(false);
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        this.connect();
      }, TIMER_CONSTANTS.INTERVALS.WEBSOCKET_RECONNECT);
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private handleMessage(message: WSMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  // Public API
  onMessage(type: string, handler: (message: WSMessage) => void): () => void {
    this.messageHandlers.set(type, handler);
    
    return () => {
      this.messageHandlers.delete(type);
    };
  }

  onConnectionChange(handler: (connected: boolean) => void): () => void {
    const id = Math.random().toString(36);
    this.connectionHandlers.set(id, handler);
    
    return () => {
      this.connectionHandlers.delete(id);
    };
  }

  sendMessage(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected, cannot send message');
    }
  }

  disconnect(): void {
    this.clearReconnectTimeout();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
