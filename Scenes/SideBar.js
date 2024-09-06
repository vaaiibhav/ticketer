import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GameRules from "./SubScenes/GameRules";
import FinalAccount from "./SubScenes/FinalAccount";
import { serverUrl, gameAuth } from "../Utils/constants";
import useTicketStore from "../Utils/useTicketStore";
const SideBar = () => {
  const navigation = useNavigation();
  const [decodedToken, setDecodedToken] = useState(null);
  const { userDetails } = useTicketStore();
  useEffect(() => {
    setDecodedToken(userDetails);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome: {decodedToken ? decodedToken.userFullName : "Loading..."}
      </Text>
      <Text style={styles.text}>
        User ID: {decodedToken ? decodedToken.userLoginID : "Loading..."}
      </Text>
      <Text style={styles.text}>
        Balance: {decodedToken ? decodedToken.userBalance : "Loading..."}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("GameRules", { name: "vaaiibhav" })}
      >
        <Text style={styles.text}>Game Rules:</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("GameMenu", { name: "vaaiibhav" })}
      >
        <Text style={styles.buttonText}>Game Menu</Text>
      </Pressable>
      <Text style={styles.text}>Account:</Text>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate("FinalAccount", { name: "vaaiibhav" })
        }
      >
        <Text style={styles.buttonText}>Ticket Details</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate("FinalAccount", { name: "vaaiibhav" })
        }
      >
        <Text style={styles.buttonText}>View Accounts</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login", { name: "vaaiibhav" })}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
      {/* <FinalAccount /> */}
    </View>
  );
};

export default SideBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#A61414",
    borderColor: "brown",
    borderWidth: 2,
    borderStyle: "solid",
    marginTop: "3px",
    marginBottom: "3px",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  text: {
    color: "#1C2326",
    fontWeight: "bold",
    marginTop: "3px",
    marginBottom: "3px",
  },
});
