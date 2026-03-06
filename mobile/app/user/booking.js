import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

// Sample therapists with images
const therapists = [
  {
    id: "1",
    name: "Dr. John Smith",
    specialization: "Cognitive Therapy",
    experience: 8,
    qualification: "PhD in Clinical Psychology",
    license: "HPCSA-123456",
    availability: ["09:00", "11:00", "14:00", "16:00"],
    image: require("../../assets/images/splash.png")
  },
  {
    id: "2",
    name: "Dr. Jane Doe",
    specialization: "Behavioral Therapy",
    experience: 5,
    qualification: "MSc in Psychology",
    license: "HPCSA-654321",
    availability: ["10:00", "13:00", "15:00"],
    image: require("../../assets/images/splash.png")
  }
];

// Sample dates
const availableDates = [
  new Date(),
  new Date(new Date().setDate(new Date().getDate() + 1)),
  new Date(new Date().setDate(new Date().getDate() + 2)),
];

export default function Booking() {
  const router = useRouter();
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [comment, setComment] = useState("");
  const [imageZoomVisible, setImageZoomVisible] = useState(false);

  const openTherapistModal = (therapist) => {
    setSelectedTherapist(therapist);
    setModalVisible(true);
  };

  const bookSession = () => {
    if (!selectedTherapist) return;
    alert(
      `Booking confirmed with ${selectedTherapist.name} on ${selectedDate.toDateString()} at ${selectedTime}\nComment: ${comment}`
    );
    setComment("");
    setSelectedTime("");
    setSelectedTherapist(null);
    setModalVisible(false);
  };

  const renderTherapist = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openTherapistModal(item)}
    >
      <Image source={item.image} style={styles.therapistImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardText}>{item.specialization}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push("/user/dashboard")}>
            <MaterialIcons name="arrow-back" size={28} color="#002324" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Book a Session</Text>
        </View>

        {/* Therapist Carousel */}
        <Text style={styles.sectionTitle}>Select a Therapist</Text>
        <FlatList
          data={therapists}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderTherapist}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, gap: 15 }}
        />

        {!selectedTherapist && (
          <Text style={{ marginTop: 20, textAlign: "center", color: "#002324" }}>
            Select a therapist to see booking options
          </Text>
        )}

        {/* Modal */}
        {selectedTherapist && modalVisible && (
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {/* Zoomable Image */}
                <TouchableOpacity onPress={() => setImageZoomVisible(true)}>
                  <Image
                    source={selectedTherapist.image}
                    style={styles.modalImage}
                  />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>{selectedTherapist.name}</Text>
                <Text style={styles.modalText}>
                  Specialization: {selectedTherapist.specialization}
                </Text>
                <Text style={styles.modalText}>
                  Experience: {selectedTherapist.experience} years
                </Text>
                <Text style={styles.modalText}>
                  Qualification: {selectedTherapist.qualification}
                </Text>
                <Text style={styles.modalText}>License #: {selectedTherapist.license}</Text>

                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Select Date</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedDate}
                    onValueChange={(itemValue) => setSelectedDate(itemValue)}
                  >
                    {availableDates.map((date, index) => (
                      <Picker.Item
                        key={index}
                        label={date.toDateString()}
                        value={date}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Select Time</Text>
                <View style={styles.timeRow}>
                  {selectedTherapist.availability.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeButton, selectedTime === time && styles.timeSelected]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[styles.timeText, selectedTime === time && { color: "#fff" }]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Add Comment</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={comment}
                  onChangeText={setComment}
                  multiline
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={bookSession}
                    disabled={!selectedTime}
                  >
                    <Text style={styles.buttonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Image Zoom Modal */}
        {selectedTherapist && imageZoomVisible && (
          <Modal visible={imageZoomVisible} transparent animationType="fade">
            <TouchableOpacity
              style={styles.zoomBackground}
              onPress={() => setImageZoomVisible(false)}
            >
              <Image
                source={selectedTherapist.image}
                style={styles.zoomImage}
              />
            </TouchableOpacity>
          </Modal>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20, paddingBottom: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  headerText: { fontSize: 26, fontWeight: "700", color: "#002324" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#002324", marginBottom: 10 },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width: 140
  },
  therapistImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#002324" },
  cardText: { fontSize: 13, color: "#5E6F6C" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalImage: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#002324", textAlign: "center", marginBottom: 10 },
  modalText: { fontSize: 14, color: "#4E5E5B", marginBottom: 5, textAlign: "center" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  timeButton: { padding: 10, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#2F5D50", marginRight: 10, marginBottom: 10 },
  timeSelected: { backgroundColor: "#2F5D50" },
  timeText: { color: "#2F5D50", fontWeight: "600" },
  commentInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, minHeight: 60, textAlignVertical: "top" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { backgroundColor: "#ccc", padding: 12, borderRadius: 10, flex: 1, marginRight: 10, alignItems: "center" },
  bookButton: { backgroundColor: "#2F5D50", padding: 12, borderRadius: 10, flex: 1, marginLeft: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  zoomBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  zoomImage: { width: 300, height: 300, borderRadius: 150 }
});