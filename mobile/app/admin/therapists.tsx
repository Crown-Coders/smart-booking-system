import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Therapist {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  patientsCount: number;
}

export default function AdminTherapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    // Mock data
    const mockTherapists: Therapist[] = [
      { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@nozwelo.com', specialization: 'Clinical Psychology', experience: 8, rating: 4.8, status: 'available', patientsCount: 45 },
      { id: '2', name: 'Dr. Michael Brown', email: 'michael@nozwelo.com', specialization: 'Cognitive Behavioral Therapy', experience: 12, rating: 4.9, status: 'busy', patientsCount: 52 },
      { id: '3', name: 'Dr. Emily Davis', email: 'emily@nozwelo.com', specialization: 'Family Therapy', experience: 6, rating: 4.7, status: 'available', patientsCount: 38 },
    ];
    setTherapists(mockTherapists);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#A1AD95';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Therapist Management" showBack />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#EBFACF" />
        <Text style={styles.addButtonText}>Add Therapist</Text>
      </TouchableOpacity>
      <ScrollView>
        {therapists.map((therapist) => (
          <Card key={therapist.id}>
            <View style={styles.therapistHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{therapist.name.charAt(0)}</Text>
              </View>
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>{therapist.name}</Text>
                <Text style={styles.specialization}>{therapist.specialization}</Text>
                <Text style={styles.experience}>{therapist.experience} years experience</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(therapist.status) }]} />
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={20} color="#A1AD95" />
                <Text style={styles.statText}>{therapist.patientsCount} Patients</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.statText}>{therapist.rating} Rating</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>View Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.editBtn]}>
                <Text style={[styles.actionBtnText, styles.editBtnText]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#002324',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#002324',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#EBFACF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  specialization: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: '#A1AD95',
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#002324',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EBFACF',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#002324',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
  editBtnText: {
    color: '#EBFACF',
  },
});