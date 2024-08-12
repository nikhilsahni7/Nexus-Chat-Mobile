import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  icon?: string;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  icon,
  multiline,
}) => {
  return (
    <View style={styles.inputContainer}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={24}
          color="#007AFF"
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default Input;
