import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ManuscriptTags = ({ tags, size = 14 }) => (
  <View style={styles.tagContainer}>
    {tags && tags.length > 0 ? (
      tags.map(tag => (
        <TouchableOpacity key={tag.id} style={styles.tag}>
          <Text style={[styles.tagText, { fontSize: size }]}>{tag.tags_name}</Text>
        </TouchableOpacity>
      ))
    ) : (
      <Text>No tags available</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#e1e1e1',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 2,
  },
  tagText: {
    color: '#294996',
  },
});

export default ManuscriptTags;
