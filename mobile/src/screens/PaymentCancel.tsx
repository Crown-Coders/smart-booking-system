// src/screens/PaymentCancel.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button } from '../components/common/Button';

export default function PaymentCancel() {
  const route = useRoute();
  const { bookingId } = route.params as { bookingId?: string };
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Cancelled</Text>
      <Text style={styles.message}>
        Try again for booking #{bookingId || 'unknown'}.
      </Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#002324' },
  message: { fontSize: 16, marginBottom: 24, color: '#A1AD95' },
});