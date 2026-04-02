import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';

export default function CalendarScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Simple calendar view without external dependency
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <Header title="Calendar" showBack />
      <ScrollView>
        <View style={styles.calendarContainer}>
          {/* Month Navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color="#002324" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color="#002324" />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekHeader}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <TouchableOpacity key={index} style={styles.dayCell}>
                  <View style={[styles.dayContainer, isToday && styles.todayContainer]}>
                    <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.sessionsSection}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <View style={styles.sessionCard}>
            <View style={styles.sessionTime}>
              <Text style={styles.sessionDate}>Today, 2:00 PM</Text>
              <View style={styles.sessionType}>
                <Text style={styles.sessionTypeText}>Therapy Session</Text>
              </View>
            </View>
            <Text style={styles.sessionTherapist}>Dr. Sarah Johnson</Text>
            <Text style={styles.sessionDuration}>Duration: 1 hour</Text>
          </View>
          
          <View style={styles.sessionCard}>
            <View style={styles.sessionTime}>
              <Text style={styles.sessionDate}>Tomorrow, 10:00 AM</Text>
              <View style={styles.sessionType}>
                <Text style={styles.sessionTypeText}>Follow-up</Text>
              </View>
            </View>
            <Text style={styles.sessionTherapist}>Dr. Michael Brown</Text>
            <Text style={styles.sessionDuration}>Duration: 45 min</Text>
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
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A1AD95',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  dayText: {
    fontSize: 16,
    color: '#002324',
  },
  todayContainer: {
    backgroundColor: '#002324',
  },
  todayText: {
    color: '#EBFACF',
    fontWeight: 'bold',
  },
  sessionsSection: {
    marginTop: 8,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
  sessionType: {
    backgroundColor: '#EBFACF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sessionTypeText: {
    fontSize: 12,
    color: '#002324',
  },
  sessionTherapist: {
    fontSize: 16,
    fontWeight: '500',
    color: '#002324',
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: '#A1AD95',
  },
});