import React,{useState} from "react";
import {View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet} from "react-native";

export default function MessagingScreen(){

const [message,setMessage]=useState("");
const [messages,setMessages]=useState([]);

const sendMessage=()=>{

if(message.trim()!==""){

setMessages([...messages,{id:Date.now().toString(),text:message}])
setMessage("")

}

}

return(

<View style={styles.container}>

<FlatList
data={messages}
renderItem={({item})=>(
<Text style={styles.message}>{item.text}</Text>
)}
/>

<View style={styles.inputRow}>

<TextInput
value={message}
onChangeText={setMessage}
placeholder="Type message..."
style={styles.input}
/>

<TouchableOpacity style={styles.button} onPress={sendMessage}>
<Text style={{color:"#fff"}}>Send</Text>
</TouchableOpacity>

</View>

</View>

)
}

const styles=StyleSheet.create({

container:{flex:1,padding:20},

message:{
backgroundColor:"#EBFACF",
padding:10,
borderRadius:10,
marginVertical:5
},

inputRow:{
flexDirection:"row",
marginTop:10
},

input:{
flex:1,
borderWidth:1,
borderColor:"#ccc",
borderRadius:10,
padding:10
},

button:{
backgroundColor:"#002324",
padding:12,
marginLeft:10,
borderRadius:10
}

})