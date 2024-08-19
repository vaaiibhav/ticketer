import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import useTicketStore from "../../Utils/useTicketStore";
import { serverUrl } from "../../Utils/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState, useEffect } from "react";

const FinalAccount = () => {
  const { userDetails } = useTicketStore();
  const {
    userLoginID,
    userFullName,
    userPercentage,
    userOpen,
    userClose,
    userJodi,
    userOTP,
    userODPCDPCTP,
    userOSPCSP,
  } = userDetails;
  const [accountData, setAccountData] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [gamesList, setGamesList] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedGameName, setSelectedGameName] = useState("");
  const [finalAccountData, setFinalAccountData] = useState("");

  useEffect(() => {
    (async () => {
      const getAllGames = await axios.get(`${serverUrl}games/`);
      if (getAllGames?.data) {
        setGamesList(getAllGames?.data);
        setSelectedGame(getAllGames?.data[0]?.gameID);
        setSelectedGameName(getAllGames?.data[0]?.gameName);
      }
    })();
  }, []);
  function extractData(tickets) {
    const reportMap = new Map();
    tickets.forEach((singleTicket) => {
      const {
        ticketDetails,
        userLoginID,
        open1,
        open2,
        open3,
        close1,
        close2,
        close3,
        openCenter,
        closeCenter,
        userPercentage,
        userOpen,
        userJodi,
        userClose,
        userOSPCSP,
        userOTP,
        userODPCDPCTP,
      } = singleTicket;

      let eachTicketDetails = JSON.parse(ticketDetails);
      let ticketSum = {};
      let openSale = 0,
        closeSale = 0;
      let openWinnings = 0,
        closeWinnings = 0,
        OSPWinnings = 0,
        ODPWinnings = 0,
        jodiWinnings = 0,
        OTPWinnings = 0;
      let CSPWinnings = 0,
        CDPWinnings = 0,
        CTPWinnings = 0;

      eachTicketDetails.forEach((singleTicketDetails) => {
        let { ticketFunction, ticketPanna, ticketAmount } = singleTicketDetails;
        ticketAmount = parseInt(ticketAmount, 10);

        if (!ticketSum[ticketFunction]) {
          ticketSum[ticketFunction] = {};
        }
        if (!ticketSum[ticketFunction][ticketPanna]) {
          ticketSum[ticketFunction][ticketPanna] = 0;
        }
        ticketSum[ticketFunction][ticketPanna] += ticketAmount;

        if (["O", "Jodi", "OSP", "ODP", "OTP"].includes(ticketFunction)) {
          openSale += ticketAmount;
        }
        if (["C", "CSP", "CDP", "CTP"].includes(ticketFunction)) {
          closeSale += ticketAmount;
        }

        if (ticketFunction === "O" && ticketPanna == openCenter) {
          openWinnings += +ticketAmount * +userOpen;
        }
        if (ticketFunction === "C" && ticketPanna == closeCenter) {
          closeWinnings += +ticketAmount * +userClose;
        }
        if (
          ticketFunction === "OSP" &&
          ticketAmount == "" + open1 + open2 + open3 + ""
        ) {
          OSPWinnings += +ticketAmount * +userOSPCSP;
        }
        if (
          ticketFunction === "ODP" &&
          ticketPanna == "" + open1 + open2 + open3 + ""
        ) {
          ODPWinnings += +ticketAmount * +userODPCDPCTP;
        }
        if (
          ticketFunction === "OTP" &&
          ticketPanna == "" + open1 + open2 + open3 + ""
        ) {
          OTPWinnings += +ticketAmount * +userOTP;
        }
        if (
          ticketFunction === "CSP" &&
          ticketPanna == "" + close1 + close2 + close3 + ""
        ) {
          CSPWinnings += +ticketAmount * +userOSPCSP;
        }
        if (
          ticketFunction === "CDP" &&
          ticketPanna == "" + close1 + close2 + close3 + ""
        ) {
          CDPWinnings += +ticketAmount * +userODPCDPCTP;
        }
        if (
          ticketFunction === "Jodi" &&
          ticketPanna == "" + openCenter + "" + closeCenter
        ) {
          jodiWinnings += +ticketAmount * +userJodi;
        }
        if (
          ticketFunction === "CTP" &&
          ticketPanna == "" + close1 + close2 + close3 + ""
        ) {
          CTPWinnings += +ticketAmount * +userOTP;
        }
      });

      const totalSale = openSale + closeSale;
      const comi = (userPercentage * totalSale) / 100;
      if (reportMap.has(userLoginID)) {
        let existingData = reportMap.get(userLoginID);
        existingData.openSale += openSale;
        existingData.closeSale += closeSale;
        existingData.totalSale += totalSale;
        existingData.comi += comi;
        existingData.openWinnings += openWinnings;
        existingData.jodiWinnings += jodiWinnings;
        existingData.closeWinnings += closeWinnings;
        existingData.OSPWinnings += OSPWinnings;
        existingData.ODPWinnings += ODPWinnings;
        existingData.OTPWinnings += OTPWinnings;
        existingData.CSPWinnings += CSPWinnings;
        existingData.CDPWinnings += CDPWinnings;
        existingData.CTPWinnings += CTPWinnings;
      } else {
        reportMap.set(userLoginID, {
          userLoginID,
          openSale,
          closeSale,
          totalSale,
          comi,
          jodiWinnings,
          openWinnings,
          closeWinnings,
          OSPWinnings,
          ODPWinnings,
          OTPWinnings,
          CSPWinnings,
          CDPWinnings,
          CTPWinnings,
        });
      }
    });

    const reportArray = Array.from(reportMap.values());
    return reportArray[0];
  }
  const setGameForFinalReports = async () => {
    try {
      const finalReport = await axios.get(
        `${serverUrl}users/user-final-reports`,
        {
          params: {
            userLoginID: userLoginID,
          },
        }
      );
      setFinalAccountData(finalReport?.data);
      console.log("finalAccountData:", finalAccountData);
    } catch (error) {
      console.error(error);
    }
  };
  const setGameForReports = async (gameID) => {
    try {
      const response = await axios.get(
        `${serverUrl}users/user-play-account/${userLoginID}`,
        {
          params: {
            gameID,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      const seeAccountData = extractData(response?.data);
      setAccountData(seeAccountData);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.dateViewer}>
        <Text>Welcome {userFullName}</Text>
        <View style={styles.AccountViewer}>
          <Button
            style={styles.dateButton}
            color="#A61414"
            onPress={() => setShowStartDatePicker(true)}
            title="Start Date"
          />
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          <Button
            onPress={() => setShowEndDatePicker(true)}
            title="End Date"
            color="#A61414"
            style={styles.dateButton}
          />
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
        <View>
          {gamesList &&
            gamesList.map((eachGame, eachIndex) => (
              <Button
                key={eachIndex}
                style={styles.gameListButton}
                color="#A61414"
                onPress={() => {
                  setGameForReports(eachGame?.gameID);
                  setSelectedGame(eachGame?.gameID);
                  setSelectedGameName(eachGame?.gameName);
                }}
                title={eachGame?.gameName}
              />
            ))}
          <Button
            style={styles.gameListButton}
            color="black"
            onPress={() => {
              setGameForFinalReports();
              setSelectedGame("final");
              setSelectedGameName("Final Report");
            }}
            title="Final"
          />
        </View>
        <Text>{selectedGameName}</Text>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>S</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>D</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>C</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>SP</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>DP</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>TP</Text>
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>
              <Text>{userDetails.userOpen ? userDetails.userOpen : "X"}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text>{userDetails.userJodi ? userDetails.userJodi : "X"}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text>{userDetails.userClose ? userDetails.userClose : "X"}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text>
                {userDetails.userOSPCSP ? userDetails.userOSPCSP : "X"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text>
                {userDetails.userODPCDPCTP ? userDetails.userODPCDPCTP : "X"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text>{userDetails.userOTP ? userDetails.userOTP : "X"}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        {selectedGame != "final" && (
          <View style={styles.AccountViewer}>
            <View style={styles.AccountViewerHalf}>
              <Text>Open Sale = {accountData?.["openSale"]}</Text>
              <Text>Close Sale = {accountData?.["closeSale"]}</Text>
              <Text>Total Sale ={accountData?.["totalSale"]}</Text>
              <Text>
                Commission ={parseFloat(accountData?.["comi"]).toFixed(2)}
              </Text>
              <Text style={styles.AccountViewerText}>
                Total Sale ={accountData?.["totalSale"]}
              </Text>
            </View>
            <View style={styles.AccountViewerHalf}>
              <Text>Open Winnings = {accountData?.["openWinnings"]}</Text>
              <Text>Close Winnings = {accountData?.["closeWinnings"]}</Text>
              <Text>Jodi Winnings = {accountData?.["jodiWinnings"]}</Text>
              <Text>
                OSP/CSP Winnings =
                {accountData?.["OSPWinnings"] +
                  "/" +
                  accountData?.["CSPWinnings"]}
              </Text>
              <Text>
                ODP/CDP Winnings =
                {accountData?.["ODPWinnings"] +
                  "/" +
                  accountData?.["CDPWinnings"]}
              </Text>
              <Text>
                OTP/CTP Winnings =
                {accountData?.["OTPWinnings"] +
                  "/" +
                  accountData?.["CTPWinnings"]}
              </Text>
              <Text style={styles.AccountViewerText}>
                Total Winnings =
                {accountData?.["openWinnings"] +
                  accountData?.["closeWinnings"] +
                  accountData?.["OSPWinnings"] +
                  accountData?.["ODPWinnings"] +
                  accountData?.["OTPWinnings"] +
                  accountData?.["CSPWinnings"] +
                  accountData?.["CDPWinnings"] +
                  accountData?.["CTPWinnings"] +
                  accountData?.["jodiWinnings"]}
              </Text>
              <Text>
                Final =
                {accountData?.["totalSale"] -
                  accountData?.["comi"] -
                  (accountData?.["openWinnings"] +
                    accountData?.["closeWinnings"] +
                    accountData?.["OSPWinnings"] +
                    accountData?.["ODPWinnings"] +
                    accountData?.["OTPWinnings"] +
                    accountData?.["CSPWinnings"] +
                    accountData?.["CDPWinnings"] +
                    accountData?.["CTPWinnings"] +
                    accountData?.["jodiWinnings"])}
              </Text>
            </View>
          </View>
        )}
        {selectedGame === "final" &&
          finalAccountData &&
          finalAccountData.map((eachfaData, index) => {
            const gameReports = JSON.parse(eachfaData.fReportGameReport);
            const parsedData = gameReports.map((item) => JSON.parse(item));
            // Display each fReportGameName = fReportTotal
            // Calculate total sum of all fReportTotal values
            const totalSum = parsedData.reduce(
              (acc, item) => acc + item.fReportTotal,
              0
            );
            // Display total sum
            return (
              <View key={index}>
                <Text style={styles.AccountName}>
                  {eachfaData.fReportUserName}
                </Text>
                <Text>{eachfaData.fReportDate}</Text>
                {parsedData.map((item, idx) => (
                  <Text
                    key={idx}
                  >{`${item.fReportGameName} = ${item.fReportTotal}`}</Text>
                ))}

                <Text style={styles.AccountViewerText}>Total: {totalSum}</Text>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default FinalAccount;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  AccountViewerText: {
    backgroundColor: "#A61414",
    padding: 5,
    color: "white",
  },
  AccountName: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  AccountViewer: {
    margin: 5,
    flexDirection: "row",
  },
  AccountViewerHalf: {
    padding: 5,
    flex: 1,
  },
  tableHeader: {
    backgroundColor: "#A61414",
  },
  dateViewer: {
    padding: 5,
  },
  gameListButton: {
    padding: 5,
    marginBottom: 2,
  },
  dateButton: {
    flex: 1,
    padding: 5,
  },
});
