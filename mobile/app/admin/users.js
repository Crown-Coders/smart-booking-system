import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ImageBackground
} from "react-native";

export default function Users(){

const users = [
{
id:1,
name:"John Doe",
email:"john@email.com",
role:"Client",
date:"1 March 2026",
status:"Active"
},
{
id:2,
name:"Dr Sarah Smith",
email:"sarah@email.com",
role:"Therapist",
date:"5 March 2026",
status:"Inactive"
}
];

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={{flex:1}}
resizeMode="cover"
>

<ScrollView style={styles.container}>

<Text style={styles.title}>Users Management</Text>

<TouchableOpacity style={styles.addBtn}>
<Text style={styles.addText}>+ Add User</Text>
</TouchableOpacity>

{users.map((user)=>(
<View key={user.id} style={styles.card}>

<Text style={styles.name}>{user.name}</Text>
<Text>{user.email}</Text>
<Text>Role: {user.role}</Text>
<Text>Date Joined: {user.date}</Text>
<Text>Status: {user.status}</Text>

<View style={styles.actions}>

<TouchableOpacity style={styles.edit}>
<Text style={styles.btn}>Edit</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.activate}>
<Text style={styles.btn}>Activate</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.deactivate}>
<Text style={styles.btn}>Deactivate</Text>
</TouchableOpacity>

</View>

</View>
))}

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

edit:{
backgroundColor:"#FFC107",
padding:8,
borderRadius:8
},

activate:{
backgroundColor:"#4CAF50",
padding:8,
borderRadius:8
},

deactivate:{
backgroundColor:"#E53935",
padding:8,
borderRadius:8
},

btn:{
color:"#fff",
fontWeight:"bold"
}

});