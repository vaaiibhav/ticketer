import React, { useRef, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Animated,
  Button,
} from "react-native";
import Login from "./Scenes/Login";
import HomeScene from "./Scenes/HomeScene";
import SideBar from "./Scenes/SideBar";
import GameMenu from "./Scenes/GameMenu";
import GameResult from "./Scenes/SubScenes/GameResult";
import TicketScene from "./Scenes/TicketScene";
import FinalAccount from "./Scenes/SubScenes/FinalAccount";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameRules from "./Scenes/SubScenes/GameRules";
import TicketDetails from "./Scenes/SubScenes/TicketDetails";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScene} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SideBar" component={SideBar} />
          <Stack.Screen name="GameMenu" component={GameMenu} />
          <Stack.Screen name="GameRules" component={GameRules} />
          <Stack.Screen name="TicketScene" component={TicketScene} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />
          <Stack.Screen name="FinalAccount" component={FinalAccount} />
          <Stack.Screen name="GameResult" component={GameResult} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
