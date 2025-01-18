import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Linking, Alert } from "react-native";
import { Card, Button, ActivityIndicator } from "react-native-paper";
import { getToken } from "../services/TokenService";
import axios from "../../utils/axios";

export default function Track(sectionId, taskId) {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedManuscript, setSelectedManuscript] = useState(null);

  useEffect(() => {
    getManuscript();
  },[]);

  console.log(manuscripts);

  const getManuscript = async () => {
    setLoading(true);
    try {
      const token = await getToken();
  
      const response = await axios.get('/get-manuscripts', {
        params: { section_id: sectionId },
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("These are the manuscripts:", response.data); 
      setManuscripts(response.data); // Store the manuscripts data
      setLoading(false);
  
    } catch (error) {
      console.error("Error fetching manuscripts:", error);
      // Optional: Display an alert to notify the user of the error
      Alert.alert("Error", "Failed to fetch manuscripts. Please try again.");
    }
  };

  const handleSendForReview = async (item) => {
    setLoading(true);

    try {
      const token = await getToken();
      const response = await  axios.post('/send-for-revision', { manuscript_id: item.id },
        {
          headers: {
              Authorization: `Bearer ${token}`
            },
        })
      Alert.alert('success', response.data.success);
    } catch (error) {
      console.log(error);
    }
   
      
  };
  
  const getGroupMembers = async () => {
    try {
        const response = await axios.get(`/groupmembers/${selectedManuscript.id}`);
        setMembers(response.data);

      } catch (error) {
          console.log(error);
      } 
  };

  const openLink = async (url) => {
    console.log(url);
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Open the link in the browser 
      console.log('opening..') 
      Linking.openURL(url);
    } else {
      Alert.alert('An error occured', 'Unable to open the URL. Please try again later');
    }
  };

  const renderManuscriptItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.man_doc_title}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Submitted By:</Text>
          <Text style={styles.groupName}>{item.group?.group_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Updated:</Text>
          <Text style={styles.value}>{formatDate(item.updated_at)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              item.man_doc_status === "Approved" ? styles.statusApproved : styles.statusPending,
            ]}
          >
            {item.man_doc_status}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {item.man_doc_status != 'Approved' && <Button
          mode="contained"
          style={styles.viewButton}
          onPress={() => openLink(item.man_doc_content)}
        >
          View Work
        </Button>}
        {item.man_doc_status != 'Approved' || item.man_doc_status != 'To-Review' && <Button
          mode="contained"
          style={styles.viewButton}
          onPress={() => handleSendForReview(item)}
        >
          Send for Revision
        </Button>}
      </Card.Actions>
    </Card>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  

  return (
    <View style={styles.container}>
      <FlatList
        data={manuscripts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderManuscriptItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {!loading ? <Text style={styles.emptyText}>No manuscripts available.</Text> : <ActivityIndicator/>}
          </View>
        )} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
    paddingBottom: 50
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "white",
  },
  groupName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 12,
    color: "#333",
  },
  statusApproved: {
    color: "#28a745",
    fontWeight: "bold",
  },
  statusPending: {
    color: "#ffc107",
    fontWeight: "bold",
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: "#294996",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});