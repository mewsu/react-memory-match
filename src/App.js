import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <StatelessComponent title={"React App!"} />
        <div></div>
      </div>
    );
  }
}

const StatelessComponent = (props) => {
  return <header>{props.title}</header>;
};

ReactDOM.render(<App />, document.getElementById("root"));
