import React from 'react';
import { Tabs } from 'expo-router';
import { AuthProvider } from '../hooks/useAuth'; // <- fixed path

export default function Layout() {
  return (
    <AuthProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      </Tabs>
    </AuthProvider>
  );
}