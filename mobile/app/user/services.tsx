import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: string;
}

export default function Services() {
  const services: Service[] = [
    { id: '1', name: 'Individual Therapy', description: 'One-on-one session with a licensed therapist', duration: 60, price: 150, icon: 'person' },
    { id: '2', name: 'Couples Counseling', description: 'Therapy for couples to improve relationship', duration: 90, price: 200, icon: 'heart' },
    { id: '3', name: 'Group Therapy', description: 'Support group sessions', duration: 120, price: 100, icon: 'people' },
    { id: '4', name: 'Emergency Consultation', description: 'Immediate support for urgent situations', duration: 45, price: 180, icon: 'alert' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Our Services" showBack />
      <ScrollView>
        {services.map((service) => (
          <Card key={service.id}>
            <View style={styles.serviceHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={service.icon as any} size={32} color="#002324" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            </View>
            <View style={styles.serviceDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>{service.duration} minutes</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#A1AD95" />
                <Text style={styles.detailText}>${service.price}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Now</Text>
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
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBFACF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#A1AD95',
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
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
    fontSize: 14,
    color: '#A1AD95',
  },
  bookButton: {
    backgroundColor: '#002324',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '500',
  },
});