import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image, Dimensions } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// ----- DASHBOARD -----
function DashboardScreen({ navigation }) {
  const router = useRouter();
  const handleLogout = () => router.replace("/");
  const handleProfile = () => router.push("/user/profile");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const scaleValue = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleValue, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();

  const actions = [
    { title: "🛋️ Browse Services", subtitle: "Explore sessions", bg: styles.cardBg1, route: "/user/services" },
    { title: "📅 My Bookings", subtitle: "Upcoming sessions", bg: styles.cardBg2, route: "/user/bookings" },
    { title: "🤖 AI Assistant", subtitle: "Get help", bg: styles.cardBg3, route: "/user/ai-assistant" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Dashboard</Text>
        <View style={styles.navIcons}>
          <TouchableOpacity onPress={handleProfile} style={styles.iconButton}>
            <MaterialIcons name="person" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <MaterialIcons name="logout" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <Text style={styles.welcomeSubtitle}>Your journey to healing 🌿</Text>
      </Animated.View>

      {/* Horizontal Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {actions.map((action, idx) => (
          <Animated.View key={idx} style={styles.cardWrapper}>
            <TouchableOpacity
              style={[styles.card, action.bg]}
              onPress={() => router.push(action.route)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              activeOpacity={0.9}
            >
              <Image source={require("../../assets/images/splash.png")} style={styles.cardLogo} />
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Upcoming Booking */}
      <Text style={styles.sectionTitle}>Upcoming</Text>
      <View style={styles.upcomingCard}>
        <Text style={styles.bookingTitle}>Cognitive Therapy</Text>
        <Text style={styles.bookingDetail}>📅 10 Mar 2026</Text>
        <Text style={styles.bookingDetail}>⏰ 14:00 - 15:00</Text>
        <Text style={styles.bookingDetail}>👨‍⚕️ Dr. Smith</Text>
      </View>
    </ScrollView>
  );
}

// ----- PLACEHOLDER SCREENS -----
function MyBookingsScreen() { return <View style={styles.screenCenter}><Text>My Bookings Screen</Text></View>; }
function CalendarScreen() { return <View style={styles.screenCenter}><Text>Calendar Screen</Text></View>; }
function MessagingScreen() { return <View style={styles.screenCenter}><Text>Messaging Screen</Text></View>; }

// ----- CUSTOM DRAWER -----
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#002324" }}>
      <DrawerItem label="Dashboard" labelStyle={{ color: "#EBFACF" }} onPress={() => props.navigation.navigate("Dashboard")} />
      <DrawerItem label="My Bookings" labelStyle={{ color: "#EBFACF" }} onPress={() => props.navigation.navigate("MyBookings")} />
      <DrawerItem label="Calendar" labelStyle={{ color: "#EBFACF" }} onPress={() => props.navigation.navigate("Calendar")} />
      <DrawerItem label="Messaging" labelStyle={{ color: "#EBFACF" }} onPress={() => props.navigation.navigate("Messaging")} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function UserDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="MyBookings" component={MyBookingsScreen} />
      <Drawer.Screen name="Calendar" component={CalendarScreen} />
      <Drawer.Screen name="Messaging" component={MessagingScreen} />
    </Drawer.Navigator>
  );
}

// ----- STYLES -----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD", paddingHorizontal: 16 },
  navBar: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navTitle: { fontSize: 20, fontWeight: "bold", color: "#4A4A4A" },
  navIcons: { flexDirection: "row" },
  iconButton: { marginLeft: 16 },

  welcomeTitle: { fontSize: 22, fontWeight: "bold", color: "#4A4A4A", marginTop: 16 },
  welcomeSubtitle: { fontSize: 14, color: "#7C7C7C", marginBottom: 16 },

  horizontalScroll: { marginBottom: 20 },
  cardWrapper: { marginRight: 14, width: width * 0.65 },
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardLogo: {
    position: "absolute",
    top: -15,
    right: -15,
    width: 120,
    height: 120,
    opacity: 0.08,
    resizeMode: "contain",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: "#333" },

  cardBg1: { backgroundColor: "#A8E6CF" },
  cardBg2: { backgroundColor: "#FFD3B6" },
  cardBg3: { backgroundColor: "#FFAAA5" },

  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#4A4A4A", marginBottom: 10 },
  upcomingCard: {
    backgroundColor: "#E0F7FA",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 20,
  },
  bookingTitle: { fontSize: 16, fontWeight: "bold", color: "#4A4A4A", marginBottom: 4 },
  bookingDetail: { fontSize: 12, color: "#555", marginBottom: 2 },
  screenCenter: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FDFDFD" },
});