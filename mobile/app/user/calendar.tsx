import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const sessions = [
    { id: 1, therapist: 'Dr. Sarah Johnson', date: '2024-01-20', time: '10:00 AM', type: 'Therapy Session' },
    { id: 2, therapist: 'Dr. Michael Brown', date: '2024-01-22', time: '2:00 PM', type: 'Follow-up' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Calendar" showBack />
      <ScrollView>
        <Card style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              <Ionicons name="chevron-back" size={24} color="#002324" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
            <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              <Ionicons name="chevron-forward" size={24} color="#002324" />
            </TouchableOpacity>
          </View>
          <View style={styles.weekHeader}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();
              const hasSession = sessions.some(s => new Date(s.date).getDate() === day);
              return (
                <TouchableOpacity key={index} style={styles.dayCell} onPress={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}>
                  <View style={[styles.dayContainer, isToday && styles.todayContainer]}>
                    <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                    {hasSession && <View style={styles.sessionDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Sessions on {selectedDate.toDateString()}</Text>
        {sessions.filter(s => new Date(s.date).toDateString() === selectedDate.toDateString()).map((session) => (
          <Card key={session.id}>
            <Text style={styles.therapistName}>{session.therapist}</Text>
            <Text style={styles.sessionType}>{session.type}</Text>
            <View style={styles.sessionTime}>
              <Ionicons name="time-outline" size={16} color="#A1AD95" />
              <Text style={styles.timeText}>{session.time}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
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
  calendarCard: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    position: 'relative',
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
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 4,
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
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 8,
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#A1AD95',
  },
  detailsButton: {
    backgroundColor: '#EBFACF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
});