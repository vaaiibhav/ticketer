import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { serverUrl } from "../Utils/constants";
import axios from "axios";
const GameMenu = () => {
  const navigation = useNavigation();
  const [gameCards, setGameCards] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${serverUrl}games/`);
        console.log("response:", response);
        setGameCards(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  const GenerateCards = () => {
    const cards = [];
    for (let index = 0; index <= gameCards?.data?.length - 1; index++) {
      cards.push(
        <TouchableOpacity
          key={index}
          style={styles.card}
          // onPress={() =>
          //   navigation.navigate("TicketScene", {
          //     gameCardData: gameCards?.data[index],
          //   })
          // }
        >
          <View style={styles.cardBody}>
            <View style={styles.column}>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.open1 ||
                gameCards?.data[index]?.open1 == 0
                  ? gameCards?.data[index]?.open1
                  : "X"}
              </Text>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.open2 ||
                gameCards?.data[index]?.open2 == 0
                  ? gameCards?.data[index]?.open2
                  : "X"}
              </Text>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.open3 ||
                gameCards?.data[index]?.open3 == 0
                  ? gameCards?.data[index]?.open3
                  : "X"}
              </Text>
            </View>
            <View style={styles.column}>
              <Pressable
                style={styles.buttonResult}
                onPress={() =>
                  navigation.navigate("GameResult", {
                    gameCardData: gameCards?.data[index],
                  })
                }
              >
                <Text style={styles.gameTimeViewer}>Result</Text>
              </Pressable>
              <Text style={[styles.cardText, styles.redText]}>
                {gameCards?.data[index]?.gameName}{" "}
              </Text>

              <Text style={[styles.cardText, styles.redText]}>
                {gameCards?.data[index]?.openCenter ||
                gameCards?.data[index]?.openCenter == 0
                  ? gameCards?.data[index]?.openCenter
                  : "X"}
                {gameCards?.data[index]?.closeCenter ||
                gameCards?.data[index]?.closeCenter == 0
                  ? gameCards?.data[index]?.closeCenter
                  : "X"}
              </Text>
              <Text style={styles.gameTimeViewer}>
                {gameCards?.data[index]?.gameOpenStopTime}
                {""}-{""}
                {gameCards?.data[index]?.gameCloseStopTime}
              </Text>
              <Pressable
                style={styles.button}
                onPress={() =>
                  navigation.navigate("TicketScene", {
                    gameCardData: gameCards?.data[index],
                  })
                }
              >
                <Text style={styles.gameTimeViewer}>
                  {gameCards?.data[index]?.gameName}{" "}
                </Text>
              </Pressable>
            </View>
            <View style={styles.column}>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.close1 ||
                gameCards?.data[index]?.close1 == 0
                  ? gameCards?.data[index]?.close1
                  : "X"}
              </Text>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.close2 ||
                gameCards?.data[index]?.close2 == 0
                  ? gameCards?.data[index]?.close2
                  : "X"}
              </Text>
              <Text style={styles.cardText}>
                {gameCards?.data[index]?.close3 ||
                gameCards?.data[index]?.close3 == 0
                  ? gameCards?.data[index]?.close3
                  : "X"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return cards;
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
        <GenerateCards />
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
  cardText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  redText: {
    color: "#A61414",
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
    borderColor: "brown",
    borderWidth: 2,
    borderStyle: "solid",
  },
  gameTimeViewer: {
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonResult: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "yellow",
    borderColor: "orange",
    borderWidth: 2,
    borderStyle: "solid",
  },
});

export default GameMenu;
