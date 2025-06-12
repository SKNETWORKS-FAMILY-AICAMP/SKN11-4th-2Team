'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketHook {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  lastMessage: string | null;
  reconnect: () => void;
  cleanup: () => void;
}

export function useWebSocket(url: string): WebSocketHook {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket 연결 정리 함수
  const cleanup = useCallback(() => {
    console.log('WebSocket 연결을 정리합니다...');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    setIsConnected(false);
    setLastMessage(null);
  }, []);

  // WebSocket 연결 관리
  const initializeWebSocket = useCallback(() => {
    // 이전 WebSocket 연결이 있다면 정리
    cleanup();

    console.log('새로운 WebSocket 연결을 생성합니다:', url);
    websocketRef.current = new WebSocket(url);

    websocketRef.current.onopen = () => {
      console.log('WebSocket 연결이 성공적으로 열렸습니다.');
      setIsConnected(true);
    };

    websocketRef.current.onclose = (event) => {
      console.log('WebSocket 연결이 닫혔습니다:', event.code, event.reason);
      setIsConnected(false);
      websocketRef.current = null;
    };

    websocketRef.current.onmessage = (event) => {
      console.log('WebSocket 메시지를 수신했습니다:', event.data);
      setLastMessage(event.data);
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket 에러 발생:', error);
      setIsConnected(false);
    };
  }, [url, cleanup]);

  // URL이 변경될 때마다 새로운 연결 생성
  useEffect(() => {
    initializeWebSocket();
    
    return () => {
      cleanup();
    };
  }, [initializeWebSocket]);

  const sendMessage = useCallback((message: string) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket 메시지를 전송합니다:', message);
      websocketRef.current.send(message);
    } else {
      console.warn('WebSocket이 연결되어 있지 않아 메시지를 전송할 수 없습니다.');
    }
  }, []);

  const reconnect = useCallback(() => {
    console.log('WebSocket 재연결을 시도합니다...');
    initializeWebSocket();
  }, [initializeWebSocket]);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    reconnect,
    cleanup,
  };
}
