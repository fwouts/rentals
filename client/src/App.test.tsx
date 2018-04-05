import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { AppController } from "./state/app";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const appController = new AppController();
  ReactDOM.render(<App controller={appController} />, div);
});
