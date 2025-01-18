import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Linking } from "react-native";
import { Button, Modal, Portal, Paragraph, Card, ActivityIndicator } from "react-native-paper";
import { getToken } from "../services/TokenService";
import axios from "../../utils/axios";
import { loadUser } from "../services/AuthService";
import { url } from "../../utils/utils";

export default function SubscriptionInformation(user) {
  const [transactionHistory, setTransactionHistory] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [personalSubscription, setPersonalSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isAffiliated, setIsAffiliated] = useState(!!user.user.is_affiliated);


  useEffect(() => {
    fetchSubscription();
  }, []);

  console.log(!!user.user.is_affiliated);

  const fetchSubscription = async () => {
    try {
      const token = await getToken();
      const response = await axios.get("/user-subscription", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPersonalSubscription(response.data.per_sub);
      setTransactionHistory(response.data.transactionHistory);
      setAgreement(response.data.agreement);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscription:", error.message || error);
      setLoading(false);
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  const handleRenewal = (planId) => {
    console.log(`Renewing subscription with plan ID: ${planId}`);
  };

  const removeAffiliation = () => {
    console.log("Removing affiliation");
    setIsAffiliated(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          {/* <Text style={styles.title}>Subscription Information</Text> */}
          <Text style={styles.subtitle}>
            Manage the subscription and billing of your account
          </Text>
        </View>
        {/* <Button
          mode="text"
          onPress={() => openModal("agreement")}
          labelStyle={styles.linkButton}
        >
          View Agreement
        </Button> */}
      </View>

      {personalSubscription ? (
        <View>
          <View style={styles.row}>
            <Text style={styles.planName}>
              {personalSubscription.plan.plan_name}
            </Text>
            <Button
              mode="outlined"
              onPress={() => openModal("transaction")}
              style={styles.button}
            >
              View Transaction
            </Button>
          </View>
          <Text style={styles.text}>
            <Text style={styles.bold}>Subscription expires at: </Text>
            {personalSubscription.end_date}
          </Text>
          <View style={styles.row}>
            <Button
              mode="outlined"
              style={[styles.button, styles.renewButton]}
              onPress={() => handleRenewal(personalSubscription.plan_id)}
            >
              Renew Subscription
            </Button>
          </View>
        </View>
      ) : isAffiliated === false ? (
        <View>
          <Text style={styles.text}>You are currently in the free plan.</Text>
          <View style={styles.row}>

          <Text style={{ color: "blue" }}>
            Go to the Archival Alchemist site to change your plan or affiliate a university
          </Text>
          <Button
            mode="outlined"
            style={styles.upgradeButton}
            onPress={() => Linking.openURL(`${url.BASE_URL}/home`)}
          >
            Archival Alchemist
          </Button>
            
            {/*<Button
              mode="outlined"
              style={styles.affiliateButton}
              onPress={() => setIsAffiliated(true)}
            >
              Affiliate a university
            </Button> */}
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.text}>
            You are currently affiliated with a university.
          </Text>
          <Button
            mode="outlined"
            style={styles.removeButton}
            onPress={removeAffiliation}
          >
            Remove Affiliation
          </Button>
        </View>
      )}

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          <Paragraph>{modalContent}</Paragraph>
          <Button onPress={closeModal}>Close</Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection:"column",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  linkButton: {
    color: "#007bff",
    textTransform: "none",
  },
  row: {
    flexDirection: "column",
    marginVertical: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    marginLeft: 8,
  },
  upgradeButton: {
    borderColor: "#007bff",
    color: "#007bff",
  },
  affiliateButton: {
    borderColor: "#4caf50",
    color: "#4caf50",
  },
  renewButton: {
    borderColor: "#007bff",
    color: "#007bff",
  },
  removeButton: {
    borderColor: "#ff5252",
    color: "#ff5252",
    marginTop: 10,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 16,
    borderRadius: 8,
  },
});
