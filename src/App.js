import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.initiaState = {
      score: 0,
      chances: 10,
      clickedBlocks: [],
      revealed: null,
      isClickAllowed: true,
      isGameOver: false,
      isVictory: false
    };
    this.state = Object.assign({}, this.initiaState);

    this.gridBlocks = shuffle([
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
    ]); // idx = position
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
        revealed: null
      });
      if (this.state.revealed == matchId) {
        console.log("score!");
        const score = this.state.score + 1;
        this.setState({
          score,
          isGameOver: score >= 8,
          isVictory: score >= 8
        });
      } else {
        const chances = this.state.chances - 1;
        this.setState({
          isClickAllowed: false,
          chances,
          isVictory: false,
          isGameOver: chances <= 0
        });
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

  handleReset = () => {
    this.setState(this.initiaState);
  };

  componentDidMount() {
    console.log("did mount");
    // this.setState(this.initialState);
  }

  render() {
    return (
      <div id="main-container">
        <GameMessage
          isGameOver={this.state.isGameOver}
          isVictory={this.state.isVictory}
          score={this.state.score}
          chances={this.state.chances}
          handleReset={this.handleReset}
        />
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

  const css = imgNames[props.matchId - 1];

  return (
    <button
      className={"card" + (props.isClicked ? " card--flipped" : "")}
      onClick={() => {
        if (!props.isClicked)
          props.handleBlockClick(props.blockIdx, props.matchId);
      }}
    >
      <div className="card__inner">
        <div className="card__front"></div>

        <div className={"card__back " + css}></div>
      </div>
    </button>
  );
};

const GameMessage = props => {
  return (
    <div id="game-message">
      {props.isGameOver ? (
        props.isVictory ? (
          <>
            <div className="green">Full Match!</div>
            <button className="play-again" onClick={() => props.handleReset()}>
              Play Again?
            </button>
          </>
        ) : (
          <>
            <div className="red">Game Over!</div>
            <button className="play-again" onClick={() => props.handleReset()}>
              Try Again?
            </button>
          </>
        )
      ) : (
        <>
          <div>Matches: {props.score}/8</div>
          <div>Chances: {props.chances}</div>{" "}
        </>
      )}
    </div>
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
