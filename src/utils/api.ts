import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
const BASE_URL = API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/conversations");
  return response.data;
};

export const getMessages = async (conversationId: number) => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (conversationId: number, content: string) => {
  const response = await api.post(`/messages/${conversationId}`, { content });
  return response.data;
};

export const updateProfile = async (data: FormData) => {
  const response = await api.put("/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateSettings = async (settings: {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  language: string;
}) => {
  const response = await api.put("/profile/settings", settings);
  return response.data;
};

export const getOnlineUsers = async () => {
  const response = await api.get("/profile/online");
  return response.data;
};

export default api;
