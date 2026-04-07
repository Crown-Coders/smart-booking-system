import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

type Booking = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  client?: { name?: string };
};

export default function TherapistDashboard() {
  const navigation = useNavigation<any>();
  const { user } = useContext(AuthContext)!;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('TherapistDashboard: loading dashboard for user', user?.id);
      const token = await storage.getItem('token');
      const therapistRes = await fetch(`${API_BASE}/therapists/by-user/${user!.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!therapistRes.ok) throw new Error('Therapist profile not found');
      const therapistData = await therapistRes.json();
      console.log('TherapistDashboard: therapist profile lookup result', therapistData);

      const bookingsRes = await fetch(`${API_BASE}/bookings/therapist/${therapistData.therapistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!bookingsRes.ok) throw new Error('Therapist bookings could not be loaded');
      const data = await bookingsRes.json();
      console.log('TherapistDashboard: loaded bookings', Array.isArray(data) ? data.length : 0);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load therapist dashboard', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = bookings.filter((item) => item.bookingDate >= today && item.status !== 'CANCELLED');
    const history = bookings.filter((item) => item.bookingDate < today || item.status === 'COMPLETED');
    const revenue = bookings
      .filter((item) => ['CONFIRMED', 'COMPLETED', 'confirmed', 'completed'].includes(item.status))
      .reduce((sum, item) => sum + Number(item.price || 0), 0);

    const monthKey = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = bookings
      .filter((item) => item.bookingDate.startsWith(monthKey) && ['CONFIRMED', 'COMPLETED', 'confirmed', 'completed'].includes(item.status))
      .reduce((sum, item) => sum + Number(item.price || 0), 0);

    return { upcoming, history, revenue, monthlyRevenue };
  }, [bookings]);

  if (loading) {
    return (
      <AppShell title="Therapist Dashboard" subtitle="Loading your schedule..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Therapist Dashboard" subtitle="Manage your upcoming sessions and earnings.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome, {user?.name || 'Therapist'}</Text>
        <Text style={styles.subtitle}>Your live booking overview and revenue snapshot.</Text>

        <View style={styles.stats}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('TotalSessions')}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{bookings.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('UpcomingSessions')}>
            <Text style={styles.statLabel}>Upcoming</Text>
            <Text style={styles.statValue}>{summary.upcoming.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('BookingHistory')}>
            <Text style={styles.statLabel}>History</Text>
            <Text style={styles.statValue}>{summary.history.length}</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>R{summary.monthlyRevenue.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Sessions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UpcomingSessions')}>
              <Text style={styles.link}>View all</Text>
            </TouchableOpacity>
          </View>

          {summary.upcoming.length === 0 ? (
            <Text style={styles.empty}>No upcoming sessions scheduled yet.</Text>
          ) : (
            summary.upcoming.slice(0, 3).map((session) => (
              <Card key={session.id} style={styles.sessionCard}>
                <Text style={styles.clientName}>{session.client?.name || 'Unknown Client'}</Text>
                <Text style={styles.meta}>{formatDate(session.bookingDate, 'short')} · {String(session.startTime).slice(0, 5)} - {String(session.endTime).slice(0, 5)}</Text>
                <Text style={styles.meta}>Amount: R{Number(session.price || 0).toFixed(2)}</Text>
                <Text style={styles.status}>Status: {session.status}</Text>
              </Card>
            ))
          )}

          <Button title="Open Upcoming Sessions" onPress={() => navigation.navigate('UpcomingSessions')} variant="outline" style={{ marginTop: 8 }} />
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueTitle}>Lifetime Revenue</Text>
          <Text style={styles.revenueValue}>R{summary.revenue.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 26, fontWeight: '700', color: '#002324' },
  subtitle: { marginTop: 6, marginBottom: 18, color: '#A1AD95' },
  stats: { gap: 12, marginBottom: 18 },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  statLabel: { color: '#A1AD95', textTransform: 'uppercase', fontSize: 12, marginBottom: 6 },
  statValue: { fontSize: 30, fontWeight: '700', color: '#002324' },
  section: { backgroundColor: 'white', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  link: { color: '#002324', fontWeight: '600' },
  sessionCard: { marginBottom: 12 },
  clientName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  meta: { marginTop: 4, color: '#475569' },
  status: { marginTop: 6, color: '#64748B' },
  empty: { color: '#64748B', paddingVertical: 12 },
  revenueCard: { backgroundColor: '#002324', borderRadius: 18, padding: 18, marginBottom: 8 },
  revenueTitle: { color: '#A1AD95', textTransform: 'uppercase', fontSize: 12 },
  revenueValue: { marginTop: 8, color: '#EBFACF', fontSize: 30, fontWeight: '700' },
});
