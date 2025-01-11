import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, KeyboardAvoidingView } from "react-native";
import { Button, Checkbox, Chip } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import axios from "../../utils/axios";
import { getToken } from "../services/TokenService";

export default function UploadCapstone({ taskId, sectionId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adviser, setAdviser] = useState("");
  const [groupName, setGroupName] = useState("")
  const [authors, setAuthors] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [authorInputValue, setAuthorInputValue] = useState("");
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [tags, setTags] = useState([]); 
  const [tagInputValue, setTagInputValue] = useState(""); 
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [required, setRequired] = useState(true);
  const [loading, setLoading] = useState(false);

  // console.log(sectionId);



  const handleFileUpload = async () => {
    console.log('handleFileUpload triggered');
    try {
      console.log('Launching document picker...');

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
               "application/msword"], 
      });
  
      console.log('Document Picker Result:', result);
  
      if (result?.assets?.length > 0) {
        const file = result.assets[0]; 
        setSelectedFile(file);
        console.log('Selected File:', file);
        Alert.alert("File Selected", `Name: ${file.name}\nSize: ${file.size || "Unknown"} bytes`);
      } else if (result?.canceled) {
        console.log('User canceled document selection');
      } else {
        console.log('No valid file selected');
      }
    } catch (error) {
      console.error("Error picking a file:", error);
    }
  };

  const fetchAuthorSuggestions = async (query) => {
    try {
      const token = await getToken();
      const response = await axios.get("/students/search-in-class", {
        params: { query, section_id: sectionId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Authors: ', response.data);
      setAuthorSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching Author suggestions:", error.message);
    }
  };

  const handleAuthorSuggestionSelect = (author) => {

    if (!authors.some((existingAuthor) => existingAuthor.id === author.id)) {
      setAuthors([...authors, author.name]);
    }
    setAuthorInputValue("");
    setAuthorSuggestions([]);
  };

  const handleAuthorInputChange = (text) => {
    setAuthorInputValue(text);
    if (text.trim()) {
      fetchAuthorSuggestions(text);
    } else {
      setAuthorSuggestions([]);
    }
  };

  const handleRemoveAuthor = (authorId) => {
    setAuthors(authors.filter((author) => author.id !== authorId));
  };
  
  // Tags Functions
  const fetchTagSuggestions = async (query) => {
    const token = await getToken();
    try {
      const response = await axios.get("/tags/suggestions", {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTagSuggestions(response.data); // Ensure response.data is an array of tag objects or strings
    } catch (error) {
      console.error("Error fetching Tag suggestions:", error.message);
    }
  };
  
  const handleTagInputChange = (text) => {
    setTagInputValue(text);
    if (text.trim()) {
      fetchTagSuggestions(text);
    } else {
      setTagSuggestions([]);
    }
  };
  
  const handleAddTag = () => {
    if (!tagInputValue.trim()) return;
  
    const newTag = { id: Date.now(), tags_name: tagInputValue.trim() }; // Generate a unique id for the custom tag
    if (!tags.some((existingTag) => existingTag.tags_name.toLowerCase() === newTag.tags_name.toLowerCase())) {
      setTags([...tags, newTag]);
    }
    setTagInputValue(""); // Clear the input
    setTagSuggestions([]); // Clear suggestions
  };
  
  const handleTagSuggestionSelect = (tag) => {
    if (!tags.some((existingTag) => existingTag.id === tag.id)) {
      setTags([...tags, tag.tags_name]);
    }
    setTagInputValue("");
    setTagSuggestions([]);
  };
  
  const handleRemoveTag = (tagId) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };
  //End Tags Functions

  // const handleSubmit = () => {

  //   console.log('Submitting manuscript...');
    
  //   if (!title || !description || !adviser || !isChecked || tags.length === 0 || authors.length === 0) {
  //     Alert.alert("Info", "Please fill all required fields and agree to terms.");
  //     return;
  //   }



  //   console.log({ title, description, adviser, authors, tags, file: selectedFile});
  //   Alert.alert("Form Submitted", "Your submission has been saved.");
  // };

  console.log('Authors: ', authors);
  console.log('Tags: ', tags);
  console.log(selectedFile);

  const handleSubmit = async () => {
    console.log("Submitting manuscript...");
    
    
    const token = await getToken(); 

    // Validate required fields
    if (!title || !description || !adviser || !isChecked || tags.length === 0 || authors.length === 0) {
      Alert.alert("Info", "Please fill all required fields and agree to terms.");
      return;
    }
  
    try {
      const token = await getToken();
      setLoading(true); // Indicate loading state
  
      // Check if title already exists (adjust `checkIfTitleExists` for mobile)
      const titleExists = await checkIfTitleExists(title);
      if (titleExists) {
        Alert.alert(
          "Error",
          "Oops, this project already exists. You may track your project and update it if necessary."
        );
        return;
      }

  
      // Prepare `FormData`
      const formData = new FormData();
      formData.append("group_name", groupName);
      formData.append("man_doc_title", title);
      formData.append("man_doc_description", description);
      formData.append("man_doc_adviser", adviser);
      authors.forEach((author) => formData.append("name[]", author));
      tags.forEach((tag) => formData.append("tags_name[]", tag));
      const file = {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.name,
      };
      
      formData.append("man_doc_content", file);
      
  
    
      formData.append("section_id", sectionId);
      formData.append("task_id", taskId);
  
      console.log('Data: ', formData);


      // Submit the form data
      const response = await axios.post("/capstone/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.error("Error Details:", error);
      if (error.response) {
        console.error("Server Error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Error uploading capstone project.");
        setErrors(error.response.data.errors || {});
      } else if (error.request) {
        console.error("No Response:", error.request);
        Alert.alert("Error", "No response from the server. Please try again later.");
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false); 
    }
  };
  
  const checkIfTitleExists = async (title) => {
    
    const token = await getToken();
    
    console.log(token);
    try {
      const response = await axios.post('/check-title', { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Title exist: ', response.data.exists);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking title existence:', error);
      return false; 
    }
  };
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
       <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter the description or research abstract"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Adviser"
        value={adviser}
        onChangeText={setAdviser}
      />

      <View>
        {/* Author Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter author's name"
          value={authorInputValue}
          onChangeText={handleAuthorInputChange}
        />

       {/* Suggestions List */}
        <View style={styles.suggestions}>
          {authorSuggestions.length > 0 && (
            authorSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}  // Ensure each item has a unique key
                onPress={() => handleAuthorSuggestionSelect(item)}
                style={styles.suggestionItem}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>


        {/* Selected Authors*/}
        <View style={styles.tagsContainer}>
          {authors.map((item, index) => (
            <Chip
              key={index}
              style={styles.chip}
              onClose={() => handleRemoveAuthor(item)}
            >
              {item}
            </Chip>
          ))}
        </View>
      </View>
      
      <View>
    {/* Tag Input */}
    <TextInput
      style={styles.input}
      placeholder="Enter tags and press Enter"
      value={tagInputValue}
      onChangeText={handleTagInputChange}
      onSubmitEditing={handleAddTag} 
    />

      {/* Suggestions or "Add New Tag" Option */}
      {tagInputValue.trim() && (
        <View style={styles.suggestions}>
          {(tagSuggestions.length > 0 ? tagSuggestions : [{ id: "custom", tags_name: `Add "${tagInputValue}"` }])
            .map((item) => (
              <TouchableOpacity
                key={item.id} 
                onPress={() =>
                  item.id === "custom" ? handleAddTag() : handleTagSuggestionSelect(item)}
                style={styles.suggestionItem}
              >
                <Text>{item.tags_name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}


    {/* Selected Tags (Chips) */}
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          style={styles.chip}
          onClose={() => handleRemoveTag(tag)}
        >
          {tag}
        </Chip>
      ))}
    </View>
  </View>

      <View style={styles.fileUploadContainer}>
        <TouchableOpacity style={styles.fileButton} onPress={handleFileUpload}>
          <Text style={styles.fileButtonText}>
            {selectedFile ? selectedFile.name : "Choose File"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={isChecked ? "checked" : "unchecked"}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton} disabled={!isChecked}>
        Submit
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  suggestions: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    maxHeight: 100,
    marginTop: -10,
    marginBottom: 15,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  chip: {
    margin: 4,
  },
  fileUploadContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  fileButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#eaeaea",
  },
  fileButtonText: {
    fontSize: 16,
    color: "#555",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    padding: 5,
  },
});
