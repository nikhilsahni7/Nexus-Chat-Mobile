import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import { getProfile, updateProfile } from "../utils/api";
import useStore from "../store/useStore";

const ProfileScreen: React.FC = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null
  );
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setUsername(userData.username);
      setEmail(userData.email);
      setBio(userData.bio || "");
      setProfileImage(userData.profileImage);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to fetch profile. Please try again.");
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);

      if (newProfileImage) {
        const uriParts = newProfileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("profileImage", {
          uri: newProfileImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      setProfileImage(updatedUser.profileImage);
      setNewProfileImage(null);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick} disabled={!isEditing}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  newProfileImage ||
                  profileImage ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>{user?.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              icon="person"
            />
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              icon="mail"
            />
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Bio"
              icon="information-circle"
              multiline
            />
            <Button
              title={isLoading ? "Updating..." : "Save Changes"}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setIsEditing(false);
                setNewProfileImage(null);
              }}
              style={styles.cancelButton}
            />
          </>
        ) : (
          <>
            <InfoItem label="Email" value={user?.email || ""} icon="mail" />
            <InfoItem
              label="Bio"
              value={user?.bio || "No bio yet"}
              icon="information-circle"
            />
            <InfoItem
              label="Last Login"
              value={
                user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : "Never"
              }
              icon="time"
            />
            <InfoItem
              label="Login Count"
              value={user?.loginCount?.toString() || "0"}
              icon="log-in"
            />
            <InfoItem
              label="Last Active"
              value={
                user?.lastActiveAt
                  ? new Date(user.lastActiveAt).toLocaleString()
                  : "Never"
              }
              icon="pulse"
            />
            <InfoItem
              label="Account Created"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"
              }
              icon="calendar"
            />
            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const InfoItem: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <View style={styles.infoItem}>
    <Ionicons
      name={icon as any}
      size={24}
      color="#007AFF"
      style={styles.infoIcon}
    />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 20,
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
    marginTop: 10,
  },
});

export default ProfileScreen;
