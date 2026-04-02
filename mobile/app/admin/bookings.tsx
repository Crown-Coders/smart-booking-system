import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Booking {
  id: string;
  user: string;
  therapist: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Mock data
    const mockBookings: Booking[] = [
      { id: '1', user: 'John Doe', therapist: 'Dr. Sarah Johnson', date: '2024-01-15', time: '10:00 AM', status: 'confirmed', amount: 150 },
      { id: '2', user: 'Jane Smith', therapist: 'Dr. Michael Brown', date: '2024-01-15', time: '2:00 PM', status: 'pending', amount: 150 },
      { id: '3', user: 'Bob Wilson', therapist: 'Dr. Emily Davis', date: '2024-01-16', time: '11:00 AM', status: 'completed', amount: 150 },
    ];
    setBookings(mockBookings);
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#A1AD95';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="All Bookings" showBack />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.activeFilter]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView>
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingId}>#{booking.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>{booking.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.userName}>{booking.user}</Text>
            <Text style={styles.therapistName}>with {booking.therapist}</Text>
            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{booking.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{booking.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>${booking.amount}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  activeFilter: {
    backgroundColor: '#002324',
    borderColor: '#002324',
  },
  filterText: {
    fontSize: 12,
    color: '#A1AD95',
  },
  activeFilterText: {
    color: '#EBFACF',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002324',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002324',
  },
  therapistName: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 12,
  },
  bookingDetails: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#A1AD95',
  },
  actionButtons: {
    marginTop: 12,
  },
  viewBtn: {
    backgroundColor: '#EBFACF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
});