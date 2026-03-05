import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: clear token from context/AsyncStorage later
    alert("Logged out!");
    router.push("/"); // back to login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: "center" },
  button: { backgroundColor: "#f44336", padding: 15, borderRadius: 8, width: "60%" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});