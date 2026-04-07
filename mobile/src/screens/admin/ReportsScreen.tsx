import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { Card } from '../../components/common/Card';

export default function ReportsScreen() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [bookingActivity, setBookingActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = await storage.getItem('token');
      const [usersRes, therapistsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/therapists`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const users = await usersRes.json();
      const therapists = await therapistsRes.json();
      const bookings = await bookingsRes.json();
      const safeBookings = Array.isArray(bookings) ? bookings : [];

      setStats({
        totalUsers: users.length || 0,
        totalTherapists: therapists.length || 0,
        totalBookings: safeBookings.length || 0,
        pendingBookings: safeBookings.filter((item: any) => ['pending', 'pending_payment', 'PENDING'].includes(item.status)).length,
        confirmedBookings: safeBookings.filter((item: any) => ['confirmed', 'completed', 'CONFIRMED'].includes(item.status)).length,
      });
      setBookingActivity(safeBookings);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Reports" subtitle="Loading platform metrics..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Reports" subtitle="High-level user, therapist, and booking statistics.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Users</Text>
          <Text style={styles.stat}>Total Users: {stats.totalUsers}</Text>
          <Text style={styles.stat}>Total Therapists: {stats.totalTherapists}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Bookings</Text>
          <Text style={styles.stat}>Total Bookings: {stats.totalBookings}</Text>
          <Text style={styles.stat}>Pending: {stats.pendingBookings}</Text>
          <Text style={styles.stat}>Confirmed or Completed: {stats.confirmedBookings}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Booking Activity</Text>
          {bookingActivity.length === 0 ? (
            <Text style={styles.stat}>No booking activity available yet.</Text>
          ) : (
            bookingActivity.slice(0, 8).map((booking) => (
              <View key={booking.id} style={styles.activityRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{booking.client?.name || 'Client'}</Text>
                  <Text style={styles.activityMeta}>
                    {booking.bookingDate} | {String(booking.startTime).slice(0, 5)} - {String(booking.endTime).slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityAmount}>R{Number(booking.price || 0).toFixed(2)}</Text>
                  <Text style={styles.activityStatus}>{booking.status}</Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#002324', marginBottom: 12 },
  stat: { color: '#475569', marginBottom: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5DDDE' },
  activityTitle: { fontSize: 15, fontWeight: '700', color: '#002324' },
  activityMeta: { marginTop: 4, color: '#64748B' },
  activityRight: { alignItems: 'flex-end' },
  activityAmount: { fontWeight: '700', color: '#002324' },
  activityStatus: { marginTop: 4, color: '#64748B', fontSize: 12 },
});
