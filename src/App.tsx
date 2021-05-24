import React, { useState } from 'react';

import './App.scss';

type SquaresType = (string | null)[];

interface History {
  squares: SquaresType;
  location: { col: number | null; row: number | null };
}

const calculateWinner = (squares: SquaresType) => {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        causedWinCells: lines[i],
      };
    }
  }
  return {
    winner: null,
    causedWinCells: [],
  };
};

interface SquareProps {
  value: string | null;
  onClick: () => void;
  id: number;
  causedWin: boolean;
}

const Square: React.VFC<SquareProps> = (props) => {
  return (
    <button
      data-e2e={`button-${props.id}`}
      className={props.causedWin ? 'square caused-win' : 'square'}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

interface BoardProps {
  squares: SquaresType;
  onClick: (i: number) => void;
  causedWinCells: number[];
}

const Board: React.VFC<BoardProps> = (props) => {
  const renderSquare = (i: number, causedWin: boolean) => {
    return (
      <Square
        key={i}
        id={i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        causedWin={causedWin}
      />
    );
  };

  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  return (
    <div>
      {rows.map((row) => {
        return (
          <div className="board-row" key={row}>
            {cols.map((col) => {
              const cell = row * 3 + col;
              const causedWin = props.causedWinCells.includes(cell);
              return renderSquare(cell, causedWin);
            })}
          </div>
        );
      })}
    </div>
  );
};

export const App: React.VFC = () => {
  const [history, setHistory] = useState<History[]>([
    { squares: Array(9).fill(null), location: { col: null, row: null } },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAscendingOrder, setIsAscendingOrder] = useState(true);

  const handleClick = (i: number) => {
    const historyCurrent = history.slice(0, stepNumber + 1);
    const current = historyCurrent[historyCurrent.length - 1];
    const squares = current.squares.slice();
    const winInfo = calculateWinner(squares);
    if (winInfo.winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';

    setHistory([
      ...historyCurrent,
      { squares, location: { col: (i % 3) + 1, row: Math.trunc(1 / 3) + 1 } },
    ]);
    setStepNumber(historyCurrent.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const reverseHistoryOrder = () => {
    setIsAscendingOrder(!isAscendingOrder);
  };

  const historyCurrent = isAscendingOrder
    ? history.slice()
    : history.slice().reverse();
  const stepNumberCurrent = isAscendingOrder
    ? stepNumber
    : historyCurrent.length - 1 - stepNumber;
  const current = historyCurrent[stepNumberCurrent];
  const winInfo = calculateWinner(current.squares);

  const moves = historyCurrent.map((step, move) => {
    const player = move % 2 === 0 ? 'O' : 'X';
    const moveIndex = isAscendingOrder
      ? move
      : historyCurrent.length - 1 - move;
    const desc = moveIndex
      ? `Go to move #${moveIndex}: ${player} (${step.location.col},${step.location.row})`
      : 'Go to game start';
    return (
      <li key={move}>
        <button
          className={move === stepNumberCurrent ? 'text-bold' : ''}
          onClick={() => jumpTo(moveIndex)}
        >
          {desc}
        </button>
      </li>
    );
  });

  const status = winInfo.winner
    ? `Winner: ${winInfo.winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          causedWinCells={winInfo.causedWinCells}
        />
      </div>
      <div className="game-info">
        <div data-e2e="status">{status}</div>
        <ol>{moves}</ol>
        <button onClick={reverseHistoryOrder}>Reverse history order</button>
      </div>
    </div>
  );
};
