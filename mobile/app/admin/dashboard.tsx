import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface DashboardStats {
  totalUsers: number;
  totalTherapists: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedSessions: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTherapists: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedSessions: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Mock data - replace with API call
    setStats({
      totalUsers: 156,
      totalTherapists: 12,
      totalBookings: 342,
      totalRevenue: 12450,
      pendingBookings: 23,
      completedSessions: 319,
    });
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: 'people', color: '#002324', route: '/users' },
    { title: 'Therapists', value: stats.totalTherapists, icon: 'medical', color: '#4CAF50', route: '/therapists' },
    { title: 'Bookings', value: stats.totalBookings, icon: 'calendar', color: '#FF9800', route: '/bookings' },
    { title: 'Revenue', value: `$${stats.totalRevenue}`, icon: 'cash', color: '#9C27B0', route: '/payments' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showLogout />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#002324', '#EBFACF']} style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Admin'}!</Text>
          <Text style={styles.adminText}>System Overview</Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCardWrapper} onPress={() => {}}>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add" size={24} color="#002324" />
              <Text style={styles.actionText}>Add User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="medical" size={24} color="#002324" />
              <Text style={styles.actionText}>Add Therapist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bar-chart" size={24} color="#002324" />
              <Text style={styles.actionText}>View Reports</Text>
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
  adminText: {
    fontSize: 14,
    color: '#EBFACF',
    marginTop: 8,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  statCardWrapper: {
    width: '46%',
    marginHorizontal: '2%',
  },
  statCard: {
    alignItems: 'center',
    marginHorizontal: 0,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#A1AD95',
  },
  section: {
    marginTop: 24,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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