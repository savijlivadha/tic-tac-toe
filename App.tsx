import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@react-native-material/core";
import SelectMode from "./components/SelectMode";
import Board, { X, O } from "./components/Board";
import { calculateWinner, calculateDraw, calculateBestMove } from "./utility";
import { ActivityIndicator } from "@react-native-material/core";

enum Status {
  PLAYING,
  PAUSED,
  DRAW,
}

type AppState = {
  preLoaded: boolean,
  board: Array<"X" | "O">,
  next: "X" | "O",
  winner?: string,
  status: Status,
  players: 0 | 1 | 2,
  thinking: boolean,
};

class App extends Component {
  state: AppState = {
    preLoaded: false,
    board: Array(9).fill(null),
    next: "X",
    status: Status.PLAYING,
    players: 0,
    thinking: false,
  };

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({
        preLoaded: true,
      });
    }, 100);
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<AppState>): void {
    const {
      board,
    } = this.state;

    if (prevState.board.join('') === board.join('')) return;

    const wnr = calculateWinner(board);
    if (wnr) {
      this.setState({
        status: Status.PAUSED,
        winner: wnr,
        thinking: false,
      });
    } else if (calculateDraw(board)) {
      this.setState({
        status: Status.DRAW,
        thinking: false,
      });
    }
  }

  onPress = (index: number) => {
    const callback = () => {
      const {
        next,
        players,
      } = this.state;

      if (next === "O" && players === 1) {
        this.makeAIMove();
      }
    };

    this.setState(({ board, next }: AppState) => ({
      board: [...board.slice(0, index), next, ...board.slice(index + 1)],
      next: next === "X" ? "O" : "X",
    }), callback);
  };

  onReset = () => {
    this.setState({
      board: Array(9).fill(null),
      next: "X",
      winner: undefined,
      status: Status.PLAYING,
      thinking: false,
    });
  };

  getStatus = () => {
    const {
      next,
      status,
      winner,
      thinking,
    } = this.state;

    if (thinking) return (
      <>
        <ActivityIndicator />
        &nbsp;
        Thinking...
      </>
    );

    if (winner) return `Winner: ${winner}`;
    if (status === Status.DRAW) return "Draw";
    return `Next: ${next}`;
  };

  makeAIMove = () => {
    const {
      board,
    } = this.state;

    const index = calculateBestMove(board);
    if (index !== -1) {
      this.setState({
        thinking: true,
      }, () => {
        setTimeout(() => {
          this.setState(({ board }: AppState) => ({
            board: [...board.slice(0, index), "O", ...board.slice(index + 1)],
            next: "X",
            thinking: false,
          }));
        }, 500);
      });
    }
  };

  setPlayers = (players: 0 | 1 | 2) => this.setState({ players });

  render(): React.ReactNode {
    const {
      preLoaded,
      board,
      status,
      players,
      thinking,
    } = this.state;

    let MainContent;

    if (players) {
      MainContent = (
        <>
          <Board
            board={board.map((value, i) => ({
              value,
              onPress: () => this.onPress(i),
              status,
              thinking,
            }))}
          />
          <Text style={styles.status}>{this.getStatus()}</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button title="RESET" color="red" onPress={this.onReset} />
            </View>
            <View style={styles.button}>
              <Button
                title="BACK"
                onPress={() => {
                  this.onReset();
                  this.setPlayers(0);
                }}
              />
            </View>
          </View>
        </>
      );
    } else {
      MainContent = <SelectMode setPlayers={this.setPlayers} />;
    }

    const Loading = (
      <>
        <div style={{ display: "none" }}>
          {X}
          {O}
        </div>
        <ActivityIndicator size="large" />
      </>
    );

    return (
      <View style={styles.container}>
        <Text style={styles.header}>TIC TAC TOE</Text>
        {preLoaded ? MainContent : Loading }
        <StatusBar style="auto" />
      </View>
    );
  };
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
  status: {
    margin: 16,
    height: 24,
    display: "flex",
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

export default App;
