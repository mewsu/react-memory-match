import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      chances: 3,
      clickedBlocks: [],
      revealed: null,
      isClickAllowed: true
    };
    this.possibleMatchIds = [
      // 4 x 4, 8 pairs
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8
    ];
    this.gridBlocks = shuffle(this.possibleMatchIds); // idx = position
  }

  handleBlockClick = (blockIdx, matchId) => {
    if (!this.state.isClickAllowed) return;
    console.log("clicked ", matchId);
    let clickedBlocks = [...this.state.clickedBlocks];
    clickedBlocks.push(blockIdx);
    this.setState({ clickedBlocks });
    if (!this.state.revealed) {
      // first select
      this.setState({ revealed: matchId });
    } else {
      // second select
      this.setState({
        chances: this.state.chances - 1,
        revealed: null
      });
      if (this.state.revealed == matchId) {
        console.log("score!");
        this.setState({
          score: this.state.score + 1
        });
      } else {
        this.setState({ isClickAllowed: false });
        console.log("queue reset");
        setTimeout(() => {
          console.log("reset now");
          this.setState({
            isClickAllowed: true,
            clickedBlocks: clickedBlocks.slice(0, clickedBlocks.length - 2)
          });
        }, 1000);
      }
    }
  };

  componentDidMount() {
    console.log("did mount");
    // this.setState(this.initialState);
  }

  render() {
    return (
      <div id="main-container">
        <GameGrid
          gridBlocks={this.gridBlocks}
          handleBlockClick={this.handleBlockClick}
          clickedBlocks={this.state.clickedBlocks}
        />
      </div>
    );
  }
}

const GameGrid = props => {
  // console.log({ props });
  return (
    <div id="game-grid">
      {props.gridBlocks.map((matchId, i) => (
        <GameBlock
          key={i}
          matchId={matchId}
          blockIdx={i}
          handleBlockClick={props.handleBlockClick}
          isClicked={props.clickedBlocks.includes(i)}
        />
      ))}
    </div>
  );
};

const GameBlock = props => {
  // console.log({ props });
  const imgNames = [
    "boo",
    "coin",
    "egg",
    "flower",
    "koopa",
    "mushroom",
    "shell",
    "star"
  ];

  const css = props.isClicked ? imgNames[props.matchId - 1] : "";

  return (
    <button
      className={"game-block " + css}
      onClick={() => {
        if (!props.isClicked)
          props.handleBlockClick(props.blockIdx, props.matchId);
      }}
    ></button>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// https://javascript.info/task/shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
