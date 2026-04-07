import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { API_BASE } from '../../utils/api';

type Therapist = {
  id: string;
  name: string;
  surname: string;
  specialty: string;
  typeOfPractice: string;
  yearsOfExperience: number;
  hpcsaNumber: string;
  image: string;
};

type Booking = {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  price?: number;
  client?: { name?: string; email?: string };
};

const getFallbackImage = (id: string | number) => `https://i.pravatar.cc/150?u=therapist-${id}`;

export default function AdminDashboard() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null);
  const [newTherapist, setNewTherapist] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    specialty: '',
    yearsOfExperience: '',
    licenseNumber: '',
    typeOfPractice: '',
    bio: '',
    image: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('AdminDashboard: loading dashboard data');
      const [therapistsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/therapists`),
        fetch(`${API_BASE}/bookings`),
      ]);

      const therapistsData = await therapistsRes.json();
      const bookingsData = await bookingsRes.json();

      const formattedTherapists = (Array.isArray(therapistsData) ? therapistsData : []).map((item: any) => ({
        id: String(item.id),
        name: item.user?.name?.split(' ')[0] || '',
        surname: item.user?.name?.split(' ').slice(1).join(' ') || '',
        specialty: item.specialization || 'General Therapy',
        typeOfPractice: item.typeOfPractice || 'Private Practice',
        yearsOfExperience: item.yearsOfExperience || 0,
        hpcsaNumber: item.licenseNumber || 'Not provided',
        image: item.image || getFallbackImage(item.id),
      }));

      setTherapists(formattedTherapists);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      console.log('AdminDashboard: loaded therapists =', formattedTherapists.length, 'bookings =', Array.isArray(bookingsData) ? bookingsData.length : 0);
    } catch {
      console.log('AdminDashboard: failed to load dashboard data');
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  const stats = useMemo(() => {
    const pending = bookings.filter((item) => ['PENDING', 'pending_payment', 'pending'].includes(item.status)).length;
    const confirmed = bookings.filter((item) => ['CONFIRMED', 'confirmed', 'completed'].includes(item.status)).length;
    return {
      total: bookings.length,
      pending,
      confirmed,
      revenue: bookings.reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  }, [bookings]);

  const addTherapist = async () => {
    if (!newTherapist.name || !newTherapist.surname || !newTherapist.email || !newTherapist.password) {
      Alert.alert('Error', 'Please fill in the required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/therapists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTherapist),
      });
      if (!response.ok) throw new Error();
      setModalVisible(false);
      setNewTherapist({
        name: '',
        surname: '',
        email: '',
        password: '',
        specialty: '',
        yearsOfExperience: '',
        licenseNumber: '',
        typeOfPractice: '',
        bio: '',
        image: '',
      });
      fetchDashboardData();
    } catch {
      Alert.alert('Error', 'Failed to add therapist');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: 'CONFIRMED' | 'CANCELLED') => {
    setUpdatingBookingId(bookingId);
    try {
      console.log('AdminDashboard: update booking status', bookingId, status);
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log('AdminDashboard: update status response', response.status, data);
      if (!response.ok) throw new Error(data?.error || data?.message || 'Update failed');
      await fetchDashboardData();
    } catch (error: any) {
      console.log('AdminDashboard: update booking status failed', error?.message);
      Alert.alert('Error', error?.message || `Failed to mark booking as ${status.toLowerCase()}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  return (
    <AppShell title="Admin Dashboard" subtitle="Monitor live booking, therapist, and revenue activity.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}><Text style={styles.label}>Total Bookings</Text><Text style={styles.value}>{stats.total}</Text></Card>
          <Card style={styles.statCard}><Text style={styles.label}>Pending</Text><Text style={styles.value}>{stats.pending}</Text></Card>
          <Card style={styles.statCard}><Text style={styles.label}>Confirmed</Text><Text style={styles.value}>{stats.confirmed}</Text></Card>
          <Card style={styles.statCard}><Text style={styles.label}>Revenue</Text><Text style={styles.value}>R{stats.revenue.toFixed(2)}</Text></Card>
        </View>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
          </View>
          {bookings.length === 0 ? (
            <Text style={styles.empty}>No live booking data yet.</Text>
          ) : (
            bookings.slice(0, 6).map((booking) => (
              <View key={booking.id} style={styles.bookingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingName}>{booking.client?.name || 'Client'}</Text>
                  <Text style={styles.bookingMeta}>
                    {booking.bookingDate} · {String(booking.startTime).slice(0, 5)} - {String(booking.endTime).slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.bookingRight}>
                  <Text style={styles.price}>R{Number(booking.price || 0).toFixed(2)}</Text>
                  <Text style={styles.status}>{booking.status}</Text>
                  {booking.status !== 'CONFIRMED' ? (
                    <View style={styles.bookingActions}>
                      <Button
                        title={updatingBookingId === booking.id ? '...' : 'Approve'}
                        onPress={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                        style={styles.actionButton}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Therapist Roster</Text>
            <Button title="+ Add Therapist" onPress={() => setModalVisible(true)} />
          </View>
          {therapists.map((therapist) => (
            <View key={therapist.id} style={styles.therapistCard}>
              <Image source={{ uri: therapist.image }} style={styles.avatar} />
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>Dr. {therapist.name} {therapist.surname}</Text>
                <Text style={styles.therapistMeta}>{therapist.specialty}</Text>
                <Text style={styles.therapistMeta}>{therapist.typeOfPractice} · {therapist.yearsOfExperience} years</Text>
              </View>
            </View>
          ))}
        </Card>

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Therapist</Text>
              <ScrollView>
                <Input label="First Name" value={newTherapist.name} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, name: text }))} />
                <Input label="Surname" value={newTherapist.surname} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, surname: text }))} />
                <Input label="Email" value={newTherapist.email} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, email: text }))} autoCapitalize="none" />
                <Input label="Password" secureTextEntry value={newTherapist.password} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, password: text }))} />
                <Input label="Specialty" value={newTherapist.specialty} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, specialty: text }))} />
                <Input label="Years of Experience" value={newTherapist.yearsOfExperience} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, yearsOfExperience: text }))} />
                <Input label="License Number" value={newTherapist.licenseNumber} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, licenseNumber: text }))} />
                <Input label="Type of Practice" value={newTherapist.typeOfPractice} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, typeOfPractice: text }))} />
                <Input label="Bio" value={newTherapist.bio} onChangeText={(text) => setNewTherapist((prev) => ({ ...prev, bio: text }))} multiline numberOfLines={3} />
              </ScrollView>
              <View style={styles.modalActions}>
                <Button title="Close" onPress={() => setModalVisible(false)} variant="outline" />
                <Button title="Add" onPress={addTherapist} loading={loading} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  statsGrid: { gap: 12, marginBottom: 16 },
  statCard: { padding: 18 },
  label: { fontSize: 12, textTransform: 'uppercase', color: '#A1AD95', marginBottom: 6 },
  value: { fontSize: 28, fontWeight: '700', color: '#002324' },
  sectionCard: { padding: 18, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  empty: { color: '#64748B' },
  bookingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5DDDE' },
  bookingName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  bookingMeta: { marginTop: 4, color: '#64748B' },
  bookingRight: { alignItems: 'flex-end' },
  price: { fontWeight: '700', color: '#002324' },
  status: { marginTop: 4, color: '#64748B', fontSize: 12 },
  bookingActions: { marginTop: 8, gap: 8, width: 104 },
  actionButton: { minWidth: 0 },
  therapistCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5DDDE' },
  avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 12 },
  therapistInfo: { flex: 1 },
  therapistName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  therapistMeta: { marginTop: 4, color: '#64748B' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', padding: 18 },
  modalCard: { backgroundColor: 'white', borderRadius: 20, padding: 18, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
