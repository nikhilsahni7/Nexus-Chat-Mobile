import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import { login, register } from "../utils/api";
import useStore from "../store/useStore";
import { Alert } from "react-native";

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const setUser = useStore((state) => state.setUser);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const { user, accessToken } = await login(username, password);
        await AsyncStorage.setItem("accessToken", accessToken);
        setUser(user);
        navigation.reset({
          index: 0,
          routes: [{ name: "Chat" as never }],
        });
      } else {
        await register(username, email, password);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Join Us"}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Login to your account" : "Create a new account"}
          </Text>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            icon="person-outline"
          />
          {!isLogin && (
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              icon="mail-outline"
            />
          )}
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            icon="lock-closed-outline"
          />
          <Button title={isLogin ? "Login" : "Register"} onPress={handleAuth} />
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "Need an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  toggleText: {
    marginTop: 24,
    color: "#4c669f",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AuthScreen;
