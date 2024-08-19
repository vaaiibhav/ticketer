import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { serverUrl } from "../../Utils/constants";
import { useRoute } from "@react-navigation/native";
import moment from "moment";

const GameResult = () => {
  const route = useRoute();
  const { gameID, gameName } = route?.params?.gameCardData;
  const [viewGameWinnings, setGameWinnings] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const dateGameResults = await axios.get(
          `${serverUrl}games/view-results`,
          {
            params: { gameID },
          }
        );
        setGameWinnings(dateGameResults?.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [gameID]);

  // Helper function to format date
  const formatDate = (dateString) => moment(dateString).format("YYYY-MM-DD");

  // Process the game winnings data into weeks
  const processGameWinnings = (data) => {
    const weeks = [];
    let currentWeek = [];
    data.forEach((winning, index) => {
      if (index % 7 === 0 && index !== 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(winning);
    });
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    return weeks;
  };

  const weeks = processGameWinnings(viewGameWinnings);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.tableHeader}>{gameName}</Text>
        <Text style={styles.tableHeader}>Week</Text>
        <FlatList
          data={weeks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const startDate = formatDate(item[0]?.winningDate);
            const endDate = formatDate(item[item.length - 1]?.winningDate);
            return (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={styles.tableCell}
                >{`${startDate} to ${endDate}`}</Text>
                <FlatList
                  data={item}
                  keyExtractor={(winning, idx) => idx.toString()}
                  renderItem={({ item: winning }) => (
                    <View style={styles.card}>
                      <Text style={styles.tableHeader}>
                        {winning.winningDate}
                      </Text>
                      <View style={styles.cardBody}>
                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>{winning.open1}</Text>
                          <Text style={styles.cardTitle}>{winning.open2}</Text>
                          <Text style={styles.cardTitle}>{winning.open3}</Text>
                        </View>

                        <Text style={styles.cardTitle}>
                          {winning.openCenter} {winning.closeCenter}
                        </Text>

                        <View style={styles.row}>
                          <Text style={styles.cardTitle}>{winning.close1}</Text>
                          <Text style={styles.cardTitle}>{winning.close2}</Text>
                          <Text style={styles.cardTitle}>{winning.close3}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 24,
    color: "#007bff",
  },
  card: {
    backgroundColor: "yellow",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    marginBottom: 10,
    flexDirection: "row",
    textAlign: "center",
    alignContent: "center",
    color: "red",
  },
  cardTitle: {
    fontSize: 18,
    margin: 15,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  cardBody: {
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "column",
    marginBottom: 16,
  },
  tableCell: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default GameResult;
