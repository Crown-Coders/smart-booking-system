import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";

// Dummy therapist data
const therapists = [
  {
    id: 1,
    name: "Lerato",
    surname: "Mokoena",
    email: "lerato@example.com",
    phone: "0711234567",
    specialization: "Cognitive Therapy",
    hpcsa: "HPCSA12345",
    bio: "Experienced therapist helping with anxiety and stress.",
    price: 350,
    availability: ["10:00", "11:00", "14:00", "15:00"],
    image: require("../../assets/images/splash.png")
  },
  {
    id: 2,
    name: "Sipho",
    surname: "Nkosi",
    email: "sipho@example.com",
    phone: "0729876543",
    specialization: "Behavioural Therapy",
    hpcsa: "HPCSA67890",
    bio: "Specialist in behavioural therapy for adults.",
    price: 400,
    availability: ["09:00", "13:00", "16:00"],
    image: require("../../assets/images/splash.png")
  }
];

export default function BookingScreen() {
  const router = useRouter();
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleConfirmBooking = () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select therapist, date, and time");
      return;
    }
    Alert.alert(
      "Booking Confirmed",
      `You have booked ${selectedTherapist.name} ${selectedTherapist.surname} on ${selectedDate} at ${selectedTime} for R${selectedTherapist.price}`
    );
    router.push("/user/bookings");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/user/dashboard")}>
          <MaterialIcons name="arrow-back" size={28} color="#002324" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Book a Session</Text>

        {/* Therapist Selection */}
        <Text style={styles.label}>Select Therapist</Text>
        <View style={styles.therapistRow}>
          {therapists.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.card,
                selectedTherapist?.id === t.id && styles.cardSelected
              ]}
              onPress={() => {
                setSelectedTherapist(t);
                setSelectedTime("");
              }}
            >
              <Image source={t.image} style={styles.profilePic} />
              <Text style={styles.cardTitle}>{t.name}</Text>
              <Text style={styles.cardText}>{t.specialization}</Text>
              <Text style={styles.cardText}>R{t.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Therapist Details */}
        {selectedTherapist && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailText}>Name: {selectedTherapist.name} {selectedTherapist.surname}</Text>
            <Text style={styles.detailText}>Email: {selectedTherapist.email}</Text>
            <Text style={styles.detailText}>Phone: {selectedTherapist.phone}</Text>
            <Text style={styles.detailText}>Specialization: {selectedTherapist.specialization}</Text>
            <Text style={styles.detailText}>HPCSA: {selectedTherapist.hpcsa}</Text>
            <Text style={styles.detailText}>Bio: {selectedTherapist.bio}</Text>
          </View>
        )}

        {/* Set Date */}
        <Text style={styles.label}>Select Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          onChangeText={setSelectedDate}
          style={styles.input}
        />

        {/* Set Time */}
        {selectedTherapist && (
          <>
            <Text style={styles.label}>Select Time</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedTime(value)}
              items={selectedTherapist.availability.map((time) => ({ label: time, value: time }))}
              placeholder={{ label: "Select a time", value: null }}
              style={pickerSelectStyles}
              value={selectedTime}
            />
          </>
        )}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { fontSize: 16, marginLeft: 5, color: "#002324", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#002324" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 10, color: "#002324" },
  therapistRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    aspectRatio: 1, // square
    padding: 10,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6
  },
  cardSelected: { borderWidth: 2, borderColor: "#2F5D50" },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#002324" },
  cardText: { fontSize: 14, color: "#4E5E5B" },
  detailsCard: { backgroundColor: "rgba(255,255,255,0.9)", padding: 15, borderRadius: 15, marginTop: 10 },
  detailText: { fontSize: 14, marginBottom: 5, color: "#002324" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, fontSize: 16, color: "#002324" },
  confirmButton: { backgroundColor: "#2F5D50", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 20 },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, color: "#002324" },
  inputAndroid: { fontSize: 16, padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, color: "#002324" }
});