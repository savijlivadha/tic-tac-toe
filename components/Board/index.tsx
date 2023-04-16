import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { IconButton } from "@react-native-material/core";
import { Entypo, Feather } from '@expo/vector-icons';

export const X = <Feather name="x" size={48} color="black" />;
export const O = <Entypo name="circle" size={36} color="black" />;

const Square = ({
  item: { value, onPress, status, thinking },
  index,
}: {
  item: { value: string; onPress: () => void; status: Status, thinking: boolean };
  index: number;
}) => {
  const style = [
    styles.square,
    index % 3 === 2 ? styles.noBorderRight : null,
    index > 5 ? styles.noBorderBottom : null,
  ]
  return status !== Status.PLAYING || value ? (
    <IconButton disabled={thinking} style={style} icon={() => value ? value === "O" ? O : X : null} />
  ) : (
    <IconButton disabled={thinking} style={style} onPress={onPress} />
  );
}

export default function Board({
  board,
}: {
  board: { value: string; onPress: () => void; status: Status, thinking: boolean }[];
}) {
  return (
    <View>
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
  square: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 0,
  },
  noBorderRight: {
    borderWidth: 0,
    borderRightWidth: 0,
  },
  noBorderBottom: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
});
