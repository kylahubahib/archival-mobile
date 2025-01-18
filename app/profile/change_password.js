import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import axios from "../../utils/axios";
import { getToken } from "../services/TokenService";

export default function ChangePassword({ user }) {
    const currentPasswordInput = useRef();
    const newPasswordInput = useRef();
    const confirmPasswordInput = useRef();

    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const handleInputChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    const updatePassword = async () => {
        setProcessing(true);
        setErrors({});
        setRecentlySuccessful(false);

        try {
            const token = await getToken();
            const response = await axios.patch('/password', data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProcessing(false);
            setRecentlySuccessful(true);
            // Alert.alert('Success', response.data.message || 'Password updated successfully.');
            setData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            setProcessing(false);

            if (error.response && error.response.data) {
                setErrors(error.response.data.errors || {});
                if (error.response.data.errors.current_password) {
                    setData({ ...data, current_password: '' });
                    currentPasswordInput.current.focus();
                }
                if (error.response.data.errors.password) {
                    setData({ ...data, password: '', password_confirmation: '' });
                    newPasswordInput.current.focus();
                }
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{paddingBottom: 50}}>
                <Text style={styles.subtitle}>Ensure your account is using a long, random password to stay secure.</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChangeText={(text) => handleInputChange('current_password', text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    {errors.current_password && <Text style={styles.error}>{errors.current_password}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        ref={newPasswordInput}
                        value={data.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        ref={confirmPasswordInput}
                        value={data.password_confirmation}
                        onChangeText={(text) => handleInputChange('password_confirmation', text)}
                        style={styles.input}
                        secureTextEntry
                    />
                    {errors.password_confirmation && <Text style={styles.error}>{errors.password_confirmation}</Text>}
                </View>

                <Button
                    mode="contained"
                    onPress={updatePassword}
                    disabled={processing}
                    style={styles.submitButton}
                >
                    {processing ? <ActivityIndicator animating={true} /> : 'Save'}
                </Button>

                {recentlySuccessful && <Text style={styles.successMessage}>Password updated successfully.</Text>}
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
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
        backgroundColor: '#294996',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    successMessage: {
        color: 'green',
        marginTop: 16,
        textAlign: 'center',
    },
});
