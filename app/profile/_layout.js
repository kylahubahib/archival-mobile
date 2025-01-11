import { Stack } from "expo-router";



export default function RootLayout() {
    return <Stack>
        <Stack.Screen name="ProfileScreen" options={{
            headerShown: false,
        }} />
        <Stack.Screen name="profile_info" options={{
            headerShown: false,
        }} />
        


    </Stack>;
}