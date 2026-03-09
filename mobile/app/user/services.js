import React, { useState } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
Image,
ImageBackground
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Services() {

const router = useRouter();
const [selectedService, setSelectedService] = useState(null);

const services = [
{
name: "Educational Psychologist",
description: "Helps learners overcome academic and learning difficulties."
},

{
name: "Couple Therapy",
description: "Supports couples to improve communication and relationships."
},

{
name: "Occupational Therapist",
description: "Helps patients regain independence in daily activities."
},

{
name: "Speech and Language Therapy",
description: "Supports speech, language and communication development."
},

{
name: "Family Therapist",
description: "Helps families resolve conflicts and improve relationships."
},

{
name: "Counselling",
description: "Provides emotional support and personal guidance."
},

{
name: "Trauma Counselling",
description: "Helps individuals recover from trauma and PTSD."
}

];

const therapists = {
"Educational Psychologist":[
{
name:"Dr Sarah Smith",
rating:"4.9",
experience:"8 years",
hpcsa:"PS123456",
specialization:"Child Learning & Development",
image:"https://randomuser.me/api/portraits/women/44.jpg"
},
{
name:"Dr Daniel Jacobs",
rating:"4.7",
experience:"6 years",
hpcsa:"PS654321",
specialization:"School Psychology",
image:"https://randomuser.me/api/portraits/men/32.jpg"
}
],

"Couple Therapy":[
{
name:"Dr Emily Brown",
rating:"4.8",
experience:"7 years",
hpcsa:"PS453267",
specialization:"Marriage Therapy",
image:"https://randomuser.me/api/portraits/women/65.jpg"
}
],

"Occupational Therapist":[
{
name:"Dr Raj Naidoo",
rating:"4.9",
experience:"10 years",
hpcsa:"OT987654",
specialization:"Rehabilitation Therapy",
image:"https://randomuser.me/api/portraits/men/41.jpg"
}
],

"Speech and Language Therapy":[
{
name:"Dr Lisa Adams",
rating:"4.8",
experience:"9 years",
hpcsa:"SLT778899",
specialization:"Speech Development",
image:"https://randomuser.me/api/portraits/women/68.jpg"
}
],

"Family Therapist":[
{
name:"Dr Thabo Mokoena",
rating:"4.7",
experience:"11 years",
hpcsa:"FT998877",
specialization:"Family Conflict Therapy",
image:"https://randomuser.me/api/portraits/men/22.jpg"
}
],

"Counselling":[
{
name:"Dr Grace Williams",
rating:"4.9",
experience:"12 years",
hpcsa:"CS556677",
specialization:"Mental Health Counselling",
image:"https://randomuser.me/api/portraits/women/12.jpg"
}
],

"Trauma Counselling":[
{
name:"Dr Sipho Nkosi",
rating:"5.0",
experience:"14 years",
hpcsa:"TC112233",
specialization:"Trauma & PTSD",
image:"https://randomuser.me/api/portraits/men/11.jpg"
}
]
};

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={styles.background}
resizeMode="cover"
>

<ScrollView contentContainerStyle={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<TouchableOpacity onPress={()=>router.back()}>
<MaterialIcons name="arrow-back" size={28} color="#002324"/>
</TouchableOpacity>

<Text style={styles.headerTitle}>Browse Services</Text>

<View style={{width:30}}/>

</View>


{/* SERVICES GRID */}

{!selectedService && (

<View style={styles.grid}>

{services.map((service,index)=>(

<TouchableOpacity
key={index}
style={styles.serviceCard}
onPress={()=>setSelectedService(service.name)}
>

<MaterialIcons name="healing" size={36} color="#2F5D50"/>

<Text style={styles.serviceTitle}>{service.name}</Text>

<Text style={styles.description}>
{service.description}
</Text>

</TouchableOpacity>

))}

</View>

)}



{/* THERAPISTS */}

{selectedService && (

<View>

<View style={styles.therapistHeader}>

<TouchableOpacity onPress={()=>setSelectedService(null)}>
<MaterialIcons name="arrow-back" size={24} color="#002324"/>
</TouchableOpacity>

<Text style={styles.sectionTitle}>
{selectedService}
</Text>

</View>


{therapists[selectedService].map((therapist,index)=>(

<View key={index} style={styles.therapistCard}>

<Image
source={{uri:therapist.image}}
style={styles.image}
/>

<View style={{flex:1}}>

<Text style={styles.therapistName}>
{therapist.name}
</Text>

<Text style={styles.specialization}>
{therapist.specialization}
</Text>

<Text style={styles.info}>
⭐ {therapist.rating} | {therapist.experience}
</Text>

<Text style={styles.info}>
HPCSA: {therapist.hpcsa}
</Text>

<TouchableOpacity
style={styles.bookButton}
onPress={()=>router.push("/user/booking")}
>

<Text style={styles.bookText}>
Book Session
</Text>

</TouchableOpacity>

</View>

</View>

))}

</View>

)}

</ScrollView>

</ImageBackground>

);

}



const styles = StyleSheet.create({

background:{
flex:1
},

container:{
padding:20
},

header:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
marginBottom:25
},

headerTitle:{
fontSize:20,
fontWeight:"700",
color:"#002324"
},

grid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

serviceCard:{
width:"48%",
backgroundColor:"rgba(255,255,255,0.92)",
padding:18,
borderRadius:20,
marginBottom:15,
alignItems:"center",

shadowColor:"#000",
shadowOpacity:0.15,
shadowOffset:{width:0,height:4},
shadowRadius:8,
elevation:5
},

serviceTitle:{
fontSize:15,
fontWeight:"700",
textAlign:"center",
marginTop:8,
color:"#002324"
},

description:{
fontSize:12,
textAlign:"center",
marginTop:6,
color:"#4E5E5B"
},

therapistHeader:{
flexDirection:"row",
alignItems:"center",
gap:10,
marginBottom:20
},

sectionTitle:{
fontSize:18,
fontWeight:"700",
color:"#002324"
},

therapistCard:{
flexDirection:"row",
backgroundColor:"rgba(255,255,255,0.95)",
padding:15,
borderRadius:18,
marginBottom:15,

shadowColor:"#000",
shadowOpacity:0.15,
shadowOffset:{width:0,height:4},
shadowRadius:8,
elevation:5
},

image:{
width:70,
height:70,
borderRadius:50,
marginRight:15
},

therapistName:{
fontSize:16,
fontWeight:"700",
color:"#002324"
},

specialization:{
fontSize:13,
color:"#4E5E5B",
marginBottom:3
},

info:{
fontSize:12,
color:"#4E5E5B"
},

bookButton:{
marginTop:8,
backgroundColor:"#2F5D50",
paddingVertical:6,
paddingHorizontal:12,
borderRadius:10,
alignSelf:"flex-start"
},

bookText:{
color:"#fff",
fontSize:12,
fontWeight:"600"
}

});