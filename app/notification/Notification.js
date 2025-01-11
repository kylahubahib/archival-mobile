import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Divider, Card } from 'react-native-paper';
import { getToken } from '../services/TokenService';
import axios from '../../utils/axios';

export default function Notification({ user }) {
  const [notificationData, setNotificationData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get('/get-notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Debugging log
      console.log('API Response:', response.data);

      // Update state with notification data
      setNotificationData(response.data?.notificationData || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    console.log('Clear Notifications');
  };

  const markAsRead = async () => {
    console.log('Read');
  };

  const renderNotification = ({ item }) => (
    <Card style={[styles.notificationCard, !item.read_at && styles.unreadNotification]}>
      <Card.Content>
        <Text style={styles.notificationText}>
          {item.data?.message || 'No message available'}
        </Text>
        <Text style={styles.notificationTime}>
          {item.created_at || 'Unknown date'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View>

        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={clearNotifications}>
              <Text style={styles.headerText}>Mark All as Read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearNotifications}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <Divider />

          {loading ? (
            <ActivityIndicator animating size="small" style={styles.spinner} />
          ) : (
            <FlatList
              data={notificationData}
              renderItem={renderNotification}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No notifications yet.</Text>
              }
            />
          )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 16,
  },
  notificationButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 300,
    maxHeight: 400,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearText: {
    color: 'red',
    fontSize: 14,
  },
  spinner: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
  notificationCard: {
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
  },
  unreadNotification: {
    backgroundColor: '#e3f2fd',
  },
  notificationText: {
    fontSize: 14,
  },
  notificationTime: {
    fontSize: 12,
    color: 'gray',
  },
});
