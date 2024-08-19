import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { serverUrl } from "../Utils/constants";
import axios from "axios";
import useTicketStore from "../Utils/useTicketStore";

import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const Login = () => {
  const navigation = useNavigation();
  const [userLoginID, setUserLoginID] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [displayError, setDisplayError] = useState("");
  const { updateUserToken, updateUserDetails } = useTicketStore();
  const [showLogin, setShowLogin] = useState(false);

  const handlePermissionsGranted = () => {
    console.log("Permissions granted");
  };

  const handleLogin = async () => {
    setDisplayError("");
    if (userLoginID === "" || userPassword === "") {
      return setDisplayError("Empty Data");
    }
    try {
      const loginResponse = await axios.post(`${serverUrl}users/login-user`, {
        userLoginID,
        userPassword,
      });
      if (loginResponse?.data?.error)
        return setDisplayError(loginResponse?.data?.error);
      if (loginResponse?.data) return saveLogin(loginResponse?.data);
    } catch (error) {
      console.log("error:", error);
      return setDisplayError(JSON.stringify(error?.response?.data));
    }
    setDisplayError("Invalid LoginID or Password");
  };

  const saveLogin = async (token) => {
    if (!token) return console.error("No Token", token);
    try {
      updateUserToken(token);
      updateUserDetails(token);
      setDisplayError("success");
      navigation.navigate("SideBar", { name: "vaaiibhav" });
    } catch (error) {
      console.log("error:", JSON.stringify(error));
    }
  };

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationY > 50) {
      setShowLogin(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent} minDeltaY={10}>
        <View style={styles.fullContainer}>
          <Pressable
            style={styles.hiddenButton}
            onPress={() => setShowLogin(true)}
          >
            <Text style={styles.text}>{"-----"}</Text>
          </Pressable>
          {showLogin && (
            <>
              {displayError && (
                <Text style={styles.errorText}>* {displayError}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Login ID"
                onChangeText={(text) => setUserLoginID(text)}
                value={userLoginID}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => setUserPassword(text)}
                value={userPassword}
                secureTextEntry={true}
              />
              <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.text}>{"Login"}</Text>
              </Pressable>
            </>
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: { color: "red" },
  input: {
    height: 40,
    width: "100%",
    borderColor: "brown",
    color: "brown",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  hiddenButton: {
    backgroundColor: "white",
    borderColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Login;
