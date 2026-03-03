import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Button,
  Alert,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatListProps,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

type TherapyService = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const therapyServices: TherapyService[] = [
  { id: '1', name: 'Massage Therapy', description: 'Relax your muscles', price: 200 },
  { id: '2', name: 'Cognitive Therapy', description: 'Improve mental clarity', price: 250 },
  { id: '3', name: 'Physical Therapy', description: 'Rehabilitation services', price: 300 },
];

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedService, setSelectedService] = useState<TherapyService | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi 👋 I am your assistant. Ask me anything!' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Booking helpers
  const isDoubleBooked = (date: string, time: string) => {
    return bookings.some(b => b.date === date && b.time === time);
  };

  const handleBook = () => {
    if (!selectedService || !selectedDate || !paymentMethod) {
      Alert.alert('Error', 'Please complete all booking fields.');
      return;
    }

    const timeStr = selectedTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isDoubleBooked(selectedDate, timeStr)) {
      Alert.alert('Error', 'This time slot is already booked.');
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      service: selectedService.name,
      date: selectedDate,
      time: timeStr,
      amount: selectedService.price,
      paymentMethod,
      status: 'Pending',
    };

    setBookings([...bookings, newBooking]);
    Alert.alert('Success', 'Booking confirmed!');
  };

  // Auth
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  // Chatbot logic
  const getBotReply = (text: string) => {
    const msg = text.toLowerCase();
    if (msg.includes('book')) return 'You can book a service from the dashboard.';
    if (msg.includes('price')) return 'Prices depend on the selected therapy service.';
    if (msg.includes('payment')) return 'We support Card and EFT payments.';
    if (msg.includes('time')) return 'Available time slots depend on availability.';
    return 'Sorry, I did not understand that. Try asking about bookings or payments.';
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: chatInput };
    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: getBotReply(chatInput) };

    setChatMessages([...chatMessages, userMsg, botMsg]);
    setChatInput('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handleProfile}>
            <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText>Welcome, {user?.email}</ThemedText>

      <ThemedText type="subtitle" style={{ marginTop: 16 }}>
        Available Therapy Services
      </ThemedText>

      <FlatList
        data={therapyServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Price: R{item.price}</Text>
            <Button title="Select" onPress={() => setSelectedService(item)} />
          </View>
        )}
      />

      {selectedService && (
        <View style={styles.bookingCard}>
          <ThemedText type="subtitle">Booking for: {selectedService.name}</ThemedText>

          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true } }}
          />

          <Button
            title={selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onPress={() => setShowTimePicker(true)}
          />

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour
              onChange={(_, date) => {
                setShowTimePicker(false);
                if (date) setSelectedTime(date);
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Payment Method (Card / EFT)"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />

          <Button title="Book Now" onPress={handleBook} />
        </View>
      )}

      {/* FLOATING CHATBOT BUTTON */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => setChatOpen(!chatOpen)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* CHAT PANEL */}
      {chatOpen && (
        <View style={styles.chatPanel}>
          <View style={styles.chatHeader}>
            <Text style={{ fontWeight: 'bold' }}>AI Assistant</Text>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <Ionicons name="close" size={20} />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ flex: 1 }}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.chatMessage,
                  item.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={{ color: item.sender === 'user' ? '#fff' : '#000' }}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendChatMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  iconRow: { flexDirection: 'row', gap: 12 },

  serviceCard: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 },

  serviceName: { fontWeight: 'bold', fontSize: 16 },

  bookingCard: { padding: 12, borderWidth: 1, borderRadius: 8, marginTop: 16 },

  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 8, padding: 12, marginTop: 8 },

  // CHATBOT
  chatbotButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  chatPanel: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 8,
  },

  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },

  chatMessage: { padding: 8, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },

  userBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },

  botBubble: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },

  chatInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  chatInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },

  sendBtn: { marginLeft: 8, backgroundColor: '#007AFF', padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});