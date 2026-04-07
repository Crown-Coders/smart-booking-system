import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';
import { Badge } from '../../components/common/Badge';

type Session = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  client?: { name?: string };
};

export default function TotalSessions() {
  const { user } = useContext(AuthContext)!;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const token = await storage.getItem('token');
      const therapistRes = await fetch(`${API_BASE}/therapists/by-user/${user!.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const therapistData = await therapistRes.json();
      const response = await fetch(`${API_BASE}/bookings/therapist/${therapistData.therapistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSessions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Total Sessions" subtitle="Loading session history..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Total Sessions" subtitle="All sessions across your therapist account.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Sessions Loaded</Text>
          <Text style={styles.summaryValue}>{sessions.length}</Text>
        </View>

        {sessions.length === 0 ? (
          <Text style={styles.empty}>No sessions found.</Text>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.card}>
              <Text style={styles.clientName}>{session.client?.name || 'Unknown Client'}</Text>
              <Text style={styles.meta}>{formatDate(session.bookingDate, 'short')} · {String(session.startTime).slice(0, 5)} - {String(session.endTime).slice(0, 5)}</Text>
              <Text style={styles.meta}>Amount: R{Number(session.price || 0).toFixed(2)}</Text>
              <Badge variant="default">{session.status}</Badge>
            </View>
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  summaryCard: { backgroundColor: '#002324', borderRadius: 18, padding: 18, marginBottom: 16 },
  summaryLabel: { color: '#A1AD95', textTransform: 'uppercase', fontSize: 12 },
  summaryValue: { marginTop: 6, color: '#EBFACF', fontSize: 32, fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 12 },
  clientName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  meta: { marginTop: 4, marginBottom: 8, color: '#475569' },
  empty: { color: '#64748B' },
});
