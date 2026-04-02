import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const reports = [
    { title: 'Revenue Report', icon: 'cash', color: '#4CAF50', value: '$12,450', change: '+15%' },
    { title: 'User Growth', icon: 'people', color: '#2196F3', value: '156', change: '+12%' },
    { title: 'Session Completion', icon: 'calendar', color: '#FF9800', value: '93%', change: '+5%' },
    { title: 'Therapist Performance', icon: 'medical', color: '#9C27B0', value: '4.8', change: '+0.2' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Reports & Analytics" showBack />
      <View style={styles.periodSelector}>
        {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
          <TouchableOpacity key={period} style={[styles.periodBtn, selectedPeriod === period && styles.activePeriod]} onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.periodText, selectedPeriod === period && styles.activePeriodText]}>{period.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        <View style={styles.reportsGrid}>
          {reports.map((report, index) => (
            <Card key={index} style={styles.reportCard}>
              <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                <Ionicons name={report.icon as any} size={32} color={report.color} />
              </View>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportValue}>{report.value}</Text>
              <Text style={[styles.reportChange, { color: report.change.startsWith('+') ? '#4CAF50' : '#F44336' }]}>
                {report.change} from last period
              </Text>
            </Card>
          ))}
        </View>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Booking Trends</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>Chart visualization will appear here</Text>
          </View>
        </Card>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color="#EBFACF" />
          <Text style={styles.exportBtnText}>Export Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  periodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  activePeriod: {
    backgroundColor: '#002324',
  },
  periodText: {
    fontSize: 12,
    color: '#A1AD95',
  },
  activePeriodText: {
    color: '#EBFACF',
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  reportCard: {
    width: '46%',
    marginHorizontal: '2%',
    alignItems: 'center',
  },
  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 4,
  },
  reportValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 4,
  },
  reportChange: {
    fontSize: 12,
  },
  chartCard: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  chartText: {
    color: '#A1AD95',
  },
  exportBtn: {
    flexDirection: 'row',
    backgroundColor: '#002324',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportBtnText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});