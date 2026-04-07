import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';

type Therapist = {
  id: number;
  specialization?: string;
  typeOfPractice?: string;
  yearsOfExperience?: number;
  licenseNumber?: string;
  bio?: string;
  image?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default function TherapistsScreen() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    specialty: '',
    typeOfPractice: '',
    yearsOfExperience: '',
    licenseNumber: '',
    bio: '',
  });

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${API_BASE}/therapists`);
      const data = await response.json();
      setTherapists(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Error', 'Failed to load therapists');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please complete the required fields');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/therapists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      setModalVisible(false);
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        specialty: '',
        typeOfPractice: '',
        yearsOfExperience: '',
        licenseNumber: '',
        bio: '',
      });
      fetchTherapists();
    } catch {
      Alert.alert('Error', 'Failed to save therapist');
    }
  };

  return (
    <AppShell title="Therapists" subtitle="Manage therapists and review their professional details." scrollable={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Therapist Directory</Text>
          <Button title="+ Add Therapist" onPress={() => setModalVisible(true)} />
        </View>

        <FlatList
          data={therapists}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.image || `https://i.pravatar.cc/150?u=therapist-${item.id}` }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.user?.name || 'Therapist'}</Text>
                  <Text style={styles.meta}>{item.specialization || 'General Therapy'}</Text>
                </View>
              </View>
              <Text style={styles.meta}>Email: {item.user?.email || 'Not provided'}</Text>
              <Text style={styles.meta}>Practice: {item.typeOfPractice || 'Not set'}</Text>
              <Text style={styles.meta}>Experience: {item.yearsOfExperience || 0} years</Text>
              <Text style={styles.meta}>License: {item.licenseNumber || 'Not set'}</Text>
            </Card>
          )}
        />

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Therapist</Text>
              <Input label="First Name" value={formData.name} onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))} />
              <Input label="Surname" value={formData.surname} onChangeText={(text) => setFormData((prev) => ({ ...prev, surname: text }))} />
              <Input label="Email" value={formData.email} onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))} autoCapitalize="none" />
              <Input label="Password" secureTextEntry value={formData.password} onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))} />
              <Input label="Specialty" value={formData.specialty} onChangeText={(text) => setFormData((prev) => ({ ...prev, specialty: text }))} />
              <Input label="Type of Practice" value={formData.typeOfPractice} onChangeText={(text) => setFormData((prev) => ({ ...prev, typeOfPractice: text }))} />
              <Input label="Years of Experience" value={formData.yearsOfExperience} onChangeText={(text) => setFormData((prev) => ({ ...prev, yearsOfExperience: text }))} />
              <Input label="License Number" value={formData.licenseNumber} onChangeText={(text) => setFormData((prev) => ({ ...prev, licenseNumber: text }))} />
              <Input label="Bio" value={formData.bio} onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))} multiline numberOfLines={3} />
              <View style={styles.modalActions}>
                <Button title="Close" onPress={() => setModalVisible(false)} variant="outline" />
                <Button title="Save" onPress={handleSave} />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  list: { paddingBottom: 16 },
  card: { padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#002324' },
  meta: { color: '#64748B', marginBottom: 4 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', padding: 18 },
  modalCard: { backgroundColor: 'white', borderRadius: 20, padding: 18, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 20 },
});
