import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import SelectMode from "./components/SelectMode";
import Board from "./components/Board";
import { calculateWinner, calculateDraw, calculateBestMove } from "./utility";

enum Status {
  PLAYING,
  PAUSED,
  DRAW,
}

export default function App() {
  const [board, setBoard] = useState<Array<"X" | "O">>(Array(9).fill(null));
  const [next, setNext] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string>();
  const [status, setStatus] = useState(Status.PLAYING);
  const [players, setPlayers] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const wnr = calculateWinner(board);
    if (wnr) {
      setStatus(Status.PAUSED);
      setWinner(wnr);
    } else if (calculateDraw(board)) {
      setStatus(Status.DRAW);
    } else if (next === "O" && players === 1) {
      makeAIMove();
    }
  }, [board]);

  useEffect(() => {}, [next]);

  const onPress = (index: number) => {
    setBoard((board) => {
      return [...board.slice(0, index), next, ...board.slice(index + 1)];
    });
    setNext((next) => (next === "X" ? "O" : "X"));
  };

  const onReset = () => {
    setBoard(Array(9).fill(null));
    setNext("X");
    setWinner(undefined);
    setStatus(Status.PLAYING);
  };

  const getStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (status === Status.DRAW) return "Draw";
    return `Next: ${next}`;
  };

  const makeAIMove = () => {
    const index = calculateBestMove(board);
    if (index !== -1) {
      setBoard((board) => {
        return [...board.slice(0, index), "O", ...board.slice(index + 1)];
      });
      setNext("X");
    }
  };

  if (!players) {
    return <SelectMode setPlayers={setPlayers} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TIC TAC TOE</Text>
      <Board
        board={board.map((value, i) => ({
          value,
          onPress: () => onPress(i),
          status,
        }))}
      />
      <Text style={styles.status}>{getStatus()}</Text>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button title="RESET" color="red" onPress={onReset} />
        </View>
        <View style={styles.button}>
          <Button
            title="BACK"
            onPress={() => {
              onReset();
              setPlayers(0);
            }}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    margin: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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
  status: {
    margin: 16,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginHorizontal: 10,
    width: 100,
  },
});
