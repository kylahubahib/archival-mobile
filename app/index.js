import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "./login";
import LibraryScreen from './(drawers)/LibraryScreen';
import AuthContext from "./context/AuthContext";
import { loadUser } from "./services/AuthService";
import { useState, useEffect } from "react";
import DrawerLayout from "./(drawers)/_layout";


export default function Page() {
  const [user, setUser] = useState();

  useEffect(() => {
    async function runEffect() {
      try {
        const user = await loadUser();
        setUser(user);
      }catch (e) {
        console.log("Failed to load user", e);
    }
  }

  runEffect();
}, [])

  return (

    <LoginScreen />
  //   <AuthContext.Provider value={{user, setUser}}>
  //   {user ? (
  //     <>
  //     <LoginScreen/>
  //     </>
  //   ): (
  //     <>
  //       <DrawerLayout />
  //     </>
  //   )}
  
  //  </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
