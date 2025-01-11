import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return <Tabs screenOptions={{tabBarActiveTintColor: "#294996", }}>
        {/* <Tabs.Screen name="library/library" options={{title: "Library",
        tabBarIcon: ({color})=> <MaterialIcons name="local-library" size={23} color={color} />}} />
        <Tabs.Screen name="class/class" options={{title: "Class",
        tabBarIcon: ({color})=> <MaterialIcons name="class" size={23} color={color} />}}  />
         <Tabs.Screen name="forum/forum" options={{title: "Forum",
        tabBarIcon: ({color})=> <MaterialCommunityIcons name="forum" size={23} color={color} />}}  />
         <Tabs.Screen name="chat/chat" options={{title: "Chat",
        tabBarIcon: ({color})=> <MaterialCommunityIcons name="chat" size={23} color={color} />}}  /> */}
        {/* <Tabs.Screen name="profile/profile" options={{title: "Profile",
        tabBarIcon: ({color})=> <FontAwesome name="user" size={23} color={color} />}}  /> */}
    </Tabs>;
}