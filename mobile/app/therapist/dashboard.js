import { View, Text, FlatList } from "react-native";
import { bookings } from "../../data/DummyData";

export default function TherapistDashboard(){

return(
<View style={{padding:20}}>

<Text style={{fontSize:24,fontWeight:"bold"}}>
Therapist Dashboard
</Text>

<FlatList
data={bookings}
keyExtractor={(item)=>item.id.toString()}
renderItem={({item})=>(
<View style={{backgroundColor:"#eee",padding:15,marginTop:10}}>
<Text>Client: {item.user}</Text>
<Text>Session: {item.service}</Text>
<Text>Date: {item.date}</Text>
</View>
)}
/>

</View>
)
}