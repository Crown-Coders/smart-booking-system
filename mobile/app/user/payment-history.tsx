import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';



interface Payment {
  id: string;
  sessionId: string;
  therapist: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'refunded';
  method: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const mockPayments: Payment[] = [
      { id: 'PAY-001', sessionId: 'SESS-001', therapist: 'Dr. Sarah Johnson', amount: 150, date: '2024-01-15', status: 'paid', method: 'Credit Card' },
      { id: 'PAY-002', sessionId: 'SESS-002', therapist: 'Dr. Michael Brown', amount: 150, date: '2024-01-08', status: 'paid', method: 'PayPal' },
      { id: 'PAY-003', sessionId: 'SESS-003', therapist: 'Dr. Emily Davis', amount: 150, date: '2024-01-02', status: 'paid', method: 'Credit Card' },
    ];
    setPayments(mockPayments);
    setTotalSpent(mockPayments.reduce((sum, p) => sum + p.amount, 0));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'refunded': return '#9E9E9E';
      default: return '#A1AD95';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Payment History" showBack />
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Spent</Text>
        <Text style={styles.summaryAmount}>${totalSpent}</Text>
        <Text style={styles.summarySubtext}>All Time</Text>
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
            <Text style={styles.therapistName}>{payment.therapist}</Text>
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
            <TouchableOpacity style={styles.receiptButton}>
              <Text style={styles.receiptButtonText}>Download Receipt</Text>
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
  summaryCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
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
  summarySubtext: {
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
  therapistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 12,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontSize: 12,
    color: '#A1AD95',
  },
  receiptButton: {
    backgroundColor: '#EBFACF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002324',
  },
});