import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface DashboardData {
  upcomingSessions: number;
  totalSessions: number;
  totalHours: number;
  nextSession: {
    therapist: string;
    date: string;
    time: string;
  } | null;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    upcomingSessions: 0,
    totalSessions: 0,
    totalHours: 0,
    nextSession: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data - replace with API call
    setData({
      upcomingSessions: 3,
      totalSessions: 12,
      totalHours: 18,
      nextSession: {
        therapist: 'Dr. Sarah Johnson',
        date: '2024-01-20',
        time: '10:00 AM',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard" showLogout />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#002324', '#EBFACF']} style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}!</Text>
          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>How are you feeling today?</Text>
            <View style={styles.moodIcons}>
              <TouchableOpacity style={styles.moodIcon}>
                <Ionicons name="happy-outline" size={32} color="#EBFACF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moodIcon}>
                <Ionicons name="sad-outline" size={32} color="#EBFACF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moodIcon}>
                <Ionicons name="body-outline" size={32} color="#EBFACF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#002324" />
            <Text style={styles.statNumber}>{data.upcomingSessions}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{data.totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{data.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </Card>
        </View>

        {data.nextSession && (
          <View style={styles.nextSession}>
            <Text style={styles.sectionTitle}>Next Session</Text>
            <Card>
              <Text style={styles.therapistName}>{data.nextSession.therapist}</Text>
              <View style={styles.sessionDetails}>
                <Ionicons name="calendar-outline" size={16} color="#A1AD95" />
                <Text style={styles.sessionText}>{data.nextSession.date}</Text>
                <Ionicons name="time-outline" size={16} color="#A1AD95" />
                <Text style={styles.sessionText}>{data.nextSession.time}</Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Session</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar" size={32} color="#002324" />
              <Text style={styles.actionText}>Book Session</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="chatbubbles" size={32} color="#002324" />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="document-text" size={32} color="#002324" />
              <Text style={styles.actionText}>Resources</Text>
            </TouchableOpacity>
          </View>
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
  moodContainer: {
    marginTop: 20,
  },
  moodLabel: {
    fontSize: 14,
    color: '#EBFACF',
    marginBottom: 12,
  },
  moodIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  moodIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 0,
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
  nextSession: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 8,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sessionText: {
    fontSize: 14,
    color: '#A1AD95',
  },
  joinButton: {
    backgroundColor: '#002324',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '500',
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 80,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#002324',
  },
});