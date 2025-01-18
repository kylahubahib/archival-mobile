import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PaperProvider, Menu, IconButton, Paragraph } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';  
import { getToken } from '../services/TokenService';
import axios from '../../utils/axios';
import { router } from 'expo-router';

export default function GroupClass({ section }) {
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    const token = await getToken();
    try {
      setLoading(true);
      const response = await axios.get(`/fetch-AssignedTask/${section.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched tasks:', response.data);

      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.warn('Unexpected tasks format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskPress = (task) => {
    console.log(`Task pressed: ${task.id}`);
    router.push(`class/task/${task.id}/${section.id}`);
  };

  const handleLeaveClass = () => {
    console.log('Leave Class pressed');
  };

  const handleViewMembers = () => {
    console.log('View Members pressed');
    router.push(`class/people/${section.id}`);
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleTaskPress(item)}>
      <Text style={styles.cardTitle}>{item.task_title || 'Unnamed Task'}</Text>
      <Paragraph style={{fontSize: 11}}>
        <Text style={{fontWeight:'bold'}}>Instruction: </Text> 
        {item.task_instructions || 'No instruction yet.'}
      </Paragraph>
      <Text style={{fontSize: 12}}>Deadline: {formatDate(item.task_duedate)}</Text>
    </TouchableOpacity>
  );


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Class Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.classTitle}>{section.subject_name}</Text>

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon={() => <Entypo name="dots-three-vertical" size={20} color="white" />}
                  onPress={openMenu}
                />
              }
            >
              {/* <Menu.Item onPress={handleLeaveClass} title="Leave Class" /> */}
              <Menu.Item onPress={handleViewMembers} title="View Members" />
            </Menu>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksContainer}>
          {loading ? (
            <Text>Loading tasks...</Text>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTask}
              contentContainerStyle={styles.cardContainer}
            />
          )}
        </View>
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
    flex: 1,
    marginTop: 10,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
