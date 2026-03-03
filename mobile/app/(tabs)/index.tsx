import React, { useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // Defer redirect to next tick so navigation is ready (prevents "navigate before mounting" error)
    const id = setTimeout(() => {
      if (user) router.replace('/dashboard');
      else router.replace('/login');
    }, 0);
    return () => clearTimeout(id);
  }, [user]);

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  actions: { marginTop: 12, gap: 8 },
});
