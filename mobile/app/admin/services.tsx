import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db } from '@/hooks/mock-db';
import { useAuth } from '@/hooks/use-auth';

export default function AdminServices() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    setServices(db.services.slice());
  }, []);

  if (!user || user.role !== 'admin') {
    router.replace('/login');
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Services</ThemedText>
      <Button title="Create Service" onPress={() => router.push('/admin/create-service')} />

      <FlatList
        data={services}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText>{item.title} — {item.duration} mins</ThemedText>
            <ThemedText type="subtitle">Therapist ID: {item.therapistId ?? 'unassigned'}</ThemedText>
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
