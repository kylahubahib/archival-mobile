import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormTextField from '../components/FormTextField';
import { getToken } from './services/TokenService';
import axios from '../utils/axios';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_dob: '', 
  });

  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [errors, setErrors] = useState({}); 
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRegister = async () => {
    setErrors({}); 

    if (!formData.name || !formData.email || !formData.password || !formData.user_dob) {
      setErrors({ general: 'Please fill in all fields.' });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' });
      return;
    }

    try {
      console.log(formData);

      const response = await axios.post("/register", formData);
      console.log('Registration successful:', response.data.success);
      if(response.data.success) {
        setSuccessMessage('Registration Successful! Please log in.')
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again later.' });
      }
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); 
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; 
      handleInputChange('user_dob', formattedDate);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text variant="displayLarge" style={styles.title}>
              Archival Alchemist
            </Text>

            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          { successMessage == null ? (
            <View>

            <FormTextField
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}

            <FormTextField
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text>{formData.user_dob ? `Date of Birth: ${formData.user_dob}` : 'Select Date of Birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()} 
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()} 
              />
            )}
            {errors.user_dob && <Text style={styles.errorText}>{errors.user_dob[0]}</Text>}

            <FormTextField
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}

            <FormTextField
              label="Confirm Password"
              value={formData.password_confirmation}
              onChangeText={(value) => handleInputChange('password_confirmation', value)}
              secureTextEntry
            />
            {errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              labelStyle={{ fontSize: 16 }}
            >
              Register
            </Button>

            <Link href="/login" style={styles.footerText}>
              Already have an account? Sign In
            </Link>

            </View>
            ) : (
              <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
              <Button
                mode="contained"
                onPress={() => {
                  router.push("/login")
                }}
                style={styles.button}
                labelStyle={{ fontSize: 16 }}
              >
                Go to Login
              </Button>
            </View>
            )

          }

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
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 25,
    elevation: 4,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#294996',
  },
  dateButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#294996',
  },
  footerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#294996',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5
  },
  successContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 20,
  },
  successText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

});
