import React, { useEffect, useState } from 'react';

interface DocChatProps {
  category?: string;
  sessionType?: 'normal' | 'stream';
}

export function DocChat({ category, sessionType }: DocChatProps) {
  const {
    messages,
    sendMessage,
    isConnected,
    error,
    clearMessages,
    connectionStatus,
    isLoading,
    wsSessionId,
    clearHistory,
    disconnect,
    forceDisconnect,
  } = useWebSocketChat({
    category,
    sessionType,
    chatType: 'doc',
  });

  // ... existing code ...

  return (
    <div>
      <h1>Doc Chat</h1>
    </div>
  );
}
