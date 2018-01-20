import React from 'react';
import logo from './logo.svg';
import './App.css';

/*
When someone wins, highlight the three squares that caused the win.*/

// let f = (n) => { return 1+n; };

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i, row, col) {


    return (
      <Square
        key={"sq"+i}
        value={this.props.squares[i]}
        row={row}
        col={col}
        onClick={() => this.props.onClick(i,row,col)}
      />
    );
  }

  render() {
    let squares = [];
    let row = [];

    for(let i = 0; i < 3; i++){
      row = [];
      for(let j = 0; j < 3; j++){
        row.push(this.renderSquare(i*3+j,i+1,j+1));
      }
      squares.push(<div key={'squ' + i} className="board-row">{row}</div>);
    }


    return (
      <div>
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickPos: null,
      }],
      isAscendingOrder: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i,row,col) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    this.resetHighlightedJumpToButtons(-1);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickPos: [row, col],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  resetHighlightedJumpToButtons(buttonNumber){
    for (let i = 0; i < this.state.history.length; i++) {
      if (i !== buttonNumber) {
        document.getElementById(i).setAttribute("class","defaultStyle");
      }
    }
  }

  jumpTo(move){
    this.resetHighlightedJumpToButtons(move);
    document.getElementById(move).setAttribute("class","style1");

    this.setState({
      stepNumber: move,
      xIsNext: this.stepNumber % 2 === true,
    });

  }
  toggleAscending(){

    this.setState({
      isAscendingOrder: !this.state.isAscendingOrder,
    })
  }

  determine(moveNo){
    return this.state.isAscendingOrder ? moveNo : moveNo + 1;
  }
  render() {


    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);


    // possible bug
    const moves = history.map((step, move) => {

      let indexFromEnd = history.length-1-move;
      let row;
      let col;
      let moveNo;

      moveNo = this.state.isAscendingOrder ? move : indexFromEnd;

      const desc = (moveNo) ?
        'Go to move #' + moveNo + ' (' + history[moveNo].clickPos + ')'  :
        'Go to game start';
      return (
        <li key={moveNo}>
          <button id={moveNo} onClick={() => this.jumpTo(moveNo, history.length)}>{desc}</button>
        </li>
      );
    });
    let status;

    if(winner){
      status = 'winner: ' + winner;
    } else {
      status = 'next: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i,row,col) => this.handleClick(i, row, col)}
            />
          <button onClick={() => this.toggleAscending() }>toggle ascending/descending</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

/*
1
down vote
accepted
Change <span id="textSpan"> to the following:

<span id="textSpan" style={
this.state.checkboxState ? {fontWeight: 'normal'}
: {fontWeight: 'bold'} }>{this.props.text}</span>*/


// HELPER FUNCTIONS



function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] &&
       squares[a] === squares[b] &&
       squares[a] === squares[c]){
      return squares[a];
    }
  }

  return null;
}

export default Game;
