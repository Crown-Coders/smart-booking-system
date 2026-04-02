import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/shared/BottomNav';

export default function UserLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="book-session" options={{ headerShown: false }} />
        <Stack.Screen name="my-bookings" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="services" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="payment-history" options={{ headerShown: false }} />
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