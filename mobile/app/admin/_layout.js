import { Drawer } from "expo-router/drawer";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminLayout() {

return (

<Drawer
screenOptions={{
headerShown:false,
drawerActiveTintColor:"#2F5D50"
}}
>

<Drawer.Screen
name="dashboard"
options={{
title:"Dashboard",
drawerIcon:({size,color})=>(
<MaterialIcons name="dashboard" size={size} color={color}/>
)
}}
/>

<Drawer.Screen
name="bookings"
options={{
title:"Bookings",
drawerIcon:({size,color})=>(
<MaterialIcons name="event" size={size} color={color}/>
)
}}
/>

<Drawer.Screen
name="calendar"
options={{
title:"Calendar",
drawerIcon:({size,color})=>(
<MaterialIcons name="calendar-month" size={size} color={color}/>
)
}}
/>

<Drawer.Screen
name="messaging"
options={{
title:"Messaging",
drawerIcon:({size,color})=>(
<MaterialIcons name="chat" size={size} color={color}/>
)
}}
/>

<Drawer.Screen
name="ai-chatbot"
options={{
title:"AI Chatbot",
drawerIcon:({size,color})=>(
<MaterialIcons name="smart-toy" size={size} color={color}/>
)
}}
/>

</Drawer>

)
}