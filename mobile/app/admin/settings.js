import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ImageBackground
} from "react-native";

export default function Settings(){

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={{flex:1}}
resizeMode="cover"
>

<ScrollView style={styles.container}>

<Text style={styles.title}>System Settings</Text>

<TouchableOpacity style={styles.card}>
<Text style={styles.text}>Change Admin Password</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card}>
<Text style={styles.text}>Manage Notifications</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card}>
<Text style={styles.text}>Backup System Data</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.card}>
<Text style={styles.text}>System Logs</Text>
</TouchableOpacity>

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

card:{
backgroundColor:"rgba(255,255,255,0.9)",
padding:18,
borderRadius:18,
marginBottom:15
},

text:{
fontSize:16,
color:"#002324"
}

});