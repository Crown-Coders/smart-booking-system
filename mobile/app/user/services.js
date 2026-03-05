import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { services } from "../../data/DummyData";

export default function Services(){

const router = useRouter();

return(
<View style={{padding:20}}>

<Text style={{fontSize:24}}>Available Services</Text>

<FlatList
data={services}
keyExtractor={(item)=>item.id.toString()}
renderItem={({item})=>(
<TouchableOpacity
style={{backgroundColor:"#eee",padding:20,marginTop:10}}
onPress={()=>router.push({
pathname:"/user/booking",
params:{service:item.name}
})}
>

<Text style={{fontSize:18}}>{item.name}</Text>
<Text>{item.duration} minutes</Text>

</TouchableOpacity>
)}
/>

</View>
)
}