import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Booking {
  id: string;
  therapist: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Mock data
    const mockBookings: Booking[] = [
      { id: '1', therapist: 'Dr. Sarah Johnson', date: '2024-01-20', time: '10:00 AM', status: 'upcoming', type: 'Therapy Session' },
      { id: '2', therapist: 'Dr. Michael Brown', date: '2024-01-15', time: '2:00 PM', status: 'completed', type: 'Follow-up' },
      { id: '3', therapist: 'Dr. Emily Davis', date: '2024-01-10', time: '11:00 AM', status: 'completed', type: 'Initial Consultation' },
    ];
    setBookings(mockBookings);
  };

  const cancelBooking = (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => console.log('Cancel booking', bookingId) },
    ]);
  };

  const filteredBookings = bookings.filter(b => activeTab === 'upcoming' ? b.status === 'upcoming' : b.status !== 'upcoming');

  return (
    <View style={styles.container}>
      <Header title="My Bookings" showBack />
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'past' && styles.activeTab]} onPress={() => setActiveTab('past')}>
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <View style={styles.bookingHeader}>
              <Text style={styles.therapistName}>{booking.therapist}</Text>
              <View style={[styles.statusBadge, { backgroundColor: booking.status === 'upcoming' ? '#4CAF5020' : '#9E9E9E20' }]}>
                <Text style={[styles.statusText, { color: booking.status === 'upcoming' ? '#4CAF50' : '#9E9E9E' }]}>
                  {booking.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.bookingType}>{booking.type}</Text>
            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{booking.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{booking.time}</Text>
              </View>
            </View>
            {booking.status === 'upcoming' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.rescheduleBtn}>
                  <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelBooking(booking.id)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            {booking.status === 'completed' && (
              <TouchableOpacity style={styles.rebookBtn}>
                <Text style={styles.rebookBtnText}>Book Again</Text>
              </TouchableOpacity>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#002324',
  },
  tabText: {
    fontSize: 14,
    color: '#A1AD95',
  },
  activeTabText: {
    color: '#EBFACF',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  therapistName: {
    fontSize: 18,
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
  bookingType: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 12,
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#A1AD95',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#002324',
    alignItems: 'center',
  },
  rescheduleBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
  cancelBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rebookBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#002324',
    alignItems: 'center',
  },
  rebookBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EBFACF',
  },
});