import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Booking</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Property List</Text>
        <Text>All your services and listings will show here.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Property</Text>
        <Text>Add new services or bookings here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#E5DDDE' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, color: '#002324' },
  card: { backgroundColor: '#EBFACF', padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
});