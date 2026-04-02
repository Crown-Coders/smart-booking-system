import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/shared/BottomNav';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="users" options={{ headerShown: false }} />
        <Stack.Screen name="therapists" options={{ headerShown: false }} />
        <Stack.Screen name="bookings" options={{ headerShown: false }} />
        <Stack.Screen name="reports" options={{ headerShown: false }} />
        <Stack.Screen name="payments" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      <BottomNav userRole={user.role} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});