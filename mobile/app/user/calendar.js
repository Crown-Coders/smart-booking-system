import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {

return(

<View style={styles.container}>

<Text style={styles.title}>Upcoming Sessions</Text>

<Calendar
markedDates={{
"2026-03-10": {marked:true, dotColor:"green"},
"2026-03-15": {marked:true, dotColor:"blue"}
}}
/>

</View>

)
}

const styles=StyleSheet.create({

container:{
flex:1,
padding:20
},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20
}

})