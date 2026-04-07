import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';

type Session = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  notes?: string;
  client?: { name?: string };
};

export default function UpcomingSessions() {
  const { user } = useContext(AuthContext)!;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
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
      const today = new Date().toISOString().split('T')[0];
      const upcoming = (Array.isArray(data) ? data : []).filter((item) => item.bookingDate >= today);
      setSessions(upcoming);
      setSelected(upcoming[0] || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Upcoming Sessions" subtitle="Loading your calendar..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Upcoming Sessions" subtitle="Review your next booked clients and times.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Session List</Text>
          {sessions.length === 0 ? (
            <Text style={styles.empty}>No upcoming sessions scheduled.</Text>
          ) : (
            sessions.map((session) => (
              <TouchableOpacity key={session.id} style={styles.card} onPress={() => setSelected(session)}>
                <Text style={styles.clientName}>{session.client?.name || 'Unknown Client'}</Text>
              <Text style={styles.meta}>{formatDate(session.bookingDate, 'short')} · {String(session.startTime).slice(0, 5)} - {String(session.endTime).slice(0, 5)}</Text>
              <Text style={styles.status}>Status: {session.status}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Session Details</Text>
          {selected ? (
            <View style={styles.details}>
              <Text>Client: {selected.client?.name || 'Unknown Client'}</Text>
              <Text>Date: {formatDate(selected.bookingDate, 'long')}</Text>
              <Text>Time: {String(selected.startTime).slice(0, 5)} - {String(selected.endTime).slice(0, 5)}</Text>
              <Text>Amount: R{Number(selected.price || 0).toFixed(2)}</Text>
              <Text>Status: {selected.status}</Text>
              {selected.notes ? <Text>Notes: {selected.notes}</Text> : null}
            </View>
          ) : (
            <Text style={styles.empty}>Select a session above to view details.</Text>
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: 'white', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 16 },
  panelTitle: { fontSize: 18, fontWeight: '700', color: '#002324', marginBottom: 12 },
  card: { backgroundColor: '#FAF9F7', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 10 },
  clientName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  meta: { marginTop: 4, color: '#475569' },
  status: { marginTop: 4, color: '#64748B' },
  details: { gap: 8 },
  empty: { color: '#64748B' },
});
