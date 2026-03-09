import React,{useState} from "react";
import {
View,
Text,
StyleSheet,
TextInput,
TouchableOpacity,
ImageBackground
} from "react-native";

export default function AIChatbot(){

const [message,setMessage]=useState("");
const [chat,setChat]=useState([]);

const sendMessage=()=>{

if(message==="") return;

setChat([...chat,{user:message,bot:"AI response coming soon"}]);
setMessage("");

};

return(

<ImageBackground
source={require("../../assets/images/splash.png")}
style={{flex:1}}
resizeMode="cover"
>

<View style={styles.container}>

<Text style={styles.title}>AI Chatbot</Text>

<View style={styles.chatBox}>

{chat.map((c,index)=>(
<View key={index}>
<Text style={styles.user}>You: {c.user}</Text>
<Text style={styles.bot}>AI: {c.bot}</Text>
</View>
))}

</View>

<View style={styles.inputRow}>

<TextInput
style={styles.input}
placeholder="Ask AI something..."
value={message}
onChangeText={setMessage}
/>

<TouchableOpacity style={styles.send} onPress={sendMessage}>
<Text style={{color:"#fff"}}>Send</Text>
</TouchableOpacity>

</View>

</View>

</ImageBackground>

);
}

const styles=StyleSheet.create({

container:{flex:1,padding:20},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20,
color:"#002324"
},

chatBox:{
flex:1,
marginBottom:10
},

user:{
color:"#002324",
marginBottom:4
},

bot:{
color:"#4E5E5B",
marginBottom:10
},

inputRow:{
flexDirection:"row"
},

input:{
flex:1,
backgroundColor:"#fff",
padding:10,
borderRadius:10
},

send:{
backgroundColor:"#002324",
padding:12,
borderRadius:10,
marginLeft:5
}

});