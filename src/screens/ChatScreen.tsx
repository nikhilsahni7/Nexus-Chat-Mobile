import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import Button from "../components/Button";
import { getConversations, getMessages, sendMessage } from "../utils/api";
import useStore from "../store/useStore";
import { Conversation, Message, User } from "../types";
import { Alert } from "react-native";

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const {
    user,
    currentConversation,
    messages,
    setCurrentConversation,
    setMessages,
    addMessage,
    logout,
  } = useStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages();
    }
  }, [currentConversation]);

  const fetchConversations = async () => {
    try {
      const fetchedConversations = await getConversations();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async () => {
    if (!currentConversation) return;
    try {
      const fetchedMessages = await getMessages(currentConversation.id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation) return;

    try {
      const newMessage = await sendMessage(currentConversation.id, messageText);
      addMessage(newMessage);
      setMessageText("");
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        currentConversation?.id === item.id && styles.selectedConversation,
      ]}
      onPress={() => setCurrentConversation(item)}
    >
      <Text style={styles.conversationName}>
        {item.isGroup ? item.name : getOtherParticipant(item)?.username}
      </Text>
      {item.lastMessage && (
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage.content}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === user?.id && styles.ownMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  const getOtherParticipant = (
    conversation: Conversation
  ): User | undefined => {
    return conversation.participants.find(
      (participant) => participant.id !== user?.id
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Auth" as never }],
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.conversationList}>
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {currentConversation ? (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            inverted
            style={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <Input
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={handleSendMessage} />
          </View>
        </>
      ) : (
        <View style={styles.noConversation}>
          <Text>Select a conversation to start chatting</Text>
        </View>
      )}
      <View style={styles.navigationButtons}>
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile" as never)}
        />
        <Button
          title="Settings"
          onPress={() => navigation.navigate("Settings" as never)}
        />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  conversationList: {
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  conversationItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 150,
    justifyContent: "center",
  },
  selectedConversation: {
    backgroundColor: "#E3F2FD",
  },
  conversationName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 12,
    color: "#757575",
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: "#E5E5EA",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  ownMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  noConversation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
});

export default ChatScreen;
