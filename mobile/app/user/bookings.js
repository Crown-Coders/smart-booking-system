import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Bookings() {

  const router = useRouter();

  // Temporary data (later this will come from backend)
  const bookings = [
    {
      id: 1,
      therapist: "Dr. Sarah Smith",
      specialization: "Cognitive Therapy",
      date: "10 March 2026",
      time: "14:00 - 15:00",
      status: "Pending"
    },
    {
      id: 2,
      therapist: "Dr. James Brown",
      specialization: "Trauma Therapy",
      date: "15 March 2026",
      time: "11:00 - 12:00",
      status: "Approved"
    },
    {
      id: 3,
      therapist: "Dr. Emily Johnson",
      specialization: "Anxiety & Depression",
      date: "18 March 2026",
      time: "09:00 - 10:00",
      status: "Declined"
    }
  ];

  const getStatusColor = (status) => {
    if (status === "Approved") return "#4CAF50";
    if (status === "Declined") return "#E53935";
    return "#FFA000";
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={styles.background}
      resizeMode="cover"
    >

      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>

          <TouchableOpacity onPress={() => router.push("/user/dashboard")}>
            <MaterialIcons name="arrow-back" size={26} color="#002324"/>
          </TouchableOpacity>

          <Text style={styles.title}>My Bookings</Text>

          <View style={{width:26}}/>
        </View>

        <ScrollView>

          {bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>

              <Text style={styles.therapist}>
                👨‍⚕️ {booking.therapist}
              </Text>

              <Text style={styles.text}>
                🧠 Specialization: {booking.specialization}
              </Text>

              <Text style={styles.text}>
                📅 Date: {booking.date}
              </Text>

              <Text style={styles.text}>
                ⏰ Time: {booking.time}
              </Text>

              <Text
                style={[
                  styles.status,
                  { color: getStatusColor(booking.status) }
                ]}
              >
                Status: {booking.status}
              </Text>

            </View>
          ))}

        </ScrollView>

      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background:{
    flex:1
  },

  container:{
    flex:1,
    padding:20
  },

  header:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:20
  },

  title:{
    fontSize:22,
    fontWeight:"700",
    color:"#002324"
  },

  card:{
    backgroundColor:"rgba(255,255,255,0.92)",
    padding:18,
    borderRadius:18,
    marginBottom:15,
    shadowColor:"#000",
    shadowOpacity:0.15,
    shadowOffset:{width:0,height:4},
    shadowRadius:8,
    elevation:5
  },

  therapist:{
    fontSize:16,
    fontWeight:"700",
    marginBottom:6,
    color:"#002324"
  },

  text:{
    fontSize:14,
    color:"#4E5E5B",
    marginBottom:3
  },

  status:{
    marginTop:8,
    fontWeight:"700",
    fontSize:15
  }

});