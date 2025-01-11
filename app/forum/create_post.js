import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { Button } from "react-native-paper";
import { getToken } from "../services/TokenService";
import axios from "../../utils/axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const handlePostSubmit = async () => {
    if (!title.trim() || !body.trim() || tags.length === 0) {
      console.log("All fields are required");
      return;
    }

    const newPost = {
      title: title.trim(),
      body: body.trim(),
      tags: tags.map((tag) => tag.trim()),
    };

    try {
      const token = await getToken();
      const response = await axios.post("/forum-posts", newPost,
        { headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Post submitted successfully:", response.data);
      Alert.alert("Success!", "Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error.response?.data || error.message);
    }
  };

  const handleTagKeyDown = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
          style={styles.input}
        />

        <Text style={styles.label}>Body</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Enter post content"
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Text style={styles.label}>Tags</Text>
        <TextInput
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleTagKeyDown}
          placeholder="Add a tag and press Enter"
          style={styles.input}
        />

        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.removeTag}> x </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button mode="contained" onPress={handlePostSubmit} style={styles.submitButton}>
          POST
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f1ff",
    padding: 25,
  },
  wrapper: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 200,
    textAlignVertical: "top",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
  },
  removeTag: {
    color: "#f00",
    marginLeft: 4,
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#294996'
  },
});
