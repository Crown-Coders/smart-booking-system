// src/screens/PaymentSuccess.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/common/Button';

export default function PaymentSuccess() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>Your booking has been confirmed.</Text>
      <Button title="OK" onPress={() => navigation.navigate('Dashboard' as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#002324' },
  message: { fontSize: 16, marginBottom: 24, color: '#A1AD95' },
});