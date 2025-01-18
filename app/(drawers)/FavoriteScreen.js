import React, { useEffect, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Searchbar, IconButton, Button, Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from '../../utils/axios';
import ManuscriptTags from '../../components/ManuscriptTags';
import { WebView } from 'react-native-webview'; // Import WebView from react-native-webview
import { getToken } from '../services/TokenService';
import { router } from 'expo-router';
import { loadUser } from '../services/AuthService';

export default function FavoriteScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfVisible, setPdfVisible] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
      const response = await loadUser();
      setUser(response);
    };

  // Toggle the modal visibility
  const toggleFilterModal = () => {
    setFilterVisible(!filterVisible);
  };

  // Fetch books from the API
  useEffect(() => {
    // fetchUser();
    fetchBooks();
  },);

  const fetchBooks = async () => {
    // setLoading(true);
    try {
      // console.log('Start fetching books...');
  
      const token = await getToken();
      // console.log('Token:', token); 
      const response = await axios.get('/my-favorite-manuscripts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = response.data;
      // console.log('API Response:', data);
  
      // Ensure the data has the structure you're expecting
      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format.');
      }
  
      const uniqueManuscripts = Array.from(new Set(data.map(item => item.id)))
        .map(id => data.find(item => item.id === id));
      setBooks(uniqueManuscripts);
      // console.log('Unique manuscripts:', uniqueManuscripts);
  
    } catch (error) {
      console.error('Fetch books error:', error.response || error.message || error);
      setError('Error fetching books. Please try again later.');
    } finally {
      // setLoading(false);
    }
  };
  

  const { width } = Dimensions.get('window');
  const numColumns = 2;
  const cardWidth = width / numColumns - 20;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.man_doc_content) {
          // console.log(item.man_doc_content);
          // setSelectedPdf(item.man_doc_content);
          // setPdfVisible(true);
          router.push(`library/manuscript/${item.id}`);
        } else {
          alert("PDF URL is not available");
        }
      }}
      style={{ margin: 10 }}
    >
      <Card style={{ width: cardWidth, backgroundColor: "white", elevation: 3 }}>
        {/* Card Cover styled with Title, Authors, and Year */}
        <View style={styles.cardCover}>
          <Text style={styles.cardTitle}>{item.man_doc_title}</Text>

          {/* Bottom Container for Authors and Year */}
          <View style={styles.bottomContainer}>
            <View style={styles.authorsContainer}>
              <Text style={styles.authorsLabel}>By:</Text>
              {item.authors && item.authors.length > 0 ? (
                item.authors.map((author, index) => (
                  <Text key={index} style={styles.authorName}>{author.name}</Text>
                ))
              ) : (
                <Text style={styles.authorName}>Unknown Authors</Text>
              )}
            </View>

            <Text style={styles.cardYear}>{new Date(item.updated_at).getFullYear()}</Text>
          </View>
        </View>
        <Card.Content>
          <ManuscriptTags tags={item.tags} size={8} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#294996" />
        <Text>Loading books...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e9f1ff" }}>
      <View style={styles.container}>
        {/* Search Bar */}
        <Searchbar
          placeholder="Search books..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          elevation={1}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#294996" 
          placeholderTextColor="#888" 
        />
        
        {/* Filter Icon */}
        {/* <IconButton
          icon={() => <FontAwesome name="filter" size={24} color="#294996" />}
          onPress={toggleFilterModal}
        /> */}

        {/* Filter Modal */}
        <Modal
          visible={filterVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleFilterModal} 
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              {/* Example Filter Options */}
              <TouchableOpacity style={styles.filterOption}>
                <Text>Option 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>Option 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>Option 3</Text>
              </TouchableOpacity>
              {/* Close Button */}
              <Button mode="contained" onPress={toggleFilterModal}>
                Apply Filters
              </Button>
            </View>
          </View>
        </Modal>
      </View>

      {/* Manuscript List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.man_doc_id ? item.man_doc_id.toString() : item.id.toString()}
          numColumns={numColumns}
        />
      </View>

      {/* PDF Viewer Modal */}
      <Modal
        visible={pdfVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPdfVisible(false)}
      >
        <View style={styles.pdfModalOverlay}>
          <View style={styles.pdfModalContainer}>
            {/* Use WebView to display the PDF */}
            <WebView
              originWhitelist={['*']}
              source={{ uri: 'https://www.pdf995.com/samples/pdf.pdf' }}
              style={{marginBottom:100, height:"100%", width:"100%", flex: 1 }}
            />

            <Button mode="contained" onPress={() => setPdfVisible(false)}>
              Close PDF
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardCover: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    height: 230,
  },
  cardTitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardYear: {
    marginTop: 5,
    fontSize: 10,
    color: '#888',
  },
  authorsContainer: {
    alignItems: 'center',
  },
  authorsLabel: {
    fontSize: 10,
    color: '#888',
  },
  authorName: {
    fontSize: 10,
    color: '#294996',
    marginBottom: 2,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  pdfModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfModalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
