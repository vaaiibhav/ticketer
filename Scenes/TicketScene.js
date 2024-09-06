import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Pressable, Alert, Modal } from "react-native";

import useTicketStore from "../Utils/useTicketStore";
import { serverUrl } from "../Utils/constants";
import {
  OSPArrayChecker,
  ODPArrayChecker,
  OTPArrayChecker,
} from "../Utils/limitArrays";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import axios from "axios";
const TicketScene = ({ route }) => {
  const [gameCardData, setGameCardData] = useState(route?.params?.gameCardData);
  const [todaysDate, setTodaysDate] = useState();
  const [openClose, setOpenClose] = useState("open");
  const previousOpenClose = useRef(0);
  const [functionLabel, setFunctionLabel] = useState("O");
  const { userDetails } = useTicketStore();
  const [userBalance, setUserBalance] = useState(userDetails?.userBalance);
  const [currentTicket, setCurrentTicket] = useState("");
  const [completTickets, setCompletTickets] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let newSingleAmount = "",
    newSinglePanna = "";
  const handleFunctionButton = (thisfunctionLabel) => {
    setFunctionLabel(
      functionLabel === thisfunctionLabel ? functionLabel : thisfunctionLabel
    );
  };
  const getOpenClose = () => {
    let isItOpen;
    if (todaysDate && gameCardData?.gameOpenStopTime > todaysDate[1]) {
      isItOpen = "open";
      setFunctionLabel("O");
    } else if (todaysDate && gameCardData?.gameCloseStopTime > todaysDate[1]) {
      isItOpen = "close";
      setFunctionLabel("C");
    } else {
      isItOpen = "block";
      setFunctionLabel("");
    }
    return isItOpen;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getDate = await axios.get(`${serverUrl}games/get-date`);
        setTodaysDate(getDate?.data);
        const getRunningGame = await axios.get(
          `${serverUrl}games/get-running-game/${gameCardData.gameID}`
        );
        setOpenClose(getOpenClose());
        // getRunningGame?.data?.length > 0 ? 'close' : 'open');
      } catch (error) {
        console.error("get-date", error);
      }
    };
    fetchData();
  }, [completTickets]);

  const handleCalculatorButton = (calculatorLabel) => {
    if (isNaN(calculatorLabel)) {
      return 0;
    }
    setCurrentTicket(currentTicket + calculatorLabel);
  };
  const displayCurrentTicket = () => {
    switch (functionLabel) {
      case "O":
        newSinglePanna = currentTicket.slice(0, 1);
        newSingleAmount = currentTicket.slice(1);
        break;
      case "OSP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !OSPArrayChecker.includes(newSinglePanna)
        ) {
          setCurrentTicket("");
        }

        break;
      case "Jodi":
        newSinglePanna = currentTicket.slice(0, 2);
        newSingleAmount = currentTicket.slice(2);
        break;
      case "ODP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !ODPArrayChecker.includes(newSinglePanna)
        )
          setCurrentTicket("");
        break;
      case "OTP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !OTPArrayChecker.includes(newSinglePanna)
        )
          setCurrentTicket("");
        break;
      case "SP":
        newSinglePanna = currentTicket.slice(0, 1);
        newSingleAmount = currentTicket.slice(1);
        break;
      case "C":
        newSinglePanna = currentTicket.slice(0, 1);
        newSingleAmount = currentTicket.slice(1);
        break;
      case "CSP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !OSPArrayChecker.includes(newSinglePanna)
        )
          setCurrentTicket("");
        break;
      case "CDP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !ODPArrayChecker.includes(newSinglePanna)
        )
          setCurrentTicket("");
        break;
      case "CTP":
        newSinglePanna = currentTicket.slice(0, 3);
        newSingleAmount = currentTicket.slice(3);
        if (
          newSinglePanna.length == 3 &&
          !OTPArrayChecker.includes(newSinglePanna)
        )
          setCurrentTicket("");
        break;

      default:
        break;
    }
    return newSinglePanna ? ` ${newSinglePanna} X ${newSingleAmount}` : "0";
  };
  const handleExtrafunctionButton = (extrafunctionLabel) => {
    switch (extrafunctionLabel) {
      case "E":
        const getTotalTicketValue = getTotal();
        if (+getTotalTicketValue > +userBalance)
          return alert("Not Enough Balance");
        // If calculatorLabel is "E"
        // Extract digits entered before "E" and update ticketAmount
        let singleTicket = {
          ticketFunction: functionLabel,
          ticketPanna: newSinglePanna,
          ticketAmount: newSingleAmount,
        };
        setCompletTickets((current) => [...current, singleTicket]);
        setUserBalance(+userBalance - parseInt(getTotalTicketValue));
        break;

      case "R":
        setCurrentTicket("");
        break;
      case "K":
        setCurrentTicket("");
        setUserBalance(userDetails?.userBalance);
        setCompletTickets([]);
        break;

      case "P":
        printTicket();
        break;
      default:
        break;
    }
    newSingleAmount = "";
    newSinglePanna = "";
    setCurrentTicket("");
  };

  const printTicket = async () => {
    setOpenClose(previousOpenClose.current.openClose);
    if (completTickets.length < 1) {
      return Alert.alert("Cant Print Empty Ticket");
    }

    try {
      const ticketPrint = await axios.post(`${serverUrl}tickets/new-ticket`, {
        completTickets,
        gameID: gameCardData?.gameID,
        userLoginID: userDetails?.userLoginID,
        ticketTotal: getTotal(),
      });

      if (ticketPrint?.data) {
        const todaysDate = new Date().toLocaleString().split(", ");

        let html = `
        <style>
          h1 {
            font-size: 62px; /* Double the size */
          }
          h2 {
            font-size: 52px; /* Double the size */
          }
          h3 {
            font-size: 42px; /* Double the size */
          }
        </style>
              <h3 >***** Ticket *****</h1>
              <h3>Date: ${todaysDate[0]} : ${todaysDate[1]}</h3>
              <h3>Game: ${gameCardData?.gameName}</h3>
              <hr />
          `;

        completTickets.forEach((ticket) => {
          html += `
                  <h2>${ticket.ticketFunction} => ${ticket.ticketPanna} X ${ticket.ticketAmount}</h1>
              `;
        });

        html += `
              <h1><strong>Total: ${getTotal()}</strong></h1>
              <hr />
              <h2>***** Thank You *****</h2>
          `;

        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri).then(() => {
          setCompletTickets([]);
          setCurrentTicket("");
        });
        Alert.alert("Success", "Ticket printed and shared successfully");
        // Need to Verify this
      } else {
        Alert.alert("Failure", "Ticket printing failed");
      }
    } catch (error) {
      Alert.alert("Print Error", error.message);
    }
  };

  const renderExtrafunctionButtons = (extrafunctionLabel) => {
    return (
      <Pressable
        key={extrafunctionLabel}
        style={
          extrafunctionLabel === "F"
            ? styles.extraFunctionButtonF
            : extrafunctionLabel === "P"
            ? styles.extraFunctionButtonP
            : extrafunctionLabel === "E"
            ? styles.extraFunctionButtonE
            : styles.extraFunctionButton
        }
        onPress={() => handleExtrafunctionButton(extrafunctionLabel)}
      >
        <Text style={styles.functionButtonText}>{extrafunctionLabel}</Text>
      </Pressable>
    );
  };

  const renderFunctionButton = (thisfunctionLabel) => {
    const isActive = thisfunctionLabel === functionLabel;
    const isDisabled =
      (openClose === "open" &&
        ["C", "CSP", "CDP", "CTP", "SP"].includes(thisfunctionLabel)) ||
      (openClose === "close" &&
        ["O", "OSP", "Jodi", "ODP", "OTP"].includes(thisfunctionLabel)) ||
      (openClose === "block" &&
        [
          "C",
          "CSP",
          "CDP",
          "CTP",
          "O",
          "OSP",
          "Jodi",
          "ODP",
          "OTP",
          "SP",
          "DP",
        ].includes(thisfunctionLabel));
    return (
      <Pressable
        key={thisfunctionLabel}
        style={[
          styles.extraFunctionButtonYellow,
          isActive && styles.functionButtonActive,
          isDisabled && styles.disabledButton,
        ]}
        onPress={() => !isDisabled && handleFunctionButton(thisfunctionLabel)}
      >
        <Text
          style={[
            styles.functionButtonTextYellow,
            isDisabled && styles.disabledButtonText,
          ]}
        >
          {thisfunctionLabel}
        </Text>
      </Pressable>
    );
  };
  const renderCalculatorButtons = (calculatorLabel) => {
    return (
      <Pressable
        key={calculatorLabel}
        style={[styles.calculatorButtons]}
        onPress={() => handleCalculatorButton(calculatorLabel)}
      >
        <Text style={styles.calculatorButtonText}>{calculatorLabel}</Text>
      </Pressable>
    );
  };

  const extrafunctionButtons = ["E", "R", "K", "F", "P"];
  const functionButtons = [
    "O",
    "OSP",
    "Jodi",
    "ODP",
    "OTP",
    "SP",
    "C",
    "CSP",
    "CDP",
    "CTP",
    "DP",
  ];
  const calculatorButtons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "00",
    "*",
  ];
  const renderedFunctionButtons = functionButtons.map((button) =>
    renderFunctionButton(button)
  );
  const renderedCalculatorButtons = calculatorButtons.map((button) =>
    renderCalculatorButtons(button)
  );
  const renderdExtrafunctionButtons = extrafunctionButtons.map((button) =>
    renderExtrafunctionButtons(button)
  );
  const renderModalContent = () => {
    return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bluetooth Devices</Text>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              pairedDevices?.map((device, index) => (
                <Pressable
                  key={index}
                  style={styles.modalDeviceButton}
                  onPress={() => {
                    connectPrinter(device.address);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.modalDeviceText}>
                    {device.name || "Unnamed Device"}
                  </Text>
                </Pressable>
              ))
            )}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const getTotal = () => {
    let Total = completTickets.reduce((acc = 0, ticket) => {
      return acc + +ticket.ticketAmount;
    }, 0);
    return Total;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDisplay}>
        <View style={styles.topUpDisplay}>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              alignContent: "center",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {todaysDate && todaysDate[0] + " : " + todaysDate[1]}
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
              alignContent: "center",
            }}
          >
            {gameCardData?.gameName}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              flex: 1,
              color: "white",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            {userBalance}
          </Text>
        </View>
        <View style={styles.topDownDisplay}>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              flex: 1,
              textAlign: "center",
              alignContent: "center",
            }}
          >
            {gameCardData?.gameOpenStopTime
              ? gameCardData?.gameOpenStopTime
              : "XX:XX"}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              flex: 1,
              textAlign: "center",
              alignContent: "center",
            }}
          >
            {gameCardData?.open1 || gameCardData?.open1 == 0
              ? gameCardData?.open1
              : "X"}
            {gameCardData?.open2 || gameCardData?.open2 == 0
              ? gameCardData?.open2
              : "X"}
            {gameCardData?.open3 || gameCardData?.open3 == 0
              ? gameCardData?.open3
              : "X"}
            -
            {gameCardData?.openCenter || gameCardData?.openCenter == 0
              ? gameCardData?.openCenter
              : "X"}
            {gameCardData?.closeCenter || gameCardData?.closeCenter == 0
              ? gameCardData?.closeCenter
              : "X"}
            -
            {gameCardData?.close1 || gameCardData?.close1 == 0
              ? gameCardData?.close1
              : "X"}
            {gameCardData?.close2 || gameCardData?.close2 == 0
              ? gameCardData?.close2
              : "X"}
            {gameCardData?.close3 || gameCardData?.close3 == 0
              ? gameCardData?.close3
              : "X"}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              flex: 1,
              alignContent: "center",
              textAlign: "center",
            }}
          >
            {gameCardData?.gameCloseStopTime
              ? gameCardData?.gameCloseStopTime
              : "XX:XX"}
          </Text>
        </View>
      </View>
      <View style={styles.middleDisplay}>
        <View style={styles.ticketDisplay}>
          <Text style={styles.displayCurrentTickets}>
            {displayCurrentTicket()}
          </Text>
          <Text style={styles.completeTickets}>
            {completTickets.map(
              (eachTicket, ticketIndex) =>
                eachTicket.ticketPanna && (
                  <Text key={ticketIndex}>{` ${
                    eachTicket.ticketFunction.includes("C") ? "X" : ""
                  }${eachTicket.ticketPanna} X ${
                    eachTicket.ticketAmount
                  } ||  `}</Text>
                )
            )}
          </Text>
        </View>
        <View style={styles.totalDisplay}>
          <Text style={styles.totalDisplayText}>{`Total:${getTotal()}`}</Text>
        </View>
      </View>
      <View style={styles.functionDisplay}>
        <View style={styles.functionDisplayUp}>
          {renderedFunctionButtons.slice(0, 6)}
        </View>
        <View style={styles.functionDisplayDown}>
          {renderedFunctionButtons.slice(6)}
        </View>
      </View>
      <View style={styles.bottomDisplay}>
        <View style={styles.calculatorDisplay}>
          <View style={styles.calculatorDisplayRow}>
            {renderedCalculatorButtons.slice(0, 3)}
          </View>
          <View style={styles.calculatorDisplayRow}>
            {renderedCalculatorButtons.slice(3, 6)}
          </View>
          <View style={styles.calculatorDisplayRow}>
            {renderedCalculatorButtons.slice(6, 9)}
          </View>
          <View style={styles.calculatorDisplayRow}>
            {renderedCalculatorButtons.slice(9)}
          </View>
        </View>

        <View style={styles.extraFunctionDisplay}>
          {renderdExtrafunctionButtons}
        </View>
      </View>
      {renderModalContent()}
    </View>
  );
};

export default TicketScene;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topDisplay: {
    backgroundColor: "#A61414",
    flex: 2,
    flexDirection: "column",
  },
  topUpDisplay: {
    flexDirection: "row",
    flex: 1,
  },
  functionButtonActive: {
    backgroundColor: "#A61414",
    borderRadius: 3,
    width: "15%",
  },
  calculatorButtons: {
    backgroundColor: "#1C2326",
    borderRadius: 5,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
  },
  functionButton: {
    backgroundColor: "#1C2326",
    borderRadius: 3,
    width: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  extraFunctionButton: {
    backgroundColor: "#1C2326",
    borderRadius: 3,
    width: "50%",
    height: "12%",
    marginLeft: "5%",
    marginRight: "5%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  extraFunctionButtonE: {
    backgroundColor: "green",
    borderRadius: 3,
    width: "80%",
    height: "20%",
    marginLeft: "5%",
    marginRight: "5%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  extraFunctionButtonYellow: {
    backgroundColor: "yellow",
    border: "1px black solid",
    color: "black",
    borderRadius: 3,
    width: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  extraFunctionButtonP: {
    backgroundColor: "#A61414",
    borderRadius: 3,
    width: "80%",
    height: "20%",
    marginLeft: "5%",
    marginRight: "5%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  extraFunctionButtonF: {
    backgroundColor: "blue",
    borderRadius: 3,
    width: "80%",
    height: "20%",
    marginLeft: "5%",
    marginRight: "5%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  calculatorButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 26,
  },
  functionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  functionButtonTextYellow: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  topDownDisplay: {
    flexDirection: "row",
    flex: 1,
  },
  middleDisplay: {
    flex: 6,
    padding: 5,
  },
  ticketDisplay: {
    flex: 10,
  },
  functionDisplayUp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  functionDisplayDown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  functionDisplay: {
    flexDirection: "column",
    flex: 2,
    border: "1px solid black",
    gap: 2,
  },
  completeTickets: {
    fontSize: 26,
    fontWeight: "bold",
  },
  displayCurrentTickets: {
    fontSize: 24,
    color: "blue",
    fontWeight: "bold",
  },
  totalDisplay: {
    backgroundColor: "green",
    width: "auto",
    height: "auto",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 3,
  },
  totalDisplayText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  bottomDisplay: {
    flexDirection: "row",
    flex: 8,
  },
  calculatorDisplayRow: {
    justifyContent: "center",
    gap: 3,
    flex: 1,
    flexDirection: "row",
  },
  calculatorDisplay: {
    flex: 4,
    gap: 3,
  },
  extraFunctionDisplay: {
    flex: 2,
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 4,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC", // Light gray color for disabled buttons
    borderRadius: 3,
    width: 50,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  disabledButtonText: {
    color: "#888888", // Gray color for disabled button text
    fontWeight: "bold",
    fontSize: 16,
  },
  pairedDevices: {
    padding: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  h1: {
    fontSize: 62,
  },
  h2: {
    fontSize: 52,
  },
  modalDeviceButton: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  modalDeviceText: {
    fontSize: 16,
  },
  modalCloseButton: {
    padding: 16,
    marginTop: 16,
    backgroundColor: "red",
    borderRadius: 10,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
