import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import { getToken } from '../../services/TokenService';
import axios from '../../../utils/axios';

export default function ReportScreen() {
  const { postId } = useLocalSearchParams(); 
  const [reportTypes, setReportTypes] = useState([]);
  const [data, setData] = useState({
    report_type: '',
    report_desc: '',
    report_attachment: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const reportLocation = 'Forum'; // Replace with actual report location

  useEffect(() => {
    fetchReportTypes();
  }, []);

  const fetchReportTypes = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/report-types', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportTypes(response.data);
    } catch (error) {
      console.error('Error fetching report types:', error);
      Alert.alert('Error', 'Failed to fetch report types.');
    }
  };

  const submitReport = async () => {
    if (!data.report_type || !data.report_desc) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
        const postIdInt = parseInt(postId, 10);
        console.log('POst id: ', postIdInt);
      const token = await getToken();
      const response = await axios.post(
        '/report',
        {
          reported_id: postId,
          report_location: reportLocation,
          ...data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', response.data.message);
        resetForm();
      } else {
        Alert.alert('Warning', response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred.';
      setErrorMessage(errorMsg);
      console.error('Error submitting report:', error);
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setData({ report_type: '', report_desc: '', report_attachment: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why would you want to report this?</Text>

      <Text style={styles.label}>Reason for Reporting</Text>
      <Picker
        selectedValue={data.report_type}
        onValueChange={(itemValue) => setData({ ...data, report_type: itemValue })}
        style={styles.picker}
      >
        <Picker.Item label="Select a reason" value="" />
        {reportTypes.map((type) => (
          <Picker.Item key={type.id} label={type.report_type_content} value={type.report_type_content} />
        ))}
      </Picker>

      <Text style={styles.label}>Your Message</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Provide details for reporting..."
        value={data.report_desc}
        onChangeText={(text) => setData({ ...data, report_desc: text })}
        multiline
        numberOfLines={4}
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[styles.submitButton, processing && styles.disabledButton]}
        onPress={submitReport}
        disabled={processing}
      >
        {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Report</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e9f1ff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  textInput: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
