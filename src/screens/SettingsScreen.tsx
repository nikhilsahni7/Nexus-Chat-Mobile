import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Button from "../components/Button";
import { updateSettings } from "../utils/api";
import useStore from "../store/useStore";

const SettingsScreen: React.FC = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.settings?.notificationsEnabled || false
  );
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    user?.settings?.darkModeEnabled || false
  );
  const [language, setLanguage] = useState(user?.settings?.language || "en");

  const handleSaveSettings = async () => {
    try {
      const updatedSettings = await updateSettings({
        notificationsEnabled,
        darkModeEnabled,
        language,
      });
      setUser({ ...user!, settings: updatedSettings });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Language</Text>
        <Picker
          selectedValue={language}
          style={styles.picker}
          onValueChange={(itemValue) => setLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>
      <Button title="Save Settings" onPress={handleSaveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
  },
  picker: {
    width: 150,
  },
});

export default SettingsScreen;
