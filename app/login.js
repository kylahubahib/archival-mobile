import React, { useState } from 'react';
import { View, StyleSheet, Platform, SafeAreaView, Pressable, Text, Linking } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { Link, router } from 'expo-router';
import axios from '../utils/axios';
import { login, loadUser } from './services/AuthService';
import { url } from '../utils/utils';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const handleLogin = async () => {
    
    setError({});
    try {

      console.log('loging in...');

      await login({
        email: email,
        password: password
      });

      // if(e.response.data.message) {
      //   setError(e.response.data.message);
      // }
      
      const user = await loadUser();

      if(user) {
        console.log("Login Successful!");
        console.log("User is here: ", user);
        router.push("/LibraryScreen");
      }

    } catch (e) {
      if(e.response?.status === 422) {
        console.log(e.response.data.errors);
        setError(e.response.data.errors);
      }
     
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: "#e9f1ff"}}>
    <View style={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content> 
          <Text variant="displayLarge" style={styles.title}>Archival Alchemist</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <Text style={{ color: "red"}}>{error.email || error.password}</Text>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            labelStyle={{ fontSize: 16 }}
          >
            Login
          </Button>

          <Link href="/forgot_password"  style={styles.footerText}>
           Forgot Password?
          </Link> 
          
          <Link href="/register"  style={styles.footerText}>
            Don’t have an account? Sign up
          </Link> 

          

           {/* Another Way for this 
        
            <Pressable onPress={() => router.push("/auth/register")}>
            <Text>Sign up</Text>
            </Pressable> 

            or 

             <Pressable onPress={() => router.push({
                pathname: "users/[id]",
                params: {id: 2},
             })}>
            <Text>Sign up</Text>
            </Pressable> 
           
           */}
          
        </Card.Content>
      </Card>
    </View>
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 25,
    elevation: 4,
    backgroundColor: "transparent"
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#294996',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#294996'
  },
  footerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#294996',
  },
});
