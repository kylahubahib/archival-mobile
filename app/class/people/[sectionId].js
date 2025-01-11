import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/TokenService";

export default function People() {
  const { sectionId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch group members and current user concurrently
      const [groupResponse, userResponse] = await Promise.all([
        axios.get(`/fetch-groupmembers/${sectionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/fetch-currentuser", {
          headers: { Authorization: `Bearer ${token}` },
          params: { section_id: sectionId },
        }),
      ]);

      // Update state with fetched data
      setMembers(groupResponse.data);
      setTeacher(userResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberRole}>{item.role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <View style={styles.content}>
          <Text style={styles.teacherText}>
            Teacher: {teacher?.name || "N/A"}
          </Text>
          <FlatList
            data={members}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMember}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No members found.</Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    padding: 16,
  },
  teacherText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  memberContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberRole: {
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});
