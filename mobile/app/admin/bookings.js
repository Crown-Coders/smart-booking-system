import React, { useState, useRef } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Animated, TextInput, Image, ImageBackground 
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const initialBookings = [
  { id: 1, user: "John Doe", therapist: "Dr. Smith", date: "10 Mar", time: "14:00", status: "Confirmed" },
  { id: 2, user: "Sarah Lee", therapist: "Dr. Adams", date: "11 Mar", time: "10:00", status: "Pending" },
  { id: 3, user: "Mike Brown", therapist: "Dr. Smith", date: "12 Mar", time: "16:00", status: "Canceled" }
];

export default function Bookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const animations = useRef(bookings.map(() => new Animated.Value(0))).current;

  const handleStatusUpdate = (status, index) => {
    Animated.sequence([
      Animated.timing(animations[index], { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(animations[index], { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    setBookings(prev =>
      prev.map((b, i) => i === index ? { ...b, status } : b)
    );
    setModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmed": return "#4CAF50";
      case "Pending": return "#FFC107";
      case "Canceled": return "#F44336";
      default: return "#888";
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.user.toLowerCase().includes(search.toLowerCase()) ||
    b.therapist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="#002324" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>

        {/* ---------- SEARCH BAR ---------- */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#002324" />
          <TextInput
            placeholder="Search by user or therapist"
            placeholderTextColor="#444"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {filteredBookings.map((booking, index) => {
            const scale = animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05]
            });

            return (
              <Animated.View key={booking.id} style={{ transform: [{ scale }] }}>
                <LinearGradient
                  colors={["#f0f4f3", "#d9e4db"]} // neutral soft gradient
                  start={[0,0]}
                  end={[1,1]}
                  style={styles.card}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: `https://ui-avatars.com/api/?name=${booking.user.replace(" ", "+")}` }}
                        style={styles.avatar}
                      />
                      <Text style={styles.cardTitle}>{booking.user}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                  </View>
                  <View style={styles.therapistRow}>
                    <Image
                      source={{ uri: `https://ui-avatars.com/api/?name=${booking.therapist.replace(" ", "+")}&background=random` }}
                      style={styles.therapistAvatar}
                    />
                    <Text style={styles.cardText}>Therapist: {booking.therapist}</Text>
                  </View>
                  <Text style={styles.cardText}>Date: {booking.date}</Text>
                  <Text style={styles.cardText}>Time: {booking.time}</Text>

                  <TouchableOpacity 
                    style={styles.updateButton} 
                    onPress={() => { setSelectedBooking({ ...booking, index }); setModalVisible(true); }}
                  >
                    <Text style={styles.updateButtonText}>Update Status</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>

        {selectedBooking && (
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Status</Text>
                {["Confirmed","Pending","Canceled"].map((statusOption) => (
                  <Pressable
                    key={statusOption}
                    style={[styles.modalButton, { backgroundColor: getStatusColor(statusOption) }]}
                    onPress={() => handleStatusUpdate(statusOption, selectedBooking.index)}
                  >
                    <Text style={styles.modalButtonText}>{statusOption}</Text>
                  </Pressable>
                ))}
                <Pressable style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  header: {
    flexDirection:"row",
    alignItems:"center",
    padding:15,
    backgroundColor:"rgba(255,255,255,0.5)",
    borderRadius:10,
    margin:10
  },
  headerTitle: {
    fontSize:20,
    fontWeight:"700",
    color:"#002324",
    marginLeft:10
  },
  searchContainer: {
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"rgba(255,255,255,0.6)",
    borderRadius:15,
    paddingHorizontal:10,
    marginHorizontal:15,
    marginBottom:10
  },
  searchInput: { flex:1, height:40, marginLeft:8, color:"#002324" },
  container: { padding:15, paddingBottom:30 },
  card: { borderRadius:20, padding:20, marginBottom:15, elevation:3 },
  cardHeader: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  avatarContainer: { flexDirection:"row", alignItems:"center" },
  avatar: { width:40, height:40, borderRadius:20, marginRight:10 },
  cardTitle: { fontSize:16, fontWeight:"700", color:"#002324" },
  therapistRow: { flexDirection:"row", alignItems:"center", marginBottom:3 },
  therapistAvatar: { width:30, height:30, borderRadius:15, marginRight:8 },
  cardText: { fontSize:14, color:"#333", marginBottom:3 },
  statusBadge: { paddingVertical:4, paddingHorizontal:10, borderRadius:12 },
  statusText: { color:"#fff", fontWeight:"600", fontSize:12 },
  updateButton: { marginTop:10, backgroundColor:"#002324", padding:8, borderRadius:10, alignItems:"center" },
  updateButtonText: { color:"#EBFACF", fontWeight:"bold" },
  modalOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.4)", justifyContent:"center", alignItems:"center" },
  modalContent: { width:"80%", backgroundColor:"#fff", borderRadius:15, padding:20 },
  modalTitle: { fontSize:18, fontWeight:"700", marginBottom:15, textAlign:"center" },
  modalButton: { padding:10, borderRadius:10, marginVertical:5, alignItems:"center" },
  modalButtonText: { color:"#fff", fontWeight:"700" },
  modalCancel: { marginTop:10, padding:10, alignItems:"center" },
  modalCancelText: { color:"#002324", fontWeight:"700" }
});