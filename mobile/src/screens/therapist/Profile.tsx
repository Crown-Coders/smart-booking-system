import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { storage } from '../../utils/storage';
import { AuthContext } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

type TherapistProfile = {
  specialization?: string;
  yearsOfExperience?: number;
  licenseNumber?: string;
  qualification?: string;
  bio?: string;
  typeOfPractice?: string;
  workingDays?: string;
  workDayStart?: string;
  workDayEnd?: string;
};

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext)!;
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardHolderName: user?.cardHolderName || '',
    cardNumber: '',
    cardBrand: user?.cardBrand || 'Visa',
    cardExpiryMonth: user?.cardExpiryMonth || '',
    cardExpiryYear: user?.cardExpiryYear || '',
  });
  const [therapistForm, setTherapistForm] = useState<TherapistProfile>({
    specialization: '',
    yearsOfExperience: 0,
    licenseNumber: '',
    qualification: '',
    bio: '',
    typeOfPractice: '',
    workingDays: '1,2,3,4,5',
    workDayStart: '08:00',
    workDayEnd: '17:00',
  });

  useEffect(() => {
    if (user?.id && user.role === 'THERAPIST') {
      fetchTherapistProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTherapistProfile = async () => {
    try {
      const token = await storage.getItem('token');
      const response = await fetch(`${API_BASE}/therapists/profile/${user!.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProfile(data);
      setTherapistForm({
        specialization: data?.specialization || '',
        yearsOfExperience: data?.yearsOfExperience || 0,
        licenseNumber: data?.licenseNumber || '',
        qualification: data?.qualification || '',
        bio: data?.bio || '',
        typeOfPractice: data?.typeOfPractice || '',
        workingDays: data?.workingDays || '1,2,3,4,5',
        workDayStart: data?.workDayStart || '08:00',
        workDayEnd: data?.workDayEnd || '17:00',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTherapistAvailability = async () => {
    setSavingProfile(true);
    try {
      const token = await storage.getItem('token');
      const response = await fetch(`${API_BASE}/therapists/profile/${user!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...therapistForm,
          yearsOfExperience: Number(therapistForm.yearsOfExperience || 0),
        }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) throw new Error(data?.message || 'Failed to save therapist profile');
      setProfile(data);
      Alert.alert('Saved', 'Working hours and therapist details updated.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save therapist profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePaymentMethod = async () => {
    if (!paymentForm.cardHolderName || !paymentForm.cardNumber || !paymentForm.cardExpiryMonth || !paymentForm.cardExpiryYear) {
      Alert.alert('Error', 'Please complete the payment method form');
      return;
    }

    setSaving(true);
    try {
      const token = await storage.getItem('token');
      const response = await fetch(`${API_BASE}/users/me/payment-method`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentForm),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) throw new Error(data?.message || 'Failed to save payment method');

      if (user) {
        await updateUser({
          ...user,
          ...data.user,
        });
      }

      setPaymentForm((current) => ({ ...current, cardNumber: '' }));
      Alert.alert('Saved', 'Payment method saved securely as masked card details.');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save payment method');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Profile" subtitle="Loading profile..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile" subtitle="Your account details and saved payment method.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>

        {user?.role === 'THERAPIST' ? (
          <>
            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              <Input label="Specialization" value={String(therapistForm.specialization || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, specialization: text }))} />
              <Input label="Years of Experience" value={String(therapistForm.yearsOfExperience || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, yearsOfExperience: Number(text || 0) }))} keyboardType="number-pad" />
              <Input label="License Number" value={String(therapistForm.licenseNumber || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, licenseNumber: text }))} />
              <Input label="Qualification" value={String(therapistForm.qualification || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, qualification: text }))} />
              <Input label="Type of Practice" value={String(therapistForm.typeOfPractice || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, typeOfPractice: text }))} />
              <Input label="Working Days" value={String(therapistForm.workingDays || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, workingDays: text }))} />
              <Text style={styles.helperText}>Use weekday numbers: `1,2,3,4,5` means Monday to Friday.</Text>
              <Input label="Work Day Start" value={String(therapistForm.workDayStart || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, workDayStart: text }))} />
              <Input label="Work Day End" value={String(therapistForm.workDayEnd || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, workDayEnd: text }))} />
              <Input label="Bio" value={String(therapistForm.bio || '')} onChangeText={(text) => setTherapistForm((prev) => ({ ...prev, bio: text }))} multiline numberOfLines={4} />
              <Button title={savingProfile ? 'Saving...' : 'Save Working Hours'} onPress={saveTherapistAvailability} style={{ marginTop: 12 }} />

              {profile ? (
                <View style={styles.savedCard}>
                  <Text style={styles.detail}>Current hours: {profile.workDayStart || '08:00'} - {profile.workDayEnd || '17:00'}</Text>
                  <Text style={styles.detail}>Current working days: {profile.workingDays || '1,2,3,4,5'}</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : (
          <>
            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <Text style={styles.detail}>Email: {user?.email}</Text>
              <Text style={styles.detail}>Role: {user?.role}</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Saved Payment Method</Text>
              {user?.cardLast4 ? (
                <View style={styles.savedCard}>
                  <Text style={styles.detail}>Brand: {user.cardBrand || 'Card'}</Text>
                  <Text style={styles.detail}>Cardholder: {user.cardHolderName}</Text>
                  <Text style={styles.detail}>Number: **** **** **** {user.cardLast4}</Text>
                  <Text style={styles.detail}>Expiry: {user.cardExpiryMonth}/{user.cardExpiryYear}</Text>
                </View>
              ) : (
                <Text style={styles.detail}>No saved card yet.</Text>
              )}

              <Input label="Cardholder Name" value={paymentForm.cardHolderName} onChangeText={(text) => setPaymentForm((prev) => ({ ...prev, cardHolderName: text }))} />
              <Input label="Card Number" value={paymentForm.cardNumber} onChangeText={(text) => setPaymentForm((prev) => ({ ...prev, cardNumber: text }))} keyboardType="number-pad" />
              <Input label="Card Brand" value={paymentForm.cardBrand} onChangeText={(text) => setPaymentForm((prev) => ({ ...prev, cardBrand: text }))} />
              <Input label="Expiry Month" value={paymentForm.cardExpiryMonth} onChangeText={(text) => setPaymentForm((prev) => ({ ...prev, cardExpiryMonth: text }))} keyboardType="number-pad" />
              <Input label="Expiry Year" value={paymentForm.cardExpiryYear} onChangeText={(text) => setPaymentForm((prev) => ({ ...prev, cardExpiryYear: text }))} keyboardType="number-pad" />
              <Button title={saving ? 'Saving...' : 'Save Payment Method'} onPress={savePaymentMethod} style={{ marginTop: 12 }} />
              <Text style={styles.helperText}>For safety, the app only stores masked card details and never stores CVV.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5DDDE',
    marginBottom: 16,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#002324', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: '#EBFACF', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#002324' },
  email: { marginTop: 6, color: '#475569' },
  role: { marginTop: 4, color: '#A1AD95' },
  detailCard: { backgroundColor: 'white', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#E5DDDE', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#002324', marginBottom: 12 },
  detail: { marginBottom: 8, color: '#475569' },
  savedCard: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#FAF9F7', borderWidth: 1, borderColor: '#E5DDDE' },
  helperText: { marginTop: 10, color: '#64748B', fontSize: 12, lineHeight: 18 },
});
