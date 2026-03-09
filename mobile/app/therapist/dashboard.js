import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
  Switch
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [available, setAvailable] = useState(true);

  const [profile, setProfile] = useState({
    name: "Dr Sarah Smith",
    email: "sarah@therapy.com",
    phone: "0820000000",
    id: "9001010000000",
    specialization: "Trauma Therapy",
    qualification: "PhD Psychology",
    experience: "8",
    license: "HPCSA12345",
    bio: "Helping patients recover from trauma."
  });

  const [requests, setRequests] = useState([
    { id: 1, patient: "John Doe", date: "12 March", time: "14:00", status: "Pending" },
    { id: 2, patient: "Emily Brown", date: "15 March", time: "10:00", status: "Pending" }
  ]);

  const [history] = useState([
    { id: 1, patient: "Anna White", date: "2 March", result: "Completed" },
    { id: 2, patient: "Mark Lee", date: "5 March", result: "Completed" }
  ]);

  const [slots] = useState([
    { id: 1, day: "Monday", time: "10:00 - 11:00" },
    { id: 2, day: "Wednesday", time: "14:00 - 15:00" }
  ]);

  const acceptRequest = (id) => {
    setRequests(requests.map(r => (r.id === id ? { ...r, status: "Accepted" } : r)));
  };

  const rejectRequest = (id) => {
    setRequests(requests.map(r => (r.id === id ? { ...r, status: "Rejected" } : r)));
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <MaterialIcons name="menu" size={28} color="#002324" />
          </TouchableOpacity>
          <Text style={styles.title}>Therapist Dashboard</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* DRAWER */}
        {drawerOpen && (
          <View style={styles.drawer}>
            <TouchableOpacity style={styles.close} onPress={() => setDrawerOpen(false)}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("dashboard"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("profile"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("totalsessions"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Total Sessions</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("upcoming"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Upcoming Sessions</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("history"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Booking History</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("availability"); setDrawerOpen(false); }}>
              <Text style={styles.item}>Availability Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setScreen("chatbot"); setDrawerOpen(false); }}>
              <Text style={styles.item}>AI Chatbot</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={{ marginTop: 20 }}>
          {/* DASHBOARD */}
          {screen === "dashboard" && (
            <View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.card} onPress={() => setScreen("totalsessions")}>
                  <Text>Total Sessions</Text>
                  <Text style={styles.number}>{requests.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => setScreen("upcoming")}>
                  <Text>Upcoming</Text>
                  <Text style={styles.number}>{requests.length}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={styles.card} onPress={() => setScreen("history")}>
                  <Text>Booking History</Text>
                  <Text style={styles.number}>{history.length}</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                  <Text>Availability</Text>
                  <Switch value={available} onValueChange={() => setAvailable(!available)} />
                  <Text>{available ? "Online" : "Offline"}</Text>
                </View>
              </View>
            </View>
          )}

          {/* TOTAL SESSIONS */}
          {screen === "totalsessions" && (
            <View>
              <Text style={styles.section}>Total Sessions</Text>
              {requests.map(r => (
                <View key={r.id} style={styles.list}>
                  <Text>Patient: {r.patient}</Text>
                  <Text>Date: {r.date}</Text>
                  <Text>Time: {r.time}</Text>
                  <Text>Status: {r.status}</Text>

                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.accept} onPress={() => acceptRequest(r.id)}>
                      <Text style={styles.btn}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reject} onPress={() => rejectRequest(r.id)}>
                      <Text style={styles.btn}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* UPCOMING */}
          {screen === "upcoming" && (
            <View>
              <Text style={styles.section}>Upcoming Sessions</Text>
              {requests.filter(r => r.status === "Accepted").map(r => (
                <View key={r.id} style={styles.list}>
                  <Text>Patient: {r.patient}</Text>
                  <Text>Date: {r.date}</Text>
                  <Text>Time: {r.time}</Text>
                </View>
              ))}
            </View>
          )}

          {/* HISTORY */}
          {screen === "history" && (
            <View>
              <Text style={styles.section}>Session History</Text>
              {history.map(h => (
                <View key={h.id} style={styles.list}>
                  <Text>Patient: {h.patient}</Text>
                  <Text>Date: {h.date}</Text>
                  <Text>Status: {h.result}</Text>
                </View>
              ))}
            </View>
          )}

          {/* PROFILE */}
          {screen === "profile" && (
            <View>
              <Text style={styles.section}>Profile</Text>
              {Object.keys(profile).map(key => (
                <TextInput
                  key={key}
                  style={styles.input}
                  value={profile[key]}
                  onChangeText={text => setProfile({ ...profile, [key]: text })}
                />
              ))}
            </View>
          )}

          {/* AVAILABILITY */}
          {screen === "availability" && (
            <View>
              <Text style={styles.section}>Availability Slots</Text>
              {slots.map(s => (
                <View key={s.id} style={styles.list}>
                  <Text>{s.day}</Text>
                  <Text>{s.time}</Text>
                </View>
              ))}
            </View>
          )}

          {/* CHATBOT */}
          {screen === "chatbot" && (
            <View>
              <Text style={styles.section}>AI Chatbot</Text>
              <View style={styles.chat}>
                <Text>User: Hello</Text>
                <Text>AI: How can I help you today?</Text>
              </View>
              <TextInput placeholder="Type message..." style={styles.input} />
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", color: "#002324" },
  drawer: { position: "absolute", left: 0, top: 0, bottom: 0, width: 250, backgroundColor: "#fff", padding: 20, zIndex: 10 },
  close: { alignSelf: "flex-end", marginBottom: 20 },
  item: { fontSize: 16, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  card: { backgroundColor: "rgba(255,255,255,0.9)", width: "48%", padding: 18, borderRadius: 15, alignItems: "center" },
  number: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
  section: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  list: { backgroundColor: "rgba(255,255,255,0.9)", padding: 15, borderRadius: 12, marginBottom: 10 },
  actions: { flexDirection: "row", marginTop: 10 },
  accept: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 8, marginRight: 10 },
  reject: { backgroundColor: "#E53935", padding: 8, borderRadius: 8 },
  btn: { color: "#fff", fontWeight: "bold" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10 },
  chat: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 }
});