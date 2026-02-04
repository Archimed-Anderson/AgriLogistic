import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface ChatStore {
  rooms: any[];
  currentRoom: string | null;
  messages: Message[];
  isConnected: boolean;

  setCurrentRoom: (roomId: string) => void;
  addMessage: (message: Message) => void;
  setConnected: (connected: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  rooms: [],
  currentRoom: null,
  messages: [],
  isConnected: false,

  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setConnected: (connected) => set({ isConnected: connected }),
  clearMessages: () => set({ messages: [] }),
}));
