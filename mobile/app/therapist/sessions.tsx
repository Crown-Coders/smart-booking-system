import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Session {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export default function TherapistSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    // Mock data
    const mockSessions: Session[] = [
      { id: '1', patient: 'John Doe', date: '2024-01-20', time: '10:00 AM', type: 'Therapy Session', status: 'upcoming' },
      { id: '2', patient: 'Jane Smith', date: '2024-01-20', time: '2:00 PM', type: 'Follow-up', status: 'upcoming' },
      { id: '3', patient: 'Bob Wilson', date: '2024-01-15', time: '11:00 AM', type: 'Initial Consultation', status: 'completed', notes: 'Good progress' },
    ];
    setSessions(mockSessions);
  };

  const filteredSessions = sessions.filter(s => s.status === activeTab);

  return (
    <View style={styles.container}>
      <Header title="My Sessions" showBack />
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'completed' && styles.activeTab]} onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {filteredSessions.map((session) => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <Text style={styles.patientName}>{session.patient}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
            </View>
            <View style={styles.sessionDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{session.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{session.time}</Text>
              </View>
            </View>
            {activeTab === 'upcoming' ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton}>
                  <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            ) : (
              session.notes && (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{session.notes}</Text>
                </View>
              )
            )}
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
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#002324',
  },
  tabText: {
    fontSize: 14,
    color: '#A1AD95',
  },
  activeTabText: {
    color: '#EBFACF',
  },
  sessionHeader: {
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  sessionType: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 2,
  },
  sessionDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#A1AD95',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#002324',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#EBFACF',
    fontSize: 14,
    fontWeight: '500',
  },
  rescheduleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#002324',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#002324',
    fontSize: 14,
    fontWeight: '500',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#A1AD95',
  },
});