import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("2026-03-10");

  const bookings = [
    { date: "2026-03-10", title: "Session with John" },
    { date: "2026-03-10", title: "Session with Mary" },
    { date: "2026-03-12", title: "Session with Alex" },
    { date: "2026-03-15", title: "Session with Sarah" },
  ];

  const filteredBookings = bookings.filter((b) => b.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Booking Calendar</Text>
      </View>

      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#002324" },
          "2026-03-10": { marked: true, dotColor: "#EBFACF" },
          "2026-03-12": { marked: true, dotColor: "#EBFACF" },
          "2026-03-15": { marked: true, dotColor: "#EBFACF" },
        }}
        theme={{
          calendarBackground: "#F0F8F5",
          monthTextColor: "#002324",
          dayTextColor: "#002324",
          todayTextColor: "#002324",
          arrowColor: "#002324",
          textDisabledColor: "#ccc",
        }}
      />

      {/* Bookings List */}
      <View style={styles.listContainer}>
        <Text style={styles.dateTitle}>Bookings on {selectedDate}:</Text>
        {filteredBookings.length === 0 ? (
          <Text style={styles.noBooking}>No bookings</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.bookingItem}>
                <Text style={styles.bookingText}>{item.title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F8F5", paddingTop: 40 },
  topBar: { flexDirection: "row", alignItems: "center", width: "95%", marginBottom: 5, alignSelf: "center" },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#000", fontSize: 16, marginLeft: 5 },
  topTitle: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "bold", color: "#002324" },
  listContainer: { flex: 1, marginTop: 10, paddingHorizontal: 15 },
  dateTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#002324" },
  bookingItem: { backgroundColor: "#EBFACF", padding: 15, marginBottom: 10, borderRadius: 10 },
  bookingText: { color: "#002324", fontWeight: "600" },
  noBooking: { color: "#555", fontStyle: "italic" },
});