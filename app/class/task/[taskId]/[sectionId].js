import { useLocalSearchParams  } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Title, TouchableRipple, PaperProvider, Menu, IconButton, ActivityIndicator, Button } from 'react-native-paper';
import { Entypo, Ionicons } from '@expo/vector-icons';  
import axios from '../../../../utils/axios';
import { getToken } from '../../../services/TokenService';
import UploadCapstone from '../../upload_capstone';
import Track from '../../track';
import Approved from '../../approved';

export default function TaskDetails() {
  const { taskId, sectionId } = useLocalSearchParams (); 
  const [hasGroup, setHasGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayPage, setDisplayPage] = useState('Menu');
  const [selectedManuscript, setSelectedManuscript] = useState(null);


  console.log(sectionId, taskId);

  useEffect(() => {
    checkGroupMembership();
  },[]); 

  const checkGroupMembership = async () => {
    setLoading(true);
    try {
        const token = await getToken();
        const response = await axios.get('/check-group', {
            params: {
                section_id: sectionId,
                task_id: taskId
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }); 

        const data = response.data;
        setHasGroup(data.hasGroup); 
        setLoading(false);
        console.log(data);
    } catch (error) {
        console.error("Error fetching group membership:", error);
    }
  };

  const handleCardPress = (cardName) => {
    console.log(`${cardName} pressed`);
  };


  return (
    <PaperProvider>
    <SafeAreaView style={styles.container}>

    { loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#294996" />
      </View>
    ) : (
      <>
        {/* Card Section */}
        {displayPage === 'Menu' && <View style={styles.cardContainer}>
          {!hasGroup &&
            <TouchableRipple
            style={styles.card}
            onPress={() => setDisplayPage('Upload')}
          >
            <Card.Content style={styles.cardContent}>
              <Ionicons name="cloud-upload-outline" size={40} color="#294996" style={styles.cardIcon} />
              <Title style={styles.cardTitle}>Upload Capstone Manuscript</Title>
            </Card.Content>
          </TouchableRipple>
          }

          <TouchableRipple
            style={styles.card}
            onPress={() => setDisplayPage('Track')}
          >
            <Card.Content style={styles.cardContent}>
              <Ionicons name="book-outline" size={40} color="#294996" style={styles.cardIcon} />
              <Title style={styles.cardTitle}>Track Capstone Manuscript</Title>
            </Card.Content>
          </TouchableRipple>

          <TouchableRipple
            style={styles.card}
            onPress={() => setDisplayPage('View')}
          >
            <Card.Content style={styles.cardContent}>
              <Ionicons name="eye-outline" size={40} color="#294996" style={styles.cardIcon} />
              <Title style={styles.cardTitle}>View Approved Manuscript</Title>
            </Card.Content>
          </TouchableRipple>
        </View>}

        {displayPage != 'Menu' && 
          <Button
            mode="contained"
            onPress={() => setDisplayPage('Menu')}
            style={styles.returnButton}
            labelStyle={styles.returnButtonLabel}
          >
            Return
          </Button>

        }

        {displayPage === 'Upload' && <UploadCapstone taskId={taskId} sectionId={sectionId}/>}
        {displayPage === 'Track' && <Track sectionId={sectionId} taskId={taskId}/>}
        {displayPage === 'View' && <Approved sectionId={sectionId} taskId={taskId}/>}
        

      </>
    )}
    </SafeAreaView>
  </PaperProvider>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f1ff',
    padding: 10,
  },
  header: {
    backgroundColor: '#294996',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  tasksContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  taskItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  cardContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 25,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardContent: {
    padding: 15,
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: "#d1d5db", 
    marginVertical: 5, 
    borderRadius: 8, 
    elevation: 3, 
    marginBottom: 10
  },
  returnButtonLabel: {
    color: "gray", 
    fontSize: 14, 
    fontWeight: 'semibold'
  },
});
