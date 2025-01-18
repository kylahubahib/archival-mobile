import { Link, router } from "expo-router";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Avatar, IconButton, Menu, Provider, Title } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { getInitials } from "../../utils/utils";
import { url } from "../../utils/utils";

export default function ForumList({ posts, user }) {
  const [visibleMenuId, setVisibleMenuId] = useState(null);

  const openMenu = (id) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const handleViewPost= (id) => {
     router.push(`forum/view_post/${id}`);
  }

  // Render each post item
  const renderPost = ({ item }) => (
    
    <TouchableOpacity style={styles.postContainer} onPress={() => handleViewPost(item.id)}>
      <View  style={{flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          {/* <Avatar.Text size={35} label={getInitials(item.user?.name)} style={{backgroundColor: "#294996"}}/> */}
          <Avatar.Image
            size={48}
            source={{
              uri: item.user?.user_pic
                ? `${url.BASE_URL}/${item.user.user_pic}`
                : 'https://ui-avatars.com/api/?name=User&background=random',
            }}
          /> 
          <Title style={{ marginHorizontal: 10 }}>{item.user?.name || 'Anonymous'}</Title>
        </View>
        <Menu
          visible={visibleMenuId === item.id}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon={() => <Entypo name="dots-three-vertical" size={20} color="black" />}
              onPress={() => openMenu(item.id)}
            />
          }
        >
          {user?.name === item.user?.name && <Menu.Item onPress={() => console.log("Pressed")} title="Remove" />}
          <Menu.Item onPress={() => router.push("/forum/report_post/[postId]")} title="Report" />
        </Menu>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2} ellipsizeMode="tail">{item.body}</Text>
      <View style={{flexDirection:'row'}}>
          <Text>{item.viewCount} Views</Text>
      </View>
    </TouchableOpacity>
      
  );

  return (
      <View style={{ flex: 1 }}>
        {/* List of Posts */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.postList}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  postList: {
    marginVertical: 15,
  },
  postContainer: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 15,
    maxHeight: 220,
    paddingVertical: 20
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10
  },
  postContent: {
    marginRight: 30 ,
    marginBottom: 20,
  },
  viewLink: {
    fontSize: 16,
    color: "#007BFF",
  },
});
