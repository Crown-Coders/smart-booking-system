import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';

type Therapist = {
  id: number;
  user?: { name?: string };
  specialization?: string;
  yearsOfExperience?: number;
  image?: string;
};

const serviceCategories = [
  { label: 'Educational Psychologist', keywords: ['educational', 'school', 'child'] },
  { label: 'Couple Therapy', keywords: ['couple', 'relationship', 'marriage'] },
  { label: 'Occupational Therapist', keywords: ['occupational'] },
  { label: 'Speech and Language Therapy', keywords: ['speech', 'language'] },
  { label: 'Family Therapist', keywords: ['family'] },
  { label: 'Counselling', keywords: ['counselling', 'counseling', 'therapy'] },
  { label: 'Trauma Counselling', keywords: ['trauma', 'ptsd'] },
];

export default function ServicesScreen() {
  const navigation = useNavigation<any>();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch(`${API_BASE}/therapists`);
      const data = await response.json();
      setTherapists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load therapists', error);
      setTherapists([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTherapists = useMemo(() => {
    if (!selectedService) return therapists;

    const category = serviceCategories.find((item) => item.label === selectedService);
    const keywords = category?.keywords || [];
    const matches = therapists.filter((therapist) => {
      const specialization = therapist.specialization?.toLowerCase() || '';
      return keywords.some((keyword) => specialization.includes(keyword));
    });

    return matches.length > 0 ? matches : therapists;
  }, [selectedService, therapists]);

  const renderServiceCard = ({ item }: { item: (typeof serviceCategories)[number] }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => setSelectedService(item.label)}>
      <Text style={styles.serviceIcon}>+</Text>
      <Text style={styles.serviceName}>{item.label}</Text>
      <Text style={styles.serviceHint}>Find available therapists</Text>
    </TouchableOpacity>
  );

  const renderTherapistCard = ({ item }: { item: Therapist }) => (
    <TouchableOpacity style={styles.therapistCard} onPress={() => navigation.navigate('Calendar', { therapist: item })}>
      <Image source={{ uri: item.image || `https://i.pravatar.cc/150?u=therapist-${item.id}` }} style={styles.avatar} />
      <View style={styles.therapistInfo}>
        <Text style={styles.therapistName}>Dr. {item.user?.name || 'Therapist'}</Text>
        <Text style={styles.therapistSpec}>{item.specialization || 'General Therapy'}</Text>
        <Text style={styles.therapistMeta}>{item.yearsOfExperience || 0} years of experience</Text>
        <Text style={styles.therapistAction}>Tap to book a time slot</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AppShell title="Services" subtitle="Loading therapists..." scrollable={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={selectedService ? selectedService : 'Services'}
      subtitle={selectedService ? 'Choose a therapist to continue booking.' : 'Browse services and match with the right therapist.'}
      scrollable={false}
    >
      {!selectedService ? (
        <FlatList
          data={serviceCategories}
          keyExtractor={(item) => item.label}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          renderItem={renderServiceCard}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.resultsScreen}>
          <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.backButton}>
            <Text style={styles.backText}>Back to services</Text>
          </TouchableOpacity>

          {filteredTherapists.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No therapists found yet</Text>
              <Text style={styles.emptyText}>
                We could not find therapists for this service right now. Try another category or check again later.
              </Text>
            </View>
          ) : (
            <>
              {filteredTherapists.length === therapists.length ? (
                <View style={styles.infoBanner}>
                  <Text style={styles.infoText}>
                    Showing all therapists for now so you can still book, even if no exact specialization label matched this service.
                  </Text>
                </View>
              ) : null}
              <FlatList
                data={filteredTherapists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTherapistCard}
                contentContainerStyle={styles.therapistList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 16 },
  gridRow: { justifyContent: 'space-between' },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    minHeight: 150,
    justifyContent: 'space-between',
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 22,
    color: '#EBFACF',
    backgroundColor: '#002324',
    overflow: 'hidden',
  },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#002324', marginTop: 16 },
  serviceHint: { fontSize: 12, color: '#64748B', marginTop: 8 },
  resultsScreen: { flex: 1 },
  backButton: { marginBottom: 12 },
  backText: { fontSize: 14, fontWeight: '600', color: '#002324' },
  infoBanner: {
    backgroundColor: '#EBFACF',
    borderColor: '#A1AD95',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  infoText: { fontSize: 12, color: '#002324', lineHeight: 18 },
  therapistList: { paddingBottom: 18 },
  therapistCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: { width: 62, height: 62, borderRadius: 31, marginRight: 14 },
  therapistInfo: { flex: 1 },
  therapistName: { fontSize: 16, fontWeight: '700', color: '#002324' },
  therapistSpec: { marginTop: 4, fontSize: 13, color: '#475569' },
  therapistMeta: { marginTop: 6, fontSize: 12, color: '#A1AD95' },
  therapistAction: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#002324' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#002324' },
  emptyText: { marginTop: 8, textAlign: 'center', color: '#64748B', lineHeight: 20 },
});
