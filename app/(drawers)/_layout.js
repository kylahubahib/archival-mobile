import { FontAwesome, FontAwesome5, FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Drawer from "expo-router/drawer";
import { Image, SafeAreaView, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Avatar, IconButton, Provider as PaperProvider, TouchableRipple } from "react-native-paper";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { url } from "../../utils/utils";
import { loadUser } from "../services/AuthService";
import { setToken } from "../services/TokenService";


export default function DrawerLayout() {
  const [ user, setUser ] = useState(null); 

  useEffect(() => {
    getUser();
  },[user])

  const getUser = async () => {
    const response = await loadUser();
    setUser(response);
  }

  // console.log('This is the user: ', user);

  const navigateProfile = () => {
    console.log('press');
    router.push("/profile/ProfileScreen");
  } 

  const handleLogout = async () => {
    try {
      await setToken(null);
      setUser(null); 
      router.replace("/login"); 
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out. Please try again.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: "left",
          drawerType: "front",
          drawerStyle: {
            width: 250,
          },
          headerStyle: {
            backgroundColor: "#294996",
          },
          headerTintColor: "white",
          drawerActiveTintColor: "#294996",
          drawerInactiveTintColor: "#606060",
          drawerActiveBackgroundColor: "#e0e7ff", 
          drawerItemStyle: {
            borderRadius: 10, 
          },
          headerRight: () => (
            <IconButton 
              icon={() => <Ionicons name="notifications" size={23} color="white" />}
              onPress={() => router.push("/notification/Notification")} 
            />
          ),
        }}
        drawerContent={(props) => {
          return ( 
            <DrawerContentScrollView {...props}>
              <SafeAreaView>
                <TouchableRipple onPress={() => navigateProfile()}>
                  <View
                    style={{
                      height: 200,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBottom: 50,
                      marginTop: 50,
                    }}
                  >
                    <Image
                      style={{
                        height: 130,
                        width: 130,
                        borderRadius: 999,
                        backgroundColor: "#606060",
                        borderWidth: 8,
                        borderColor: "#294996"
                      }}
                      source={{
                        uri: user?.user_pic
                          ? `${url.BASE_URL}/${user?.user_pic}`
                          : 'https://ui-avatars.com/api/?name=Anonymous&background=random',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 22,
                        color: "black",
                        fontWeight: "bold",
                        marginVertical: 7,
                      }}
                    >
                      {user?.name || 'User'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#606060",
                      }}
                    >
                      {user?.email || 'email@gmail.com'}
                    </Text>
                  </View>
                </TouchableRipple> 

                <DrawerItemList {...props} />
              </SafeAreaView>
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          name="LibraryScreen"
          options={{
            headerTitle: "Library",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: "Library",
            drawerIcon: ({ color }) => ( 
              <FontAwesome5 name="book-reader" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="FavoriteScreen"
          options={{
            headerTitle: "Favorites",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: "Favorites",
            drawerIcon: ({ color }) => (
              <Ionicons name="bookmarks" size={22} color={color} />
            ),
          }}
        />
        {/* <Drawer.Screen
          name="ChatScreen"
          options={{
            headerTitle: "Chat",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: "Chat",
            drawerIcon: ({ color }) => (
              <Ionicons name="chatbubbles" size={22} color={color} />
            ),
          }}
        /> */}
        <Drawer.Screen
          name="ClassScreen"
          options={{
            headerTitle: "Class",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: "Class",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="chalkboard-teacher" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="ForumScreen"
          options={{
            headerTitle: "Forum",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: "Forum",
            drawerIcon: ({ color }) => (
              <FontAwesome6 name="people-line" size={22} color={color} />
            ),
          }}
        />
       <Drawer.Screen
          name="logout"
          options={{
            headerTitle: "Logout",
            drawerItemStyle: {
              borderRadius: 10,
            },
            drawerLabel: () => (
              <TouchableOpacity onPress={() => handleLogout()}>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                  <FontAwesome6 name="right-from-bracket" size={22} color="gray" />
                  <Text style={{ marginLeft: 10, color: "gray" }}>Logout</Text>
                </View> 
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
