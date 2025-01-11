import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import axios from '../utils/axios';
import { getToken } from '../app/services/TokenService';

const labels = {
  0.5: 'Useless', 
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+', 
  4.5: 'Excellent',
  5: 'Excellent+',
};

export default function Ratings({ manuscriptId, initialRating = 0 }) {
  const [rating, setRating] = useState(initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = (value) => {
    setRating(value);
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }
  
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return;
      }
  
      setIsSubmitting(true); 
      console.log("Submitting rating...");
      const response = await axios.post(
        "/ratings",
        {
          manuscript_id: manuscriptId, 
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Alert.alert("Thank you!", response.data.message || "Rating submitted successfully!");
      console.log("Rating submitted successfully:", response.data);

    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          Alert.alert("Info", error.response.data.message || "You have already rated this manuscript.");
        } else {
          const errorMessage = error.response.data?.error || "An unexpected error occurred.";
          Alert.alert("Error", errorMessage);
        }
      } else {
        Alert.alert("Error", "Failed to submit rating. Please check your connection.");
      }
        //   console.log("Error submitting rating:", error.response || error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <TouchableOpacity key={value} onPress={() => handlePress(value)}>
                <AntDesign name="star" size={40}  color={value <= rating ? '#FFD700' : '#D3D3D3'} />
            </TouchableOpacity>
          );
        })}
      </View>
      {/* {rating > 0 && (
        <Text style={styles.label}>{labels[rating] || 'Rating'}</Text>
      )} */}
      <Button
        mode="contained"
        onPress={handleRatingSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        Submit Rating
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
    width: '100%',
  },
});
