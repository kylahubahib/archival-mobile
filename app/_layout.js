import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { IconButton } from "react-native-paper";
import AuthContext from "./context/AuthContext";
import { loadUser } from "./services/AuthService";
import { useState, useEffect } from "react";


export default function RootLayout() {
    const [user, setUser] = useState();

    useEffect(() => {
      async function runEffect() {
        try {
          const user = await loadUser();
          setUser(user);
        } catch (e) {
            console.log("Failed to load user", e);
        }
      }

      runEffect();
    }, [])

    return <AuthContext.Provider value={{user, setUser}}>
         <Stack>
        <Stack.Screen name="index" options={{
            headerShown: false,
        }} />
         <Stack.Screen name="login" options={{
            headerShown: false,
        }} />
        <Stack.Screen name="register" options={{
            headerTitle: "Register"
        }} />
        <Stack.Screen name="(drawers)" options={{
            headerShown: false,
            headerBackButtonMenuEnabled: false,
           

        }}/>
       <Stack.Screen name="forum/create_post" options={{
            headerTitle: "Create Post",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }} />
        <Stack.Screen name="forum/view_post/[postId]" options={{
            headerTitle: "Post",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>
         <Stack.Screen name="class/task/[taskId]/[sectionId]" options={{
            headerTitle: "Task Instruction",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>

        <Stack.Screen name="class/people/[sectionId]" options={{
            headerTitle: "Members",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>

          <Stack.Screen name="class/upload_capstone" options={{
            headerTitle: "Upload",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }} />
        <Stack.Screen name="class/track" options={{
            headerTitle: "Track",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>
        <Stack.Screen name="profile" options={{
            headerTitle: "Profile",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>
         <Stack.Screen name="library/manuscript/[manuscriptId]" options={{ 
            headerTitle: "Details",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>
        <Stack.Screen name="notification/Notification" options={{ 
            headerTitle: "Notifications",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>
        <Stack.Screen name="forgot_password" options={{
            headerTitle: "Forgot Password?",
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "#294996"
            }
        }}/>



    </Stack>
    </AuthContext.Provider>
   
}