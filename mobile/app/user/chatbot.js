import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function Chatbot(){

const [message,setMessage] = useState("");
const [reply,setReply] = useState("");

const askBot = () => {

if(message.toLowerCase().includes("book"))
setReply("You can book a session from the Services page.");

else if(message.toLowerCase().includes("service"))
setReply("We offer Cognitive Therapy, Behavior Therapy and Group Therapy.");

else
setReply("I can help you with bookings and services.");

};

return(

<View style={{padding:20}}>

<Text style={{fontSize:22}}>AI Assistant</Text>

<TextInput
placeholder="Ask a question..."
value={message}
onChangeText={setMessage}
style={{borderWidth:1,padding:10,marginTop:20}}
/>

<TouchableOpacity
style={{backgroundColor:"blue",padding:10,marginTop:10}}
onPress={askBot}
>
<Text style={{color:"white"}}>Send</Text>
</TouchableOpacity>

<Text style={{marginTop:20}}>Bot: {reply}</Text>

</View>

)
}