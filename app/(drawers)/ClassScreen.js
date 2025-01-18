import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Modal, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Button, Provider as PaperProvider } from 'react-native-paper';
import { FontAwesome6 } from '@expo/vector-icons';
import FormTextField from '../../components/FormTextField';
import GroupClass from '../class/group_class';
import axios from '../../utils/axios';
import { getToken } from '../services/TokenService';
import { loadUser } from '../services/AuthService';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ClassScreen() {
  const [visible, setVisible] = useState(false);
  const [classCode, setClassCode] = useState(''); 
  const [joinedClass, setJoinedClass] = useState(false); 
  const [selectedSection, setSelectedSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
    fetchStudentClasses(); 
  },[user]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getUser = async () => {
    const response = await loadUser();
    setUser(response);
  }

  const fetchStudentClasses = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/fetch-studentClasses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },[]);

      setSections(response.data); 
    } catch (error) {
      console.error('Error fetching student classes:', error);
    }
  };

  const handleChangeText = useCallback((text) => {
    setClassCode(text);
  }, []);

  const handleJoinClass = async () => {
    console.log('classCode:', classCode);

    if (!classCode.trim()) {
        alert("Please enter a valid class code!");
        return;
    }

    try {
        console.log('Starting join process...');

        const token = await getToken(); 

        // Check if the user is premium
        const premiumResponse = await axios.get('/ispremium',
          {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          }
        );
        const { is_premium } = premiumResponse.data;

        console.log('Premium status:', is_premium);

        if (!is_premium) {
            alert('You need to be a premium user to join the class.');
            return;
        }

        // Check if the class code exists
        const classResponse = await axios.post('/check-class-code',{ class_code: classCode },
          {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!classResponse.data.exists) {
            alert('Class code not found. Please try again.');
            return;
        }

        console.log('Class details:', classResponse.data.classDetails);

        // Join the class
        await axios.post('/store-student-class',{ class_code: classCode },
          {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          }
        );

        setClassCode('');
        alert('Successfully joined the class!');
        // setJoinedClass(true);
        hideModal();

       fetchStudentClasses();
    } catch (error) {
        console.error('Error joining class:', error);
        alert('An error occurred while joining the class.');
    } 
    // finally {
    //     setIsJoining(false); // Always reset loading state
    // }
};


  const handleClassPress = (data) => {
    // console.log(data);
    setSelectedSection(data.item);
    setJoinedClass(true);
  }

  if (joinedClass) {
    return <SafeAreaView style={{flex:1, backgroundColor: "#e9f1ff", marginTop:10}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Button onPress={()=> setJoinedClass(false)}
          icon={() => <FontAwesome6 name="arrow-alt-circle-left" size={24} color="#4285f4" />} />
        <Text style={{color:'#4285f4', fontWeight: '500', fontSize:20}}>Alchemist Room</Text>
      </View>
      <GroupClass section={selectedSection} />
    </SafeAreaView>
  }

  if (user?.user_type === 'general_user') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#e9f1ff", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <FontAwesome5 name="chalkboard-teacher" size={50} color="#294996" />
        </View>
        <Text style={{ 
            fontSize: 18, 
            fontWeight: "bold", 
            color: "#294996", 
            textAlign: "center", 
            marginBottom: 10 
          }}>
          Access Restricted
        </Text>
        <Text style={{ 
            fontSize: 16, 
            color: "#606060", 
            textAlign: "center", 
            lineHeight: 24 
          }}>
          You need to be a student or teacher to access the class. 
          Please contact support if you believe this is an error.
        </Text>
      </SafeAreaView>
    );
  }
  

  const renderClassItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.classCard}>
      <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}>
        <Image
          source={require('../../assets/images/class.png')}
          style={styles.classImage}
        />
        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
          <Text style={styles.classTitle}>{item.subject_name}</Text>
          <Text style={styles.classSubtitle}>
            {item.course?.course_acronym} {item.section_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e9f1ff" }}>
      {sections.length > 0 ? (
        <>
        <View style={styles.container}>
                <Button
                  mode="contained"
                  style={styles.classCard}
                  labelStyle={styles.buttonLabel}
                  onPress={showModal} 
                  icon={() => <FontAwesome6 name="plus" size={24} color="#4285f4" />}
                >
                  Join Class
                </Button>
        </View>

        <FlatList
          data={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderClassItem({ ...item, onPress: () => handleClassPress(item) })}
          contentContainerStyle={styles.listContainer}
        />
        </>
      ) : (
        <>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#294996" /> 
        </View>
        </>
      )}

      <PaperProvider>
        <SafeAreaView style={{ flex: 1}}>
          <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={hideModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <FormTextField 
                  label="Enter class code" 
                  value={classCode}
                  onChangeText={handleChangeText}
                />
                <View style={styles.modalButtons}>
                  <Button
                    mode="contained"
                    style={styles.joinButton}
                    onPress={handleJoinClass}
                  >
                    Join
                  </Button>
                  <Button onPress={hideModal}>Cancel</Button>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    marginHorizontal: 15
  },
  joinButton: {
    borderRadius: 10,
    backgroundColor: "#294996",
  },
  buttonLabel: {
    fontSize: 18,
    padding: 3,
    paddingVertical:15,
    color: '#4285f4',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 16,
    elevation: 3,
  },
  classImage: {
    width: 70, // Width of the image
    height: 70, // Height of the image
    borderRadius: 10, // Optional: If you want the image to have rounded corners
    marginRight: 10, // Space between the image and text
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    paddingTop: 5
  },
  classSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
