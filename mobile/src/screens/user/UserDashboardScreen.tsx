import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { formatDate, formatTimeRange } from '../../utils/date';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

type Appointment = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  therapistId: number;
  status: string;
  notes?: string;
  createdAt: string;
};

type Therapist = {
  id: number;
  user?: { name?: string };
};

export default function UserDashboardScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Record<number, Therapist>>({});
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodOptions = [
    { emoji: '😊', key: 'good', label: 'Good', message: 'You are allowed to enjoy the good moments. Let that steadiness carry into the rest of your day.' },
    { emoji: '😌', key: 'calm', label: 'Calm', message: 'A calm day is progress too. Keep protecting the routines that help you feel grounded.' },
    { emoji: '😔', key: 'low', label: 'Low', message: 'Low days happen. Be gentle with yourself and focus on one small caring step at a time.' },
    { emoji: '😣', key: 'stressed', label: 'Stressed', message: 'You have a lot on your plate. Pause, breathe slowly, and take the next task one step at a time.' },
    { emoji: '🤍', key: 'hopeful', label: 'Hopeful', message: 'Hope counts. Even small signs of forward movement are worth noticing and keeping.' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await storage.getItem('token');
      const userRes = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const therapistRes = await fetch(`${API_BASE}/therapists`);
      const therapistData = await therapistRes.json();
      const therapistMap: Record<number, Therapist> = {};
      therapistData.forEach((therapist: Therapist) => {
        therapistMap[therapist.id] = therapist;
      });
      setTherapists(therapistMap);

      const bookingsRes = await fetch(`${API_BASE}/bookings/user/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookings = await bookingsRes.json();
      setAppointments(Array.isArray(bookings) ? bookings : []);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const getTherapistName = (id: number) => therapists[id]?.user?.name || `Therapist #${id}`;

  const today = new Date().toISOString().split('T')[0];
  const stats = {
    upcoming: appointments.filter((item) => item.bookingDate >= today && item.status !== 'CANCELLED').length,
    total: appointments.length,
    paid: appointments.filter((item) => ['CONFIRMED', 'COMPLETED', 'confirmed', 'completed'].includes(item.status)).length,
  };

  if (loading) {
    return (
      <AppShell title="Dashboard" subtitle="Loading your latest activity..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" subtitle="Track your wellness journey in one place.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome back, {user?.name || user?.email}</Text>
        <Text style={styles.subtitle}>Your next session and care history are right here.</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Upcoming</Text>
            <Text style={styles.statValue}>{stats.upcoming}</Text>
            <Text style={styles.statSub}>Sessions on your calendar</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statSub}>All your bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Paid</Text>
            <Text style={styles.statValue}>{stats.paid}</Text>
            <Text style={styles.statSub}>Confirmed or completed</Text>
          </View>
        </View>

        <View style={styles.moodCard}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <Text style={styles.moodSubtitle}>Choose the emoji that matches your mood right now.</Text>
          <View style={styles.moodRow}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.key}
                style={[styles.moodButton, selectedMood === mood.key && styles.moodButtonActive]}
                onPress={() => setSelectedMood(mood.key)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedMood ? (
            <View style={styles.moodMessageCard}>
              <Text style={styles.moodMessage}>
                {moodOptions.find((mood) => mood.key === selectedMood)?.message}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Appointments</Text>
            {appointments.length > 0 ? (
              <TouchableOpacity onPress={() => navigation.navigate('MyAppointments')}>
                <Text style={styles.link}>See all</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {appointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No appointments yet</Text>
              <Text style={styles.emptyText}>Browse services and book your first session in a few taps.</Text>
              <Button title="Book Your First Session" onPress={() => navigation.navigate('Services')} style={{ marginTop: 14 }} />
            </View>
          ) : (
            appointments.slice(0, 4).map((appointment) => (
              <TouchableOpacity key={appointment.id} style={styles.appointmentCard} onPress={() => setSelectedApt(appointment)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.therapistName}>{getTherapistName(appointment.therapistId)}</Text>
                  <Badge variant="secondary">{appointment.status}</Badge>
                </View>
                <Text style={styles.appointmentMeta}>
                  {formatDate(appointment.bookingDate, 'short')} · {formatTimeRange(appointment.startTime, appointment.endTime)}
                </Text>
                {appointment.notes ? <Text style={styles.note}>Note: {appointment.notes}</Text> : null}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to book another session?</Text>
          <Text style={styles.ctaText}>Explore therapists by service and jump straight into a booking slot.</Text>
          <Button title="Browse Services" onPress={() => navigation.navigate('Services')} style={{ marginTop: 14 }} />
        </View>

        <Modal visible={!!selectedApt} transparent animationType="fade" onRequestClose={() => setSelectedApt(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              {selectedApt ? (
                <>
                  <Text>Therapist: {getTherapistName(selectedApt.therapistId)}</Text>
                  <Text>Date: {formatDate(selectedApt.bookingDate, 'long')}</Text>
                  <Text>Time: {formatTimeRange(selectedApt.startTime, selectedApt.endTime)}</Text>
                  <Text>Status: {selectedApt.status}</Text>
                  {selectedApt.notes ? <Text>Note: {selectedApt.notes}</Text> : null}
                </>
              ) : null}
              <Button title="Close" onPress={() => setSelectedApt(null)} style={{ marginTop: 16 }} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 26, fontWeight: '700', color: '#002324' },
  subtitle: { marginTop: 6, marginBottom: 18, fontSize: 14, color: '#A1AD95' },
  statsGrid: { gap: 12, marginBottom: 18 },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  statLabel: { fontSize: 12, color: '#A1AD95', textTransform: 'uppercase', marginBottom: 6 },
  statValue: { fontSize: 30, fontWeight: '700', color: '#002324' },
  statSub: { marginTop: 4, fontSize: 12, color: '#A1AD95' },
  moodCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    marginBottom: 18,
  },
  moodSubtitle: { marginTop: 6, marginBottom: 14, color: '#64748B' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moodButton: {
    minWidth: '30%',
    backgroundColor: '#FAF9F7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    alignItems: 'center',
  },
  moodButtonActive: {
    backgroundColor: '#EBFACF',
    borderColor: '#A1AD95',
  },
  moodEmoji: { fontSize: 28, marginBottom: 6 },
  moodLabel: { color: '#002324', fontWeight: '600', fontSize: 12 },
  moodMessageCard: {
    marginTop: 14,
    backgroundColor: '#EBFACF',
    borderRadius: 16,
    padding: 14,
  },
  moodMessage: { color: '#002324', lineHeight: 20 },
  section: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    marginBottom: 18,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  link: { color: '#002324', fontWeight: '600' },
  appointmentCard: {
    backgroundColor: '#FAF9F7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  therapistName: { fontSize: 15, fontWeight: '700', color: '#002324', flex: 1, marginRight: 12 },
  appointmentMeta: { fontSize: 13, color: '#475569' },
  note: { marginTop: 6, fontSize: 12, color: '#64748B' },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  emptyText: { marginTop: 8, fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  ctaCard: {
    backgroundColor: '#002324',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  ctaTitle: { fontSize: 20, fontWeight: '700', color: '#EBFACF' },
  ctaText: { marginTop: 8, fontSize: 13, color: '#A1AD95', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: 'white', borderRadius: 18, padding: 20, gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324', marginBottom: 6 },
});
