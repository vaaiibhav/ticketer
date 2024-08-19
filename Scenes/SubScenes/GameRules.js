import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { DataTable } from "react-native-paper";
import useTicketStore from "../../Utils/useTicketStore";

const GameRules = () => {
  const { userDetails } = useTicketStore();

  return (
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
          {userDetails.userOpen ? userDetails.userOpen : "X"}
        </DataTable.Cell>
        <DataTable.Cell>
          {userDetails.userJodi ? userDetails.userJodi : "X"}
        </DataTable.Cell>
        <DataTable.Cell>
          {userDetails.userClose ? userDetails.userClose : "X"}
        </DataTable.Cell>
        <DataTable.Cell>
          {userDetails.userOSPCSP ? userDetails.userOSPCSP : "X"}
        </DataTable.Cell>
        <DataTable.Cell>
          {userDetails.userODPCDPCTP ? userDetails.userODPCDPCTP : "X"}
        </DataTable.Cell>
        <DataTable.Cell>
          {userDetails.userOTP ? userDetails.userOTP : "X"}
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default GameRules;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  tableHeader: {
    backgroundColor: "#A61414",
  },
});
