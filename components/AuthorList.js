import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AuthorList = ({ authors }) => {
  if (authors && authors.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Author:</Text>
        <Text style={styles.authors}>
          {authors.map((author) => author.name).join(', ')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Author:</Text>
      <Text style={styles.authors}>Unknown Authors</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  label: {
    fontSize: 12,
    color: '#4A4A4A',
    marginBottom: 5,
  },
  authors: {
    fontSize: 12,
    color: '#4A4A4A',
  },
});

export default AuthorList;
