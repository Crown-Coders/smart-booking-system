import { View, Text, FlatList } from "react-native";
import { bookings } from "../../data/DummyData";

export default function Bookings(){

return(
<View style={{padding:20}}>

<Text style={{fontSize:24}}>My Bookings</Text>

<FlatList
data={bookings}
keyExtractor={(item)=>item.id.toString()}
renderItem={({item})=>(
<View style={{backgroundColor:"#eee",padding:15,marginTop:10}}>

<Text>Service: {item.service}</Text>
<Text>Date: {item.date}</Text>
<Text>Status: {item.status}</Text>

</View>
)}
/>

</View>
)
}