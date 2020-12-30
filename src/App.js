import React, { Component } from "react";
import Timer from "./Timer";

class App extends Component {
  render() {
    return (
      <div id="App">
        <Timer interval={{ minutes: 0, seconds: 5 }} />
      </div>
    );
  }
}

export default App;
