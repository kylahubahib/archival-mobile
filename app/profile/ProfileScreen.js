import { Link } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Avatar, IconButton, List, Provider as PaperProvider } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { url } from "../../utils/utils";
import { loadUser } from "../services/AuthService";
import SubscriptionInformation from "./subscription_info";
import ProfileInformation from "./profile_info";

export default function ProfileScreen() { 
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  },[user])

  const getUser = async () => {
    const response = await loadUser(); 
    setUser(response);
  };

  const handleImagePick = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the media library is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square cropping
      quality: 1, // High-quality image
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      await updateProfilePic(selectedImage);
    }
  };

  const updateProfilePic = async (newImage) => {
    console.log(newImage);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#e9f1ff" }}>
        <View style={styles.profileContainer}>
          {/* <Avatar.Text size={100} label="XD" /> */}
          <View style={{ position: "relative", alignItems: "center" }}>
            <Image
              style={{
                height: 170,
                width: 170,
                borderRadius: 999,
                backgroundColor: "#606060",
                borderWidth: 8,
                borderColor: "#294996",
              }}
              source={{
                uri: user?.user_pic
                  ? `${url.BASE_URL}/${user.user_pic}`
                  : "https://ui-avatars.com/api/?name=Anonymous&background=random",
              }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                backgroundColor: "white",
                borderRadius: 999,
                borderColor: "#294996",
                borderWidth: 5,
                // padding: ,
              }}
              onPress={handleImagePick}
            >
              <IconButton
                icon="pencil"
                size={20}
                iconColor="#294996"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileText}>{user?.name}</Text>
          <Text style={styles.profileSubText}>Joined Since {new Date(user?.created_at).getFullYear()}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.menuContainer}>
          <List.AccordionGroup>
            <List.Accordion
              title="Subscription Information"
              id="1"
              left={(props) => <List.Icon {...props} icon="card-account-details-outline" />}
              style={styles.menuItem}
            >
              <View style={styles.accordionContent}>
              <SubscriptionInformation user={user} />
              </View>
            </List.Accordion>

            <List.Accordion
              title="Account Information"
              id="2"
              left={(props) => <List.Icon {...props} icon="account-outline" />}
              style={styles.menuItem}
            >
              <View style={styles.accordionContent}>
                {/* <Text style={styles.contentText}>Email: johndoe@example.com</Text>
                <Text style={styles.contentText}>Phone: +1234567890</Text> */}
                <ProfileInformation user={user} />
              </View>
            </List.Accordion>

            <List.Accordion
              title="Change Password"
              id="3"
              left={(props) => <List.Icon {...props} icon="lock-outline" />}
              style={styles.menuItem}
            >
              <View style={styles.accordionContent}>
                <Link href="/change-password" asChild>
                  <Text style={styles.linkText}>Go to Change Password</Text>
                </Link>
              </View>
            </List.Accordion>

            {/* <List.Accordion
              title="Deactivate Account"
              id="4"
              left={(props) => <List.Icon {...props} icon="account-remove-outline" />}
              style={styles.menuItem}
            >
              <View style={styles.accordionContent}>
                <Text style={styles.contentText}>To deactivate your account, please contact support.</Text>
              </View>
            </List.Accordion> */}
          </List.AccordionGroup>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingVertical: 40,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#294996",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileText: {
    marginVertical: 10,
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  profileSubText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  menuContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  accordionContent: {
    padding: 15,
    backgroundColor: "white",
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 2,
  },
  linkText: {
    fontSize: 16,
    color: "#007bff",
    paddingVertical: 2,
  },
});
