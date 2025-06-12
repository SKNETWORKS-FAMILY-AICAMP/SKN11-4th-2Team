import { useEffect, useRef, useState } from 'react';

interface WebSocketHook {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  lastMessage: string | null;
}

export const useWebSocket = (url: string | null): WebSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) {
      setIsConnected(false);
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket 연결됨');
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket 연결 끊김');
    };

    ws.current.onmessage = (event) => {
      setLastMessage(event.data);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return { isConnected, sendMessage, lastMessage };
}; 