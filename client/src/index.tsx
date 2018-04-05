import { configure } from "mobx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { AppController } from "./state/app";

configure({
  enforceActions: true,
});
const appController = new AppController();

ReactDOM.render(<App controller={appController} />, document.getElementById("root") as HTMLElement);
