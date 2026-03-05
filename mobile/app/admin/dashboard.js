import { View, Text, FlatList } from "react-native";
import { bookings } from "../../data/DummyData";

export default function AdminDashboard(){

return(
<View style={{padding:20}}>

<Text style={{fontSize:24,fontWeight:"bold"}}>
Admin Dashboard
</Text>

<FlatList
data={bookings}
keyExtractor={(item)=>item.id.toString()}
renderItem={({item})=>(
<View style={{backgroundColor:"#eee",padding:15,marginTop:10}}>
<Text>User: {item.user}</Text>
<Text>Service: {item.service}</Text>
<Text>Status: {item.status}</Text>
</View>
)}
/>

</View>
)
}