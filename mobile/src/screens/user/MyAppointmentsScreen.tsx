import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { formatDate, formatTimeRange } from '../../utils/date';
import { storage } from '../../utils/storage';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

type Appointment = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  therapistId: number;
  status: string;
  price: number;
  description?: string;
  createdAt: string;
};

type Therapist = {
  id: number;
  user?: { name?: string };
};

export default function MyAppointmentsScreen() {
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Record<number, Therapist>>({});
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    try {
      const token = await storage.getItem('token');
      const userRes = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      const therapistsRes = await fetch(`${API_BASE}/therapists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const therapistsData = await therapistsRes.json();
      const therapistMap: Record<number, Therapist> = {};
      therapistsData.forEach((item: Therapist) => {
        therapistMap[item.id] = item;
      });
      setTherapists(therapistMap);

      const appointmentsRes = await fetch(`${API_BASE}/bookings/user/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appointmentsData = await appointmentsRes.json();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getTherapistName = (id: number) => therapists[id]?.user?.name || `Therapist #${id}`;
  const needsPayment = (status: string) => ['pending_payment', 'PENDING_PAYMENT'].includes(status);
  const canReschedule = (item: Appointment) => {
    if (['COMPLETED', 'CANCELLED', 'completed', 'cancelled'].includes(item.status)) return false;
    const sessionStart = new Date(`${item.bookingDate}T${item.startTime}`);
    return sessionStart.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
  };

  const handlePayment = async () => {
    if (!paymentTarget) return;
    try {
      const response = await fetch(`${API_BASE}/bookings/payfast/${paymentTarget.id}`, { method: 'POST' });
      const { url } = await response.json();
      setPaymentTarget(null);
      Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  if (loading) {
    return (
      <AppShell title="My Appointments" subtitle="Loading your sessions..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="My Appointments" subtitle="Review your booked sessions and complete payment when needed." scrollable={false}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={appointments.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptyText}>When you book a session, it will show up here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{getTherapistName(item.therapistId)}</Text>
              <Badge variant="secondary">{item.status}</Badge>
            </View>
            <Text style={styles.meta}>{formatDate(item.bookingDate, 'short')}</Text>
            <Text style={styles.meta}>{formatTimeRange(item.startTime, item.endTime)}</Text>
            <Text style={styles.meta}>Price: R{item.price}</Text>
            <View style={styles.actions}>
              <Button title="View" onPress={() => setSelectedApt(item)} variant="outline" style={styles.button} />
              {needsPayment(item.status) ? (
                <Button title="Pay" onPress={() => setPaymentTarget(item)} style={styles.button} />
              ) : null}
              {canReschedule(item) ? (
                <Button
                  title="Reschedule"
                  onPress={() => navigation.navigate('Calendar', { therapist: therapists[item.therapistId], appointment: item })}
                  variant="secondary"
                  style={styles.button}
                />
              ) : null}
            </View>
          </View>
        )}
      />

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
                <Text>Price: R{selectedApt.price}</Text>
                {selectedApt.description ? <Text>Reason: {selectedApt.description}</Text> : null}
                <Text style={styles.policyNote}>
                  Rescheduling is only available more than 24 hours before the session. Cancellations and refunds are not allowed.
                </Text>
              </>
            ) : null}
            <Button title="Close" onPress={() => setSelectedApt(null)} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>

      <Modal visible={!!paymentTarget} transparent animationType="fade" onRequestClose={() => setPaymentTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Complete Payment</Text>
            <Text>This will open PayFast so you can finish payment for your session.</Text>
            <View style={styles.modalActions}>
              <Button title="Close" onPress={() => setPaymentTarget(null)} variant="outline" />
              <Button title="Proceed" onPress={handlePayment} />
            </View>
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#002324' },
  emptyText: { marginTop: 8, textAlign: 'center', color: '#64748B' },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', color: '#002324', flex: 1, marginRight: 12 },
  meta: { color: '#475569', marginBottom: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { minWidth: 74 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)', padding: 20 },
  modalCard: { width: '100%', backgroundColor: 'white', borderRadius: 18, padding: 20, gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324', marginBottom: 6 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  policyNote: { marginTop: 10, color: '#8A5A00' },
});
