import { create } from "zustand";
import { User, Conversation, Message } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  user: User | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  setUser: (user: User | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  logout: () => Promise<void>;
}

const useStore = create<AppState>((set) => ({
  user: null,
  conversations: [],
  currentConversation: null,
  messages: [],
  setUser: (user) => set({ user }),
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  logout: async () => {
    await AsyncStorage.removeItem("accessToken");
    set({
      user: null,
      conversations: [],
      currentConversation: null,
      messages: [],
    });
  },
}));

export default useStore;
