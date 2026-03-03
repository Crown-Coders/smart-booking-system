import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

type TherapyService = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Dummy data
  const [services, setServices] = useState<TherapyService[]>([
    { id: '1', name: 'Massage Therapy', description: 'Relax your muscles', price: 200 },
    { id: '2', name: 'Cognitive Therapy', description: 'Improve mental clarity', price: 250 },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', service: 'Massage Therapy', date: '2026-03-03', time: '10:00', amount: 200, paymentMethod: 'Card', status: 'Pending' },
  ]);

  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Handlers
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleAddService = () => {
    if (!newServiceName || !newServiceDesc || !newServicePrice) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newService: TherapyService = {
      id: Date.now().toString(),
      name: newServiceName,
      description: newServiceDesc,
      price: parseFloat(newServicePrice),
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    Alert.alert('Success', 'Service added!');
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(bookings.map(b => (b.id === bookingId ? { ...b, status } : b)));
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText type="title">Admin Dashboard</ThemedText>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText>Welcome, {user?.email}</ThemedText>

      {/* ADD NEW SERVICE */}
      <View style={styles.card}>
        <ThemedText type="subtitle">Add New Therapy Service</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Service Name"
          value={newServiceName}
          onChangeText={setNewServiceName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newServiceDesc}
          onChangeText={setNewServiceDesc}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={newServicePrice}
          onChangeText={setNewServicePrice}
        />
        <Button title="Add Service" onPress={handleAddService} />
      </View>

      {/* EXISTING SERVICES */}
      <View style={{ marginTop: 16 }}>
        <ThemedText type="subtitle">Existing Services</ThemedText>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Price: R{item.price}</Text>
            </View>
          )}
        />
      </View>

      {/* BOOKINGS */}
      <View style={{ marginTop: 16 }}>
        <ThemedText type="subtitle">Bookings</ThemedText>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.service} - {item.date} {item.time}</Text>
              <Text>Amount: R{item.amount} - Payment: {item.paymentMethod}</Text>
              <Text>Status: {item.status}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                <Button title="Pending" onPress={() => updateBookingStatus(item.id, 'Pending')} />
                <Button title="Confirmed" onPress={() => updateBookingStatus(item.id, 'Confirmed')} />
                <Button title="Completed" onPress={() => updateBookingStatus(item.id, 'Completed')} />
              </View>
            </View>
          )}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  serviceName: { fontWeight: 'bold', fontSize: 16 },
});