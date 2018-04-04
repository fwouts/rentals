import * as React from "react";
import "./App.css";
import { registerUser } from "./client";

const logo = require("./logo.svg");

class App extends React.Component {
  public render() {
    registerUser(
      {},
      {
        email: "f@zenc.io",
        password: "test!$Yes1",
        name: "Francois",
        role: "admin",
      },
    )
      .then(console.log)
      .catch(console.error);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
