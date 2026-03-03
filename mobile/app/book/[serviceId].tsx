import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db, generateId } from '@/hooks/mock-db';
import { useAuth } from '@/hooks/use-auth';

export default function BookService() {
  const params = useLocalSearchParams();
  const { serviceId } = params as { serviceId: string };
  const { user } = useAuth();
  const router = useRouter();
  const [time, setTime] = useState('');

  const service = db.services.find((s: any) => s.id === serviceId);
  if (!service) return <ThemedView style={{ flex: 1, padding: 16 }}><ThemedText>Service not found</ThemedText></ThemedView>;

  if (!user) {
    router.replace('/login');
    return null;
  }

  function handleBook() {
    // rudimentary validation: check for double booking for same therapist and exact same time
    const t = new Date(time).toISOString();
    if (isNaN(new Date(time).getTime())) return Alert.alert('Invalid time', 'Enter valid datetime string');
    const conflict = db.bookings.find((b: any) => b.therapistId === service.therapistId && b.time === t && b.status !== 'declined');
    if (conflict) return Alert.alert('Double booking', 'Selected timeslot is not available');

    const booking = { id: generateId(), serviceId: service.id, serviceTitle: service.title, userId: user.id, therapistId: service.therapistId, time: t, status: 'pending' };
    db.bookings.push(booking);
    Alert.alert('Booked', 'Your booking is pending approval');
    router.replace('/dashboard');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Book: {service.title}</ThemedText>
      <ThemedText>Duration: {service.duration} mins</ThemedText>
      <TextInput style={styles.input} placeholder="Enter datetime (e.g. 2026-03-03T10:00:00)" value={time} onChangeText={setTime} />
      <View style={{ marginTop: 8 }}><Button title="Book" onPress={handleBook} /></View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
