import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AppShell from '../../components/layout/AppShell';
import { API_BASE } from '../../utils/api';
import { formatDate, formatTime } from '../../utils/date';
import { storage } from '../../utils/storage';

type Therapist = {
  id: number;
  user?: { name?: string };
  specialization?: string;
  yearsOfExperience?: number;
  workingDays?: string;
  workDayStart?: string;
  workDayEnd?: string;
};

type TimeSlot = {
  time: string;
  display: string;
};

const generateTimeSlots = (start = '08:00', end = '17:00'): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const current = new Date(2000, 0, 1, startHour, startMinute, 0, 0);
  const boundary = new Date(2000, 0, 1, endHour, endMinute, 0, 0);

  while (current < boundary) {
    const time = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
    slots.push({
      time,
      display: current.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    });
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

const getWorkingDayNumbers = (workingDays?: string) =>
  String(workingDays || '1,2,3,4,5')
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));

export default function CalendarScreen() {
  const route = useRoute();
  const selectedTherapistFromState = (route.params as any)?.therapist as Therapist | undefined;
  const rescheduleAppointment = (route.params as any)?.appointment as any;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [therapist, setTherapist] = useState<Therapist | null>(selectedTherapistFromState || null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  const [bookingData, setBookingData] = useState({ startTime: '', endTime: '', description: '' });

  const workingDays = getWorkingDayNumbers(therapist?.workingDays);
  const workDayStart = therapist?.workDayStart || '08:00';
  const workDayEnd = therapist?.workDayEnd || '17:00';
  const allTimeSlots = useMemo(() => generateTimeSlots(workDayStart, workDayEnd), [workDayStart, workDayEnd]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await storage.getItem('token');
      if (!token) return;
      console.log('CalendarScreen: loading current user');
      const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('CalendarScreen: current user loaded', data?.id, data?.role);
      setUser(data);
    };

    const fetchTherapists = async () => {
      if (selectedTherapistFromState) return;
      console.log('CalendarScreen: loading therapists');
      const response = await fetch(`${API_BASE}/therapists`);
      const data = await response.json();
      console.log('CalendarScreen: therapists loaded', Array.isArray(data) ? data.length : 0);
      setTherapists(Array.isArray(data) ? data : []);
    };

    fetchUser();
    fetchTherapists();
  }, [selectedTherapistFromState]);

  useEffect(() => {
    if (rescheduleAppointment?.bookingDate) {
      setSelectedDate(rescheduleAppointment.bookingDate);
      setBookingData((current) => ({
        ...current,
        description: rescheduleAppointment.description || '',
        startTime: '',
        endTime: '',
      }));
    }
  }, [rescheduleAppointment]);

  useEffect(() => {
    if (therapist && selectedDate) {
      fetchBookedSlots();
    }
  }, [therapist, selectedDate]);

  const fetchBookedSlots = async () => {
    setLoading(true);
    try {
      console.log('CalendarScreen: loading slots', therapist?.id, selectedDate);
      const response = await fetch(`${API_BASE}/availability-slots?therapistId=${therapist?.id}&date=${selectedDate}`);
      const data = await response.json();
      console.log('CalendarScreen: slots loaded', Array.isArray(data?.slots) ? data.slots.length : 0);
      setBookedSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to load slots', error);
    } finally {
      setLoading(false);
    }
  };

  const isTimeSlotPassed = (time: string) => {
    if (!selectedDate) return false;
    const today = new Date();
    const selected = new Date(selectedDate);
    if (selected.toDateString() !== today.toDateString()) return false;
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime <= new Date();
  };

  const isSelectedDateWithinWorkingDays = () => {
    if (!selectedDate) return true;
    const dayOfWeek = new Date(selectedDate).getDay();
    return workingDays.includes(dayOfWeek);
  };

  const isSlotAvailable = (time: string) => {
    if (!isSelectedDateWithinWorkingDays()) return false;
    if (isTimeSlotPassed(time)) return false;
    return !bookedSlots.some((slot) => time >= slot.startTime && time < slot.endTime);
  };

  const calculatePrice = (start: string, end: string) => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return hours * 800;
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!isSlotAvailable(slot.time)) {
      Alert.alert('Unavailable', 'This slot is already booked, outside working hours, or has passed.');
      return;
    }
    if (!therapist) {
      Alert.alert('Choose Therapist', 'Please select a therapist first.');
      return;
    }
    if (selectionStep === 'start') {
      setBookingData((current) => ({ ...current, startTime: slot.time, endTime: '' }));
      setSelectionStep('end');
      return;
    }
    if (slot.time <= bookingData.startTime) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }
    setBookingData((current) => ({ ...current, endTime: slot.time }));
    setSelectionStep('start');
  };

  const handleBooking = async () => {
    if (!user || !therapist || !selectedDate || !bookingData.startTime || !bookingData.endTime) {
      Alert.alert('Incomplete', 'Please choose a therapist, date, and time range.');
      return;
    }

    setLoading(true);
    try {
      const token = await storage.getItem('token');
      const payload = {
        userId: user.id,
        therapistId: therapist.id,
        bookingDate: selectedDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        description: bookingData.description,
        price: calculatePrice(bookingData.startTime, bookingData.endTime),
        status: 'pending_payment',
      };

      console.log('CalendarScreen: creating booking', payload);

      const endpoint = rescheduleAppointment
        ? `${API_BASE}/bookings/${rescheduleAppointment.id}/reschedule`
        : `${API_BASE}/bookings`;

      const bookingRes = await fetch(endpoint, {
        method: rescheduleAppointment ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const bookingText = await bookingRes.text();
      const bookingDataResponse = bookingText ? JSON.parse(bookingText) : null;
      console.log('CalendarScreen: booking response', bookingRes.status, bookingDataResponse);
      if (!bookingRes.ok) {
        throw new Error(bookingDataResponse?.error || bookingDataResponse?.message || 'Booking failed');
      }
      const booking = bookingDataResponse;

      if (rescheduleAppointment) {
        Alert.alert('Rescheduled', 'Your session has been moved successfully.');
        setShowModal(false);
        return;
      }

      const payRes = await fetch(`${API_BASE}/bookings/payfast/${booking.booking.id}`, { method: 'POST' });
      const payText = await payRes.text();
      const payData = payText ? JSON.parse(payText) : null;
      console.log('CalendarScreen: payfast response', payRes.status, payData);
      if (!payRes.ok) {
        throw new Error(payData?.error || 'Payment redirect failed');
      }
      const { url } = payData;
      setShowModal(false);
      Linking.openURL(url);
    } catch (error: any) {
      console.log('CalendarScreen: booking flow failed', error?.message);
      Alert.alert('Error', error.message || 'Could not complete booking');
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const todayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  const handleDayPress = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const selected = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      Alert.alert('Past Date', 'Please choose today or a future date.');
      return;
    }
    if (therapist) {
      const dayOfWeek = selected.getDay();
      if (!getWorkingDayNumbers(therapist.workingDays).includes(dayOfWeek)) {
        Alert.alert('Unavailable Day', 'This therapist is not available on the selected day.');
        return;
      }
    }
    setSelectedDate(dateKey);
    setBookingData({ startTime: '', endTime: '', description: '' });
    setSelectionStep('start');
    setShowModal(true);
  };

  return (
    <AppShell
      title={rescheduleAppointment ? 'Reschedule Session' : 'Book a Session'}
      subtitle={rescheduleAppointment ? 'Choose a new time at least 24 hours before your current session.' : 'Choose a day, a therapist, and an available time slot.'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {rescheduleAppointment ? (
          <View style={styles.rescheduleBanner}>
            <Text style={styles.rescheduleTitle}>Reschedule Policy</Text>
            <Text style={styles.rescheduleText}>
              You can move this session only if it is more than 24 hours away. Your payment stays attached to the booking.
            </Text>
          </View>
        ) : null}
        <View style={styles.calendarCard}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month - 1, 1))} style={styles.navButton}>
              <Text style={styles.navText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{monthNames[month]} {year}</Text>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month + 1, 1))} style={styles.navButton}>
              <Text style={styles.navText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.emptyDay} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateKey === todayKey;
              const isPast = new Date(dateKey) < new Date(new Date().setHours(0, 0, 0, 0));
              return (
                <TouchableOpacity
                  key={dateKey}
                  style={[styles.dayCell, isToday && styles.todayCell, isPast && styles.pastCell]}
                  disabled={isPast}
                  onPress={() => handleDayPress(day)}
                >
                  <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bookingHint}>
          <Text style={styles.bookingHintTitle}>How booking works</Text>
          <Text style={styles.bookingHintText}>
            Choose a therapist, pick one of their actual working days, then select a slot inside their working hours.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {therapist ? `Book with Dr. ${therapist.user?.name || 'Therapist'}` : 'Choose a Therapist'}
            </Text>
            <Text style={styles.modalDate}>{selectedDate ? formatDate(selectedDate, 'long') : ''}</Text>

            {!therapist ? (
              <ScrollView style={styles.therapistList}>
                {therapists.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.therapistOption} onPress={() => setTherapist(item)}>
                    <Text style={styles.therapistOptionName}>Dr. {item.user?.name || 'Therapist'}</Text>
                    <Text style={styles.therapistOptionMeta}>{item.specialization || 'General Therapy'}</Text>
                    <Text style={styles.therapistOptionMeta}>
                      Hours: {item.workDayStart || '08:00'} - {item.workDayEnd || '17:00'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <>
                <View style={styles.selectedTherapist}>
                  <Text style={styles.selectedTherapistText}>
                    {therapist.specialization || 'General Therapy'} • {therapist.yearsOfExperience || 0} years
                  </Text>
                  <Text style={styles.selectedTherapistMeta}>
                    Working hours: {workDayStart} - {workDayEnd}
                  </Text>
                </View>

                <Text style={styles.sectionLabel}>
                  {selectionStep === 'start' ? 'Select start time' : 'Select end time'}
                </Text>
                {!isSelectedDateWithinWorkingDays() ? (
                  <Text style={styles.unavailableDayText}>
                    This therapist is unavailable on the selected day. Please choose one of their working days.
                  </Text>
                ) : null}
                {loading ? <ActivityIndicator size="small" /> : null}
                <View style={styles.slotGrid}>
                  {allTimeSlots.map((slot) => {
                    const available = isSlotAvailable(slot.time);
                    const selected = bookingData.startTime === slot.time || bookingData.endTime === slot.time;
                    return (
                      <TouchableOpacity
                        key={slot.time}
                        style={[styles.slotButton, !available && styles.slotDisabled, selected && styles.slotSelected]}
                        disabled={!available}
                        onPress={() => handleSlotClick(slot)}
                      >
                        <Text style={[styles.slotText, selected && styles.slotSelectedText]}>{slot.display}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {bookingData.startTime ? <Text style={styles.selectionText}>Start: {formatTime(bookingData.startTime)}</Text> : null}
                {bookingData.endTime ? <Text style={styles.selectionText}>End: {formatTime(bookingData.endTime)}</Text> : null}
                {bookingData.startTime && bookingData.endTime ? (
                  <Text style={styles.priceText}>Total: R{calculatePrice(bookingData.startTime, bookingData.endTime)}</Text>
                ) : null}

                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={3}
                  placeholder="Brief description of your appointment reason..."
                  value={bookingData.description}
                  onChangeText={(text) => setBookingData((current) => ({ ...current, description: text }))}
                />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowModal(false)}>
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, (!bookingData.startTime || !bookingData.endTime || !therapist) && styles.primaryButtonDisabled]}
                disabled={!bookingData.startTime || !bookingData.endTime || !therapist || loading}
                onPress={handleBooking}
              >
                <Text style={styles.primaryButtonText}>{rescheduleAppointment ? 'Save New Time' : 'Book & Pay'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EBFACF', alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 18, color: '#002324', fontWeight: '700' },
  monthText: { fontSize: 18, fontWeight: '700', color: '#002324' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { width: '14.28%', textAlign: 'center', color: '#A1AD95', fontSize: 12, fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyDay: { width: '14.28%', aspectRatio: 1 },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  todayCell: { backgroundColor: '#EBFACF' },
  pastCell: { opacity: 0.35 },
  dayText: { color: '#002324', fontSize: 15 },
  todayText: { fontWeight: '700' },
  bookingHint: { marginTop: 16, backgroundColor: '#002324', borderRadius: 18, padding: 18 },
  bookingHintTitle: { color: '#EBFACF', fontSize: 18, fontWeight: '700' },
  bookingHintText: { color: '#A1AD95', marginTop: 8, lineHeight: 20 },
  rescheduleBanner: { marginBottom: 16, backgroundColor: '#FFF8E8', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#F6D28B' },
  rescheduleTitle: { color: '#8A5A00', fontSize: 16, fontWeight: '700' },
  rescheduleText: { marginTop: 6, color: '#8A5A00', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 18 },
  modalCard: { backgroundColor: 'white', borderRadius: 20, padding: 18, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324' },
  modalDate: { marginTop: 6, marginBottom: 14, color: '#64748B' },
  therapistList: { maxHeight: 220 },
  therapistOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5DDDE' },
  therapistOptionName: { fontSize: 15, fontWeight: '700', color: '#002324' },
  therapistOptionMeta: { marginTop: 4, color: '#64748B' },
  selectedTherapist: { backgroundColor: '#FAF9F7', borderWidth: 1, borderColor: '#E5DDDE', borderRadius: 14, padding: 12, marginBottom: 14 },
  selectedTherapistText: { color: '#475569' },
  selectedTherapistMeta: { marginTop: 6, color: '#64748B', fontSize: 12 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#002324', marginBottom: 10 },
  unavailableDayText: { marginBottom: 10, color: '#B45309' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  slotButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E5DDDE', backgroundColor: '#FAF9F7' },
  slotDisabled: { opacity: 0.35 },
  slotSelected: { backgroundColor: '#002324', borderColor: '#002324' },
  slotText: { color: '#002324', fontSize: 12 },
  slotSelectedText: { color: '#EBFACF' },
  selectionText: { fontSize: 13, color: '#475569', marginBottom: 4 },
  priceText: { fontSize: 16, fontWeight: '700', color: '#002324', marginVertical: 8 },
  textArea: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 14,
    padding: 12,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  secondaryButton: { flex: 1, borderWidth: 1, borderColor: '#002324', borderRadius: 24, paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { color: '#002324', fontWeight: '600' },
  primaryButton: { flex: 1, backgroundColor: '#002324', borderRadius: 24, paddingVertical: 12, alignItems: 'center' },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: { color: '#EBFACF', fontWeight: '700' },
});
