// WebSocket Hook (Simplified)
import { useState, useEffect } from 'react';
import { websocketService } from '@/services/websocketService';
import { WSMessage } from '@/types/api';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);

  useEffect(() => {
    const unsubscribeConnection = websocketService.onConnectionChange(setIsConnected);
    
    return () => {
      unsubscribeConnection();
    };
  }, []);

  const sendMessage = (message: WSMessage) => {
    websocketService.sendMessage(message);
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};
