import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db } from '@/hooks/mock-db';
import { useAuth } from '@/hooks/use-auth';

export default function Services() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    setServices(db.services.slice());
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Services</ThemedText>
      <FlatList
        data={services}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText>Duration: {item.duration} mins</ThemedText>
            <View style={{ marginTop: 8 }}>
              {user ? (
                <Button title="Book" onPress={() => router.push(`/book/${item.id}`)} />
              ) : (
                <Link href="/login"><Link.Trigger><ThemedText type="link">Login to book</ThemedText></Link.Trigger></Link>
              )}
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
