import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { Avatar, Button, Chip, IconButton, Snackbar, Provider as PaperProvider, Modal, Portal } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { getToken } from '../../services/TokenService';
import { loadUser } from '../../services/AuthService';
import { url } from '../../../utils/utils';
import axios from '../../../utils/axios';
import ManuscriptTags from '../../../components/ManuscriptTags';
import ManuscriptComments from '../comment';
import PdfViewer from '../../../components/PdfViewer';
import Ratings from '../../../components/Ratings';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';

export default function ManuscriptDetails() {
  const { manuscriptId } = useLocalSearchParams(); 
  const [manuscript, setManuscript] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [displayPage, setDisplayPage] = useState('Details');
  const [snackbarVisible, setSnackbarVisible] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  

  useEffect(() => {
    fetchManuscript();
    fetchUser();
    checkFavorite();
  }, [manuscriptId]);

  const fetchUser = async () => {
    const response = await loadUser();
    setUser(response);
  };

  const checkFavorite = async () => {
    const userFavorited = manuscript.favorites.some(
      (favorite) => favorite.user_id === user.id
    );
    console.log(userFavorited);
    setIsBookmarked(userFavorited);
  };
  

  const fetchManuscript = async () => {
    try {
      setLoading(true);
      console.log('Getting details...');
      const token = await getToken(); 
      const response = await axios.get(`/manuscripts/${manuscriptId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setManuscript(response.data); 
      console.log(response.data.favorites);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch manuscript details');
    } finally {
      setLoading(false);
    }
  };

  const generateCitation = () => {
    if (!manuscript) return '';

    const authorNames = manuscript.authors.map(author => author.name).join(', ') || 'Unknown Authors';
    const publicationYear = new Date(manuscript.created_at).getFullYear() || 'n.d.';
    const title = manuscript.man_doc_title || 'Untitled';

    console.log(`${authorNames}. (${publicationYear}). ${title}`);

  //  Alert.alert('Copied!', 'Citation has been copied to your clipboard.');

    // Example citation format
    return `${authorNames} (${publicationYear}). ${title}`;
  };

  const handleCopyCitation = async () => {
    const citation = generateCitation();
    if (citation) {
      await Clipboard.setStringAsync(citation);
      Alert.alert('Citation Copied!', 'The citation has been copied to the clipboard.');
    } else {
      Alert.alert('Error', 'Failed to generate citation.');
    }
  }
  
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const downloadPath = `${FileSystem.documentDirectory}${fileName}.pdf`; 
      const pdfUrl = `${url.BASE_URL}/${fileUrl}`;
      console.log(pdfUrl);
      const { uri } = await FileSystem.downloadAsync(pdfUrl, downloadPath);

      Alert.alert('Download Complete', `File downloaded to: ${uri}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Download Failed', 'Unable to download the file. Please try again.');
    }
  };

  const handleToggleFavorite = async () => {
    try {
        const token = await getToken();
        if(!isBookmarked)
        {
          console.log('Start adding favorite...')
          await axios.post('/addfavorites', { man_doc_id: manuscriptId },
            {
                headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
            console.log('Done adding favorite!');
            setIsBookmarked(true);
        } else {
          console.log('Start removing favorite...')
          await axios.delete('/removefavorites',
            {
                params: { man_doc_id: manuscriptId },
                headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
            console.log('Done removing favorite!');
            setIsBookmarked(false);
        }
       

    } catch (error) {
        console.error('Error adding favorite:', error);
    }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    
    <PaperProvider>
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {displayPage === 'Details' &&
        <View style={{ flex: 1, paddingBottom: 100 }}>
        <View style={styles.card}>
          <Text style={styles.title}>{manuscript?.man_doc_title}</Text>
          <Text style={styles.description}>
              <Text style={{fontWeight:'bold'}}>Abstract: </Text>
              {manuscript?.man_doc_description}
          </Text>

          {/* Authors Section */}
          <View style={styles.authors}>
          <Text style={styles.sectionTitle}>Authors:</Text>
          {manuscript?.authors && manuscript.authors.length > 0 ? (
              manuscript.authors.map((author, index) => (
              <View key={index} style={styles.authorItem}>
                  <View style={styles.authorDetails}>
                  <Text style={styles.authorName}>{author.name || 'Unknown Author'}</Text>
                  {/* <Text style={styles.authorEmail}>{author.email}</Text> */}
                  </View>
              </View>
              ))
          ) : (
              <Text style={styles.noAuthorsText}>Unknown Authors</Text>
          )}
          </View>

          {/* Tags Section */}
          <ManuscriptTags tags={manuscript.tags} size={16} />
          
          <View style={styles.metaData}>
            <FontAwesome name="user" size={20} color="#294996" />
            <Text style={styles.metaText}>Adviser: {manuscript?.man_doc_adviser}</Text>
          </View>

          <View style={styles.metaData}>
            <FontAwesome name="eye" size={20} color="#294996" />
            <Text style={styles.metaText}>View Count: {manuscript?.man_doc_view_count}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <IconButton
              icon="download"
              color="#294996"
              size={24}
              onPress={() => handleDownload(manuscript.man_doc_content, manuscript.man_doc_title)}
            />
            <IconButton
              icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              color={isBookmarked ? '#FFD700' : '#294996'}
              size={24}
              onPress={handleToggleFavorite}
            />
            <IconButton
              icon="star"
              color="#294996"
              size={24}
              onPress={showModal}
            />
            <IconButton
              icon="format-quote-close"
              color="#294996"
              size={24}
              onPress={handleCopyCitation}
            />
            <IconButton
              icon="eye"
              color="#294996"
              size={24}
              onPress={() => setDisplayPage('ViewPdf')}
            />
          </View>
        </View>
          <ManuscriptComments manuscriptId={manuscriptId} />

        </View>
      }
      
      {displayPage === 'ViewPdf' && 
      <View>
      <View style={styles.card}>
        <Text style={styles.title}>{manuscript?.man_doc_title}</Text>
      </View>
        <PdfViewer link={manuscript?.man_doc_content} />
        </View>
      }

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Rate Manuscript</Text>
            <Ratings manuscriptId={manuscriptId} />
            <Button mode="text" onPress={hideModal}>
              Close
            </Button>
          </Modal>
        </Portal>
      
    </ScrollView>
    
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f1ff',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#294996',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  authors: {
    marginBottom: 12,
  },
  authorText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tags: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#294996',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0f7fa',
    margin: 4,
  },
  metaData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  authors: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#294996',
    marginBottom: 8,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorDetails: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  authorEmail: {
    fontSize: 14,
    color: '#666',
  },
  noAuthorsText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});
