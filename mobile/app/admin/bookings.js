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

export default function Bookings(){

const bookings = [
{
id:1,
patient:"John Doe",
therapist:"Dr Sarah Smith",
date:"10 March 2026",
time:"14:00",
status:"Pending",
payment:"Paid",
amount:"R500",
notes:"First session"
},
{
id:2,
patient:"Emily Brown",
therapist:"Dr James Brown",
date:"12 March 2026",
time:"10:00",
status:"Confirmed",
payment:"Pending",
amount:"R450",
notes:"Follow up"
}
];

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={styles.background}
resizeMode="cover"
>

<ScrollView style={styles.container}>

<Text style={styles.title}>All Bookings</Text>

{bookings.map((booking)=>(
<View key={booking.id} style={styles.card}>

<Text style={styles.name}>Patient: {booking.patient}</Text>
<Text>Therapist: {booking.therapist}</Text>
<Text>Date: {booking.date}</Text>
<Text>Time: {booking.time}</Text>
<Text>Status: {booking.status}</Text>
<Text>Payment: {booking.payment}</Text>
<Text>Amount: {booking.amount}</Text>
<Text>Notes: {booking.notes}</Text>

<View style={styles.actions}>

<TouchableOpacity style={styles.approve}>
<Text style={styles.btnText}>Approve</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.edit}>
<Text style={styles.btnText}>Edit</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.delete}>
<Text style={styles.btnText}>Delete</Text>
</TouchableOpacity>

</View>

</View>
))}

</ScrollView>

</ImageBackground>

);
}

const styles = StyleSheet.create({

background:{flex:1},

container:{padding:20},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20,
color:"#002324"
},

card:{
backgroundColor:"rgba(255,255,255,0.9)",
padding:18,
borderRadius:18,
marginBottom:15
},

name:{
fontWeight:"bold",
fontSize:16
},

actions:{
flexDirection:"row",
marginTop:10,
justifyContent:"space-between"
},

approve:{
backgroundColor:"#4CAF50",
padding:8,
borderRadius:8
},

edit:{
backgroundColor:"#FFC107",
padding:8,
borderRadius:8
},

delete:{
backgroundColor:"#E53935",
padding:8,
borderRadius:8
},

btnText:{
color:"#fff",
fontWeight:"bold"
}

});