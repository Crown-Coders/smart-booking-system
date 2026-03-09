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
import Users from "./users";
import Therapists from "./therapists";
import Reports from "./reports";
import Settings from "./settings";
import AIChatbot from "./aichatbot";

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

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate("Bookings")}
          >
            <MaterialIcons name="event" size={26} color="#002324" />
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate("Bookings")}
          >
            <MaterialIcons name="schedule" size={26} color="#002324" />
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate("Bookings")}
          >
            <MaterialIcons name="check-circle" size={26} color="#002324" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate("Bookings")}
          >
            <MaterialIcons name="event-available" size={26} color="#002324" />
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Available Slots</Text>
          </TouchableOpacity>

        </View>
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
        label="Users"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Users")}
      />

      <DrawerItem
        label="Therapists"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Therapists")}
      />

      <DrawerItem
        label="Reports"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Reports")}
      />

      <DrawerItem
        label="System Settings"
        labelStyle={{ color: "#EBFACF" }}
        onPress={() => props.navigation.navigate("Settings")}
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
      <Drawer.Screen name="Users" component={Users} />
      <Drawer.Screen name="Therapists" component={Therapists} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="AIChatbot" component={AIChatbot} />
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

  navTitle: {
    color: "#EBFACF",
    fontSize: 20,
    fontWeight: "bold",
  },

  welcome: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#002324",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statBox: {
    backgroundColor: "#EBFACF",
    width: "48%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002324",
  },

  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});