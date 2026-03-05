import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Booking(){

const router = useRouter();
const { service } = useLocalSearchParams();

return(
<View style={{flex:1,alignItems:"center",justifyContent:"center"}}>

<Text style={{fontSize:22}}>Booking</Text>

<Text style={{marginTop:20}}>Service Selected:</Text>
<Text style={{fontSize:18}}>{service}</Text>

<Text style={{marginTop:20}}>Available Slot (Demo)</Text>
<Text>10:00 AM</Text>

<TouchableOpacity
style={{backgroundColor:"green",padding:12,marginTop:20}}
onPress={()=>router.push("/user/bookings")}
>
<Text style={{color:"white"}}>Confirm Booking</Text>
</TouchableOpacity>

</View>
)
}