// app/admin/messaging.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Messaging = () => {
  const router = useRouter();
  const flatListRef = useRef(null);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", messages: [{ sender: "User", text: "Hello Admin" }] },
    { id: 2, name: "Jane Smith", messages: [{ sender: "User", text: "Need help with my booking" }] },
  ]);

  const [therapists, setTherapists] = useState([
    { id: 1, name: "Dr. Alex", messages: [{ sender: "Therapist", text: "Session completed" }] },
    { id: 2, name: "Dr. Maria", messages: [{ sender: "Therapist", text: "Schedule next week?" }] },
  ]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = { sender: "Admin", text: messageText };

    if (selectedChat.type === "Therapist") {
      setTherapists((prev) =>
        prev.map((t) =>
          t.id === selectedChat.user.id ? { ...t, messages: [...t.messages, newMessage] } : t
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        user: { ...prev.user, messages: [...prev.user.messages, newMessage] },
      }));
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedChat.user.id ? { ...u, messages: [...u.messages, newMessage] } : u
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        user: { ...prev.user, messages: [...prev.user.messages, newMessage] },
      }));
    }

    setMessageText("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.heading}>Messaging</Text>
          <View style={{ width: 28 }} /> {/* placeholder */}
        </View>

        <View style={styles.container}>
          {/* Left panel: users/therapists */}
          <View style={styles.listPanel}>
            <Text style={styles.subHeading}>Users</Text>
            {users.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={[
                  styles.userButton,
                  selectedChat?.user.id === u.id && selectedChat.type === "User"
                    ? styles.selectedUser
                    : null,
                ]}
                onPress={() => setSelectedChat({ user: u, type: "User" })}
              >
                <Text style={styles.userText}>{u.name}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.subHeading}>Therapists</Text>
            {therapists.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.userButton,
                  selectedChat?.user.id === t.id && selectedChat.type === "Therapist"
                    ? styles.selectedUser
                    : null,
                ]}
                onPress={() => setSelectedChat({ user: t, type: "Therapist" })}
              >
                <Text style={styles.userText}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right panel: chat */}
          <View style={styles.chatPanel}>
            {selectedChat ? (
              <>
                <FlatList
                  ref={flatListRef}
                  data={selectedChat.user.messages}
                  keyExtractor={(item, index) => index.toString()}
                  onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.messageBubble,
                        item.sender === "Admin"
                          ? styles.adminMessage
                          : item.sender === "User"
                          ? styles.userMessage
                          : styles.therapistMessage,
                      ]}
                    >
                      <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                  )}
                />

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message"
                  />
                  <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={{ color: "#fff" }}>Send</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000" }}>Select a user or therapist to start chatting</Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 10 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#000", flex: 1, textAlign: "center" },
  container: { flex: 1, flexDirection: "row", padding: 5 },
  listPanel: { width: "35%", paddingRight: 5 },
  subHeading: { fontSize: 18, fontWeight: "bold", color: "#000", marginTop: 10 },
  userButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginVertical: 5,
  },
  selectedUser: { backgroundColor: "rgba(0,150,136,0.7)" },
  userText: { fontSize: 16, fontWeight: "600", color: "#000" },
  chatPanel: {
    width: "65%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  adminMessage: { backgroundColor: "#00897B", alignSelf: "flex-end" },
  userMessage: { backgroundColor: "#FFAB91", alignSelf: "flex-start" },
  therapistMessage: { backgroundColor: "#90CAF9", alignSelf: "flex-start" },
  messageText: { color: "#000" },
  inputContainer: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#00897B",
    padding: 10,
    borderRadius: 10,
    marginLeft: 5,
    justifyContent: "center",
  },
});

export default Messaging;