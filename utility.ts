const calculateWinner = (board: (string | null)[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const calculateDraw = (board: (string | null)[]) => {
  return !board.some((square) => !square);
};

const calculateBestMove = (board: (string | null)[]) => {
  let bestValue = -1000;
  let bestMove = -1;
  for (let i = 0; i < board.length; i++) {
    const square = board[i];
    if (!square) {
      board[i] = "O";
      const moveValue = minimax(board, false);
      board[i] = null;

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const minimax = (
  [...board]: (string | null)[],
  isMax: boolean,
) => {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (calculateDraw(board)) return 0;
  let best = isMax ? -1000 : 1000;
  for (let i = 0; i < board.length; i++) {
    const square = board[i];
    if (!square) {
      board[i] = isMax ? 'O' : 'X';
      best = Math[isMax ? 'max' : 'min'](best, minimax(board, !isMax));
      board[i] = null;
    }
  }
  return best;
};

export { calculateWinner, calculateDraw, calculateBestMove };
