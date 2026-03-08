// app/admin/dashboard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Bookings from "./bookings";
import CalendarScreen from "./calendar";
import MessagingScreen from "./messaging"; // UPDATED import
// AI Chatbot
function AIChatbotScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>AI Chatbot</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function DashboardScreen({ navigation }) {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* TOP BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={28} color="#EBFACF" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Admin Dashboard</Text>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <MaterialIcons name="logout" size={28} color="#EBFACF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Welcome back Nqobile</Text>

        {/* STAT CARDS */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <MaterialIcons name="event" size={26} color="#002324" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Upcoming Bookings</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="message" size={26} color="#002324" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Unread Messages</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialIcons name="check-circle" size={26} color="#002324" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
        </View>

        {/* CLICKABLE CARDS */}
        <TouchableOpacity onPress={() => navigation.navigate("Bookings")}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upcoming Bookings</Text>
            <Text style={styles.cardText}>View and manage bookings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Messaging")}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Unread Messages</Text>
            <Text style={styles.cardText}>Check messages from users</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Bookings")}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Sessions</Text>
            <Text style={styles.cardText}>View all completed sessions</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

/* ----------- CUSTOM DRAWER ----------- */
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#002324" }}>
      <TouchableOpacity
        style={{ alignSelf: "flex-end", padding: 15 }}
        onPress={() => props.navigation.closeDrawer()}
      >
        <MaterialIcons name="close" size={28} color="#EBFACF" />
      </TouchableOpacity>

      <DrawerItem
        label="Dashboard"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Dashboard")}
      />
      <DrawerItem
        label="Bookings"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Bookings")}
      />
      <DrawerItem
        label="Calendar"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Calendar")}
      />
      <DrawerItem
        label="Messaging"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Messaging")}
      />
      <DrawerItem
        label="AI Chatbot"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("AIChatbot")}
      />
    </DrawerContentScrollView>
  );
}

/* ----------- DRAWER NAVIGATOR ----------- */
export default function AdminDashboard() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Bookings" component={Bookings} />
      <Drawer.Screen name="Calendar" component={CalendarScreen} />
      <Drawer.Screen name="Messaging" component={MessagingScreen} />
      <Drawer.Screen name="AIChatbot" component={AIChatbotScreen} />
    </Drawer.Navigator>
  );
}

/* ----------- STYLES ----------- */
const styles = StyleSheet.create({
  container: { padding: 20 },
  navBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#002324",
  },
  navTitle: { color: "#EBFACF", fontSize: 20, fontWeight: "bold" },
  welcome: { fontSize: 18, fontWeight: "600", marginBottom: 20, color: "#002324" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  statBox: {
    backgroundColor: "#EBFACF",
    width: "30%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#002324" },
  statLabel: { fontSize: 12, textAlign: "center" },
  card: { backgroundColor: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 20, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#002324" },
  cardText: { fontSize: 14, color: "#4E5E5B" },
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});