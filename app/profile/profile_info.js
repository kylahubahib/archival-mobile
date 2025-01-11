import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Button, Card, Paragraph, Avatar, ActivityIndicator } from 'react-native-paper';
import { url } from '../../utils/utils';
import { getToken } from '../services/TokenService';

export default function ProfileInformation({user}) {

  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    user_pic: user.user_pic,
    uni_id_num: user.uni_id_num || '',
    user_pnum: user.user_pnum || '',
    user_aboutme: user.user_aboutme || '',
    user_dob: user.user_dob || '',
  });

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');


  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const formatDateWithLocale = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      const [month, day, year] = date.split('/');
      return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
    }
    return parsedDate.toISOString().split('T')[0];
  };

  const submit = async () => {
    setProcessing(true);
    setMessage('');

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    console.log('Updated Info: ', formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <Text style={styles.title}>Profile Information</Text> */}
        <Paragraph style={styles.subtitle}>Update your account's profile information and email address.</Paragraph>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={data.name}
            onChangeText={(text) => handleInputChange('name', text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={data.email}
            onChangeText={(text) => handleInputChange('email', text)}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        {(user.user_type !== 'general_user') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>School ID #</Text>
            <TextInput
              value={data.uni_id_num}
              onChangeText={(text) => handleInputChange('uni_id_num', text)}
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={data.user_pnum}
            onChangeText={(text) => handleInputChange('user_pnum', text)}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            value={formatDateWithLocale(data.user_dob)}
            onChangeText={(text) => handleInputChange('user_dob', text)}
            style={styles.input}
          />
        </View>

        {(user.user_type !== 'general_user') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>About Me</Text>
            <TextInput
              value={data.user_aboutme}
              onChangeText={(text) => handleInputChange('user_aboutme', text)}
              style={styles.input}
              multiline
            />
          </View>
        )}

        <Button mode="contained" onPress={submit} disabled={processing} style={styles.submitButton}>
          {processing ? <ActivityIndicator animating={true} /> : 'Save'}
        </Button>

        {message && <Text style={styles.successMessage}>{message}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#294996"
  },
  successMessage: {
    color: 'green',
    marginTop: 16,
    textAlign: 'center',
  },
  warning: {
    color: 'red',
    fontSize: 14,
    marginVertical: 8,
  },
});
