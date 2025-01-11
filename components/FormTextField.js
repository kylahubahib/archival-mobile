import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormTextField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocus,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        cursorColor={"#294996"}
        // Add this to make it dynamic
        multiline={false} // Keep this false if you want a single-line text input
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%', 
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    width: '100%', 
    minWidth: 100, 
    backgroundColor: 'white',
  },
  inputFocus: {
    borderColor: '#294996',
    borderWidth: 2,
    shadowColor: '#294996',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});
