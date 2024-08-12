import { sendMessage } from "./../utils/api";
export interface User {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  bio: string | null;
  presenceStatus: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";
  lastLoginAt: string | null;
  lastLoginIP: string | null;
  totalLoginTime: number;
  loginCount: number;
  lastActiveAt: string | null;
  createdAt: string;
  settings: {
    notificationsEnabled: boolean;
    darkModeEnabled: boolean;
    language: string;
  };
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  contentType: "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO";
  timestamp: string;
}

export interface Conversation {
  id: number;
  name?: string;
  isGroup: boolean;
  lastMessage?: Message;
  participants: User[];
}
