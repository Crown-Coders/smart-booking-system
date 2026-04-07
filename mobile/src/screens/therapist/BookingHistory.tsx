import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';
import { Badge } from '../../components/common/Badge';

type Booking = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  client?: { name?: string };
};

export default function BookingHistory() {
  const { user } = useContext(AuthContext)!;
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const token = await storage.getItem('token');
      console.log('BookingHistory: loading therapist profile for user', user?.id);
      const therapistRes = await fetch(`${API_BASE}/therapists/by-user/${user!.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const therapistData = await therapistRes.json();
      console.log('BookingHistory: therapist profile result', therapistData);
      const response = await fetch(`${API_BASE}/bookings/therapist/${therapistData.therapistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('BookingHistory: therapist bookings loaded', Array.isArray(data) ? data.length : 0);
      const today = new Date().toISOString().split('T')[0];
      setHistoryBookings(
        (Array.isArray(data) ? data : []).filter(
          (item) => item.bookingDate < today || ['CONFIRMED', 'COMPLETED'].includes(item.status),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Booking History" subtitle="Loading past bookings..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Booking History" subtitle="Review previous sessions and their status.">
      <ScrollView showsVerticalScrollIndicator={false}>
        {historyBookings.length === 0 ? (
          <Text style={styles.empty}>No confirmed or past sessions available yet.</Text>
        ) : (
          historyBookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.clientName}>{booking.client?.name || 'Unknown Client'}</Text>
                <Badge variant="secondary">{booking.status}</Badge>
              </View>
              <Text style={styles.meta}>{formatDate(booking.bookingDate, 'short')} · {String(booking.startTime).slice(0, 5)} - {String(booking.endTime).slice(0, 5)}</Text>
              <Text style={styles.meta}>Amount: R{Number(booking.price || 0).toFixed(2)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clientName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  meta: { color: '#475569' },
  empty: { color: '#64748B' },
});
