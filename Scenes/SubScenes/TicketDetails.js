import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import { serverUrl } from "../../Utils/constants";
import useTicketStore from "../../Utils/useTicketStore";

const TicketDetails = () => {
  const { userDetails } = useTicketStore();
  const [ticketCard, setTicketCard] = useState([]);
  const [canceldTicket, setTicketCanceld] = useState(false);
  // Options for formatting the time
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour time format
    // timeZoneName: "short", // Include timezone abbreviation
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${serverUrl}tickets/get-my-ticket/${userDetails.userLoginID}`
        );
        setTicketCard(response?.data || []); // Assuming response.data.data is an array
      } catch (error) {
        console.error(error);
      }
    })();
  }, [canceldTicket]);

  const handleCancelTicket = async (ticketID) => {
    console.log("handleCancelTicket:", ticketID);

    // Implement ticket cancellation logic
    Alert.alert("Cancel Ticket", `Ticket with ID ${ticketID} cancelled.`);
    const canceledTicket = await axios.post(
      `${serverUrl}tickets/cancel-my-ticket/`,
      { userLoginID: userDetails.userLoginID, ticketID }
    );
    setTicketCanceld(!canceldTicket);
    console.log("canceledTicket:", canceledTicket);
  };

  const GenerateAllTickets = () => {
    if (!ticketCard.length) {
      return <Text style={styles.cardText}>No tickets Today.</Text>;
    }
    return ticketCard.map((ticket) => (
      <TouchableOpacity key={ticket.id} style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.column}>
            <Text style={styles.cardText}>{ticket.gameName}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardText}>Total :{ticket.ticketTotal}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardText}>
              {new Date(ticket.ticketPrintDateTime).toLocaleTimeString(
                "en-US",
                timeOptions
              )}
            </Text>
          </View>
          <View style={styles.column}>
            <Pressable
              style={styles.buttonResult}
              onPress={() => handleCancelTicket(ticket.ticketID)}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewer}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GenerateAllTickets />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1C2326",
    justifyContent: "center",
  },
  scrollViewer: {
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,
    width: "90%",
    borderRadius: 10,
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 1 }, // for iOS shadow
    shadowOpacity: 0.2, // for iOS shadow
    shadowRadius: 1, // for iOS shadow
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    justifyContent: "center",
    flex: 1,
  },
  columnCancel: {
    flex: 0.4,
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: "red",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
    borderColor: "black",
    //  1 px solid",
    textAlign: "center",
    color: "white",
  },
});

export default TicketDetails;
