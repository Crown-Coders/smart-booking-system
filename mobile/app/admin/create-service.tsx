import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db, generateId } from '@/hooks/mock-db';
import { useAuth } from '@/hooks/use-auth';

export default function CreateService() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');
  const [therapistId, setTherapistId] = useState('');

  if (!user || user.role !== 'admin') {
    router.replace('/login');
    return null;
  }

  function handleCreate() {
    if (!title) return Alert.alert('Validation', 'Title required');
    const service = { id: generateId(), title, duration: Number(duration), therapistId: therapistId || null };
    db.services.push(service);
    router.replace('/admin/services');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Service</ThemedText>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Duration (mins)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Therapist ID (optional)" value={therapistId} onChangeText={setTherapistId} />
      <View style={{ marginTop: 8 }}><Button title="Create" onPress={handleCreate} /></View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
