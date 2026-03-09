import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ImageBackground
} from "react-native";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import your screens
import BookingsScreen from "./bookings"; // <- bookings.js
import CalendarScreen from "./calendar";
import MessagingScreen from "./messaging";

// --- DASHBOARD SCREEN ---
function DashboardScreen({ navigation }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const moodScale = useRef(new Animated.Value(1)).current;

  const [selectedMood, setSelectedMood] = useState(null);

  // --- CARD PRESS ---
  const pressIn = () => { Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start(); };
  const pressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(); };

  // --- MOOD PRESS ---
  const handleMoodPress = (mood) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.spring(moodScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(moodScale, { toValue: 1, useNativeDriver: true })
    ]).start();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* NAVBAR */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialIcons name="menu" size={28} color="#002324"/>
          </TouchableOpacity>

          <Text style={styles.navTitle}>My Dashboard</Text>

          <View style={styles.navIcons}>
            <TouchableOpacity onPress={() => router.push("/user/profile")}>
              <MaterialIcons name="person" size={24} color="#000"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/")}>
              <MaterialIcons name="logout" size={24} color="#000"/>
            </TouchableOpacity>
          </View>
        </View>

        {/* WELCOME */}
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.subtitle}>Your healing journey continues 🌿</Text>

        {/* CARDS */}
        <View style={styles.cardsWrapper}>

          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <TouchableOpacity
              onPress={() => router.push("/user/services")}
              onPressIn={pressIn}
              onPressOut={pressOut}
            >
              <MaterialIcons name="spa" size={32} color="#2F5D50" />
              <Text style={styles.cardTitle}>Browse Services</Text>
              <Text style={styles.cardText}>Find therapy sessions</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* My Bookings CARD */}
          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <TouchableOpacity
              onPress={() => router.push("/user/bookings")} // <-- Navigate to bookings.js
              onPressIn={pressIn}
              onPressOut={pressOut}
            >
              <MaterialIcons name="event" size={32} color="#2F5D50" />
              <Text style={styles.cardTitle}>My Bookings</Text>
              <Text style={styles.cardText}>Manage your sessions</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <TouchableOpacity
              onPress={() => router.push("/user/ai-assistant")}
              onPressIn={pressIn}
              onPressOut={pressOut}
            >
              <MaterialIcons name="smart-toy" size={32} color="#2F5D50" />
              <Text style={styles.cardTitle}>AI Assistant</Text>
              <Text style={styles.cardText}>Talk to support AI</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <TouchableOpacity
              onPress={() => router.push("/user/booking")}
              onPressIn={pressIn}
              onPressOut={pressOut}
            >
              <MaterialIcons name="add-circle-outline" size={32} color="#2F5D50" />
              <Text style={styles.cardTitle}>Book Session</Text>
              <Text style={styles.cardText}>Schedule a new session</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>

        {/* MOOD TRACKER */}
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodRow}>
          {["happy","okay","sad","angry"].map((mood, i) => (
            <TouchableOpacity key={i} onPress={() => handleMoodPress(mood)}>
              <Animated.Text
                style={[
                  styles.moodEmoji,
                  selectedMood === mood && styles.moodSelected,
                  { transform: [{ scale: selectedMood === mood ? moodScale : 1 }] }
                ]}
              >
                {mood === "happy" ? "😊" : mood === "okay" ? "😐" : mood === "sad" ? "😔" : "😡"}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <Text style={styles.moodMessage}>
            {selectedMood === "happy" ? "Great! Keep the positive energy today 🌿" :
             selectedMood === "okay" ? "Thanks for checking in. Take it one step at a time." :
             selectedMood === "sad" ? "It’s okay to feel this way. Consider talking to someone 💙" :
             "Take a deep breath. Lets slow things down."}
          </Text>
        )}

        {/* UPCOMING SESSION */}
        <Text style={styles.sectionTitle}>Upcoming Session</Text>
        <View style={styles.upcomingCard}>
          <Text style={styles.sessionTitle}>Cognitive Therapy</Text>
          <Text style={styles.sessionInfo}>📅 10 March 2026</Text>
          <Text style={styles.sessionInfo}>⏰ 14:00 - 15:00</Text>
          <Text style={styles.sessionInfo}>👨‍⚕️ Dr. Smith</Text>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

// --- CUSTOM DRAWER ---
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>

      {/* CLOSE DRAWER BUTTON */}
      <TouchableOpacity
        onPress={() => props.navigation.closeDrawer()}
        style={styles.closeButton}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <DrawerItem
        label="Dashboard"
        labelStyle={styles.drawerLabel}
        onPress={() => props.navigation.navigate("Dashboard")}
      />

      <DrawerItem
        label="My Bookings"
        labelStyle={styles.drawerLabel}
        onPress={() => {
          props.navigation.navigate("Bookings"); // <-- Navigate directly to bookings.js
        }}
      />

      <DrawerItem
        label="Calendar"
        labelStyle={styles.drawerLabel}
        onPress={() => props.navigation.navigate("Calendar")}
      />

      <DrawerItem
        label="Messaging"
        labelStyle={styles.drawerLabel}
        onPress={() => props.navigation.navigate("Messaging")}
      />
    </DrawerContentScrollView>
  );
}

// --- DRAWER NAVIGATOR ---
const Drawer = createDrawerNavigator();

export default function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Bookings" component={BookingsScreen} />
      <Drawer.Screen name="Calendar" component={CalendarScreen} />
      <Drawer.Screen name="Messaging" component={MessagingScreen} />
    </Drawer.Navigator>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20 },
  navBar: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navTitle: { fontSize: 20, fontWeight: "700", color: "#002324" },
  navIcons: { flexDirection: "row", gap: 15 },
  welcomeTitle: { fontSize: 26, fontWeight: "700", marginTop: 20, color: "#002324" },
  subtitle: { color: "#3D5A57", marginBottom: 30 },
  cardsWrapper: { gap: 15 },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 22,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginTop: 10, color: "#002324" },
  cardText: { color: "#5E6F6C", fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 30, marginBottom: 10, color: "#002324" },
  upcomingCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5
  },
  sessionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  sessionInfo: { color: "#4E5E5B" },
  moodRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  moodEmoji: { fontSize: 32 },
  moodSelected: { backgroundColor: "#EBFACF", borderRadius: 50, padding: 6 },
  moodMessage: { marginTop: 10, textAlign: "center", color: "#002324", fontWeight: "500" },
  drawer: { backgroundColor: "#002324" },
  drawerLabel: { color: "#EBFACF" },
  closeButton: { alignSelf: "flex-end", margin: 10 },
  closeText: { fontSize: 28, color: "#EBFACF" }
});