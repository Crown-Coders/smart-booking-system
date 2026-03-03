import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Profile</ThemedText>

      <View style={styles.card}>
        <ThemedText>Email: {user?.email}</ThemedText>
        <ThemedText>Name: {user?.name}</ThemedText>
        <ThemedText>Surname: {user?.surname}</ThemedText>
        <ThemedText>ID Number: {user?.idNumber}</ThemedText>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="#FF3B30" onPress={handleLogout} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});