import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

const Square = ({
  item: { value, onPress, status },
}: {
  item: { value: string; onPress: () => void; status: Status };
  index: number;
}) =>
  status !== Status.PLAYING || value ? (
    <View style={styles.square}>
      <Text>{value}</Text>
    </View>
  ) : (
    <TouchableOpacity style={styles.square} onPress={onPress}>
      <Text>{value}</Text>
    </TouchableOpacity>
  );

export default function Board({
  board,
}: {
  board: { value: string; onPress: () => void; status: Status }[];
}) {
  return (
    <View style={styles.board}>
      <FlatList
        data={board}
        renderItem={Square}
        keyExtractor={() => Math.random().toString()}
        numColumns={3}
      />
    </View>
  );
}
enum Status {
  PLAYING,
  PAUSED,
  DRAW,
}

const styles = StyleSheet.create({
  board: {
    width: 148,
    height: 148,
    borderWidth: 2,
  },
  square: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderWidth: 2,
  },
});
