import { useState, useEffect } from 'react';

// Hook pour la gestion du chat
export function useChat(roomId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (content: string) => {
    // Logique d'envoi de message
    console.log('Sending message:', content);
  };

  const connectToRoom = (id: string) => {
    // Logique de connexion à une salle
    setIsConnected(true);
  };

  const disconnect = () => {
    setIsConnected(false);
  };

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    connectToRoom,
    disconnect,
  };
}
