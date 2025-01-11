import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Provider, Searchbar } from "react-native-paper";
import ForumList from "../forum/ForumList";
import { getToken } from "../services/TokenService";
import axios from "../../utils/axios";
import { loadUser } from "../services/AuthService";

export default function ForumScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedSort, setSelectedSort] = useState('latest');
  const [user, setUser] = useState(null);

  useEffect(()=> {
    fetchPosts(selectedSort);

    if(user) {
      getUser();
    }
  },[])

  // Fetch posts with sorting option
  const fetchPosts = async (sortType) => {
    setLoading(true); 
    try {
      console.log(`Fetching posts with sort type: ${sortType}`); 
      const token = await getToken();
      const response = await axios.get(`/forum-posts?sort=${sortType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setPosts(response.data);
      setFilteredPosts(response.data);
  
      // console.log("Fetched posts:", response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
      console.error("Error fetching posts:", errorMessage);
  
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    const response = await loadUser();
    setUser(response);
    console.log(response);
  }

  
  return (
    <Provider>
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search posts..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        elevation={1}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#294996" 
        placeholderTextColor="#888" 
      />

      {/* Add Post and View My Post */}
      <View style={styles.header}>
        <Link href="forum/create_post" style={styles.startDiscussionButton}>
          <FontAwesome6 name="pen-to-square" size={16} color="white" />
          <Text style={styles.buttonText}> Start a discussion</Text>
        </Link>

        <Link href="forum/my_posts" style={styles.myPostsButton}>
          <FontAwesome6 name="file-signature" size={16} color="white" />
          <Text style={styles.buttonText}> My Posts</Text>
        </Link>
      </View>

      <ForumList posts={filteredPosts} user={user} />
    </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f1ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  startDiscussionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#33b249',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  myPostsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  searchBar: {
    margin: 15,
    backgroundColor: 'white',
    shadowOpacity: 0,
    height: 43,
  },
  searchInput: {
    minHeight: 0,
    fontSize: 14,
    color: '#333',
  },
});
