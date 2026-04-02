import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface DashboardStats {
  todaySessions: number;
  weeklySessions: number;
  totalPatients: number;
  earnings: number;
  rating: number;
}

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todaySessions: 0,
    weeklySessions: 0,
    totalPatients: 0,
    earnings: 0,
    rating: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Mock data
    setStats({
      todaySessions: 3,
      weeklySessions: 12,
      totalPatients: 45,
      earnings: 1800,
      rating: 4.8,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Therapist Dashboard" showLogout />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#002324', '#EBFACF']} style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Dr. {user?.name || 'Therapist'}!</Text>
          <Text style={styles.scheduleText}>Today's Schedule</Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#002324" />
            <Text style={styles.statNumber}>{stats.todaySessions}</Text>
            <Text style={styles.statLabel}>Today's Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.weeklySessions}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#9C27B0" />
            <Text style={styles.statNumber}>${stats.earnings}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </Card>
        </View>

        <View style={styles.todaySchedule}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <Card>
            <View style={styles.sessionItem}>
              <View style={styles.sessionTime}>
                <Text style={styles.timeText}>10:00 AM</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.patientName}>John Doe</Text>
                <Text style={styles.sessionType}>Therapy Session</Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sessionItem}>
              <View style={styles.sessionTime}>
                <Text style={styles.timeText}>2:00 PM</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.patientName}>Jane Smith</Text>
                <Text style={styles.sessionType}>Follow-up</Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  welcomeCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#EBFACF',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EBFACF',
    marginTop: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#EBFACF',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  statCard: {
    width: '46%',
    marginHorizontal: '2%',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A1AD95',
    marginTop: 4,
  },
  todaySchedule: {
    marginTop: 16,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDDE',
  },
  sessionTime: {
    width: 80,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
  sessionInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002324',
  },
  sessionType: {
    fontSize: 12,
    color: '#A1AD95',
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#002324',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  joinButtonText: {
    color: '#EBFACF',
    fontSize: 12,
    fontWeight: '500',
  },
});