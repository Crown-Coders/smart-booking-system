import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface BookingRequest {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function TherapistBookings() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Mock data
    const mockBookings: BookingRequest[] = [
      { id: '1', patient: 'John Doe', date: '2024-01-25', time: '10:00 AM', type: 'Therapy Session', message: 'First time patient', status: 'pending' },
      { id: '2', patient: 'Jane Smith', date: '2024-01-26', time: '2:00 PM', type: 'Follow-up', message: 'Follow up on previous session', status: 'pending' },
    ];
    setBookings(mockBookings);
  };

  const handleBookingAction = (bookingId: string, action: 'accept' | 'reject') => {
    Alert.alert('Confirm', `${action} this booking?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: action.toUpperCase(), onPress: () => {
        setBookings(bookings.filter(b => b.id !== bookingId));
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Booking Requests" showBack />
      <ScrollView>
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <View style={styles.bookingHeader}>
              <Text style={styles.patientName}>{booking.patient}</Text>
              <Text style={styles.bookingType}>{booking.type}</Text>
            </View>
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
            {booking.message && (
              <View style={styles.messageSection}>
                <Text style={styles.messageLabel}>Message:</Text>
                <Text style={styles.messageText}>{booking.message}</Text>
              </View>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleBookingAction(booking.id, 'accept')}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleBookingAction(booking.id, 'reject')}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
                <Text style={styles.rejectButtonText}>Reject</Text>
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
  bookingHeader: {
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  bookingType: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 2,
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
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
  messageSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A1AD95',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#002324',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});