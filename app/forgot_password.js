import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Link, router } from 'expo-router';
import axios from '../utils/axios';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleResetPasswordSubmit = async () => {
    setProcessing(true);
    setErrors({});
    setSuccessMessage(null);

    try {
    
      const response = await axios.post('/send-password-reset', email);

      if (response.data.success) {
        setSuccessMessage('The password reset link has been sent successfully.');
      }

    } catch (error) {
      console.error('Error sending password reset link:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Forgot Password?</Title>
            <Paragraph style={styles.paragraph}>
              No problem. Just let us know your email address, and we will email you a password reset link that will allow you to choose a new one.
            </Paragraph>

            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Button
              mode="contained"
              onPress={handleResetPasswordSubmit}
              style={styles.button}
              disabled={processing}
              loading={processing}
            >
              Email Password Reset Link
            </Button>

            <Text style={styles.footerText}>
              Remember your password?{' '}
              <Text
                onPress={() => router.push('/login')}
                style={styles.linkText}
              >
                Login here
              </Text>
            </Text>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#294996',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#294996',
  },
  footerText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    color: '#294996',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});
