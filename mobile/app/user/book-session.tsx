import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  price: number;
  availability: string[];
}

export default function BookSession() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    // Mock data
    const mockTherapists: Therapist[] = [
      { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Clinical Psychology', rating: 4.8, price: 150, availability: ['10:00', '11:00', '14:00'] },
      { id: '2', name: 'Dr. Michael Brown', specialization: 'Cognitive Behavioral', rating: 4.9, price: 160, availability: ['09:00', '13:00', '15:00'] },
      { id: '3', name: 'Dr. Emily Davis', specialization: 'Family Therapy', rating: 4.7, price: 140, availability: ['10:00', '12:00', '16:00'] },
    ];
    setTherapists(mockTherapists);
  };

  const handleBooking = () => {
    // API call to create booking
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Book a Session" showBack />
      <ScrollView>
        <Text style={styles.sectionTitle}>Select Therapist</Text>
        {therapists.map((therapist) => (
          <TouchableOpacity key={therapist.id} onPress={() => setSelectedTherapist(therapist)}>
            <Card style={[styles.therapistCard, selectedTherapist?.id === therapist.id && styles.selectedCard]}>
              <View style={styles.therapistHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{therapist.name.charAt(0)}</Text>
                </View>
                <View style={styles.therapistInfo}>
                  <Text style={styles.therapistName}>{therapist.name}</Text>
                  <Text style={styles.specialization}>{therapist.specialization}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{therapist.rating}</Text>
                    <Text style={styles.price}>${therapist.price}/session</Text>
                  </View>
                </View>
                {selectedTherapist?.id === therapist.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {selectedTherapist && (
          <>
            <Text style={styles.sectionTitle}>Select Date & Time</Text>
            <Card>
              <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={24} color="#002324" />
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={selectedDate} mode="date" onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }} />
              )}
              <View style={styles.timeSlots}>
                {selectedTherapist.availability.map((time) => (
                  <TouchableOpacity key={time} style={[styles.timeSlot, selectedTime === time && styles.selectedTime]} onPress={() => setSelectedTime(time)}>
                    <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Card>
              <TextInput style={styles.notesInput} placeholder="Any specific concerns or preferences..." multiline numberOfLines={4} value={notes} onChangeText={setNotes} />
            </Card>

            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>Booking Confirmed!</Text>
            <Text style={styles.modalText}>Your session has been booked successfully.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  therapistCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#002324',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#EBFACF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  specialization: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#002324',
  },
  price: {
    marginLeft: 12,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#002324',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  selectedTime: {
    backgroundColor: '#002324',
    borderColor: '#002324',
  },
  timeText: {
    fontSize: 14,
    color: '#002324',
  },
  selectedTimeText: {
    color: '#EBFACF',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#002324',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#EBFACF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginTop: 16,
  },
  modalText: {
    fontSize: 16,
    color: '#A1AD95',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#002324',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '600',
  },
});