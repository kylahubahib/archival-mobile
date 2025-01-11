import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Searchbar } from "react-native-paper";

export default function ChatScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    { 
      id: "1",
      name: "John Doe",
      lastMessage: "Hey! How’s it going?",
      timestamp: "2:45 PM",
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Are we still on for tomorrow?",
      timestamp: "1:15 PM",
    },
    {
      id: "3",
      name: "Paul Johnson",
      lastMessage: "Just sent the files over.",
      timestamp: "11:00 AM",
    },
    {
      id: "4",
      name: "Emily Clark",
      lastMessage: "Can you review this?",
      timestamp: "Yesterday",
    },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.chatInfo}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Avatar.Text size={24} label="XD" /> 
          <Text style={styles.chatName}>{item.name}</Text>
        </View>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", marginVertical: 20, marginHorizontal: 5}}>
      <Searchbar
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        elevation={1}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#294996" 
        placeholderTextColor="#888" 
      />
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f1ff"
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 0.6
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
  },
  searchBar: {
    backgroundColor: 'white',
    shadowOpacity: 0,
    height: 43,
    flex: 1,
  },
  searchInput: {
    minHeight: 0,
    fontSize: 14,
    color: '#333',
  },
});
