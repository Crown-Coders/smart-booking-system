import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/hooks/mock-db';

export default function TherapistBookings() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user) setBookings(db.bookings.filter((b: any) => b.therapistId === user.id));
  }, [user]);

  if (!user || user.role !== 'therapist') {
    router.replace('/login');
    return null;
  }

  function updateStatus(id: string, status: string) {
    const b = db.bookings.find((x: any) => x.id === id);
    if (b) b.status = status;
    setBookings(db.bookings.filter((b: any) => b.therapistId === user.id));
    Alert.alert('Updated', `Booking ${status}`);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Bookings</ThemedText>
      <FlatList
        data={bookings}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText type="defaultSemiBold">{item.serviceTitle}</ThemedText>
            <ThemedText>{new Date(item.time).toLocaleString()}</ThemedText>
            <ThemedText>Status: {item.status}</ThemedText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button title="Approve" onPress={() => updateStatus(item.id, 'approved')} />
              <Button title="Decline" onPress={() => updateStatus(item.id, 'declined')} />
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  item: { padding: 12, borderWidth: 1, borderRadius: 8, marginTop: 8 },
});
