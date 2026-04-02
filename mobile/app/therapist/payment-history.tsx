import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Payment {
  id: string;
  patient: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  sessionType: string;
}

export default function TherapistPaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    // Mock data
    const mockPayments: Payment[] = [
      { id: 'PAY-001', patient: 'John Doe', amount: 150, date: '2024-01-15', status: 'paid', sessionType: 'Therapy Session' },
      { id: 'PAY-002', patient: 'Jane Smith', amount: 150, date: '2024-01-08', status: 'paid', sessionType: 'Follow-up' },
      { id: 'PAY-003', patient: 'Bob Wilson', amount: 150, date: '2024-01-20', status: 'pending', sessionType: 'Initial Consultation' },
    ];
    setPayments(mockPayments);
    setTotalEarnings(mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0));
    setPendingAmount(mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0));
  };

  return (
    <View style={styles.container}>
      <Header title="Payment History" showBack />
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>${totalEarnings}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryAmount, styles.pendingAmount]}>${pendingAmount}</Text>
        </Card>
      </View>
      <ScrollView>
        {payments.map((payment) => (
          <Card key={payment.id}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentId}>{payment.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: payment.status === 'paid' ? '#4CAF5020' : '#FF980020' }]}>
                <Text style={[styles.statusText, { color: payment.status === 'paid' ? '#4CAF50' : '#FF9800' }]}>
                  {payment.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.patientName}>{payment.patient}</Text>
            <Text style={styles.sessionType}>{payment.sessionType}</Text>
            <View style={styles.paymentDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>${payment.amount}</Text>
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pendingAmount: {
    color: '#FF9800',
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
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 12,
  },
  paymentDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
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
});