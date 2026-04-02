import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Payment {
  id: string;
  user: string;
  therapist: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const mockPayments: Payment[] = [
      { id: 'PAY-001', user: 'John Doe', therapist: 'Dr. Sarah Johnson', amount: 150, date: '2024-01-15', status: 'completed', method: 'Credit Card' },
      { id: 'PAY-002', user: 'Jane Smith', therapist: 'Dr. Michael Brown', amount: 150, date: '2024-01-14', status: 'completed', method: 'PayPal' },
      { id: 'PAY-003', user: 'Bob Wilson', therapist: 'Dr. Emily Davis', amount: 150, date: '2024-01-13', status: 'pending', method: 'Bank Transfer' },
    ];
    setPayments(mockPayments);
    setTotalRevenue(mockPayments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0));
  };

const getStatusColor = (status: string): string => {
  switch(status) {
    case 'completed': return '#4CAF50';
    case 'pending': return '#FF9800';
    case 'failed': return '#F44336';
    default: return '#A1AD95';
  }
};

  return (
    <View style={styles.container}>
      <Header title="Payment History" showBack />
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Revenue</Text>
        <Text style={styles.summaryAmount}>${totalRevenue}</Text>
        <Text style={styles.summarySubtitle}>All Time</Text>
      </Card>
      <ScrollView>
        {payments.map((payment) => (
          <Card key={payment.id}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentId}>{payment.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>{payment.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.userName}>{payment.user}</Text>
            <Text style={styles.therapistName}>Therapist: {payment.therapist}</Text>
            <View style={styles.paymentDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>${payment.amount}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="card-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{payment.method}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{payment.date}</Text>
              </View>
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
  summaryCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#A1AD95',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002324',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 4,
  },
  therapistName: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 12,
  },
  paymentDetails: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#A1AD95',
  },
});