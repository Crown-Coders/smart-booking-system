import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ImageBackground
} from "react-native";

export default function Therapists(){

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={{flex:1}}
resizeMode="cover"
>

<ScrollView style={styles.container}>

<Text style={styles.title}>Therapists</Text>

<TouchableOpacity style={styles.addBtn}>
<Text style={styles.addText}>+ Add Therapist</Text>
</TouchableOpacity>

<View style={styles.card}>

<Text style={styles.name}>Dr Sarah Smith</Text>
<Text>Specialisation: Trauma Therapy</Text>
<Text>Experience: 8 Years</Text>
<Text>HPCSA: PSY123456</Text>
<Text>Bio: Specialist in trauma recovery</Text>

</View>

</ScrollView>

</ImageBackground>

);
}

const styles = StyleSheet.create({

container:{padding:20},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:15,
color:"#002324"
},

addBtn:{
backgroundColor:"#002324",
padding:12,
borderRadius:10,
marginBottom:20,
alignItems:"center"
},

addText:{
color:"#EBFACF",
fontWeight:"bold"
},

card:{
backgroundColor:"rgba(255,255,255,0.9)",
padding:18,
borderRadius:18
},

name:{
fontWeight:"bold",
fontSize:16
}

});