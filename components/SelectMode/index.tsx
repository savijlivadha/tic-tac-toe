import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function SelectMode({
  setPlayers,
}: {
  setPlayers: (num: 1 | 2) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Text>Choose mode</Text>
      </View>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button title="AI" onPress={() => setPlayers(1)} />
        </View>
        <View style={styles.button}>
          <Button title="HUMAN" onPress={() => setPlayers(2)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    width: 100,
  },
});
