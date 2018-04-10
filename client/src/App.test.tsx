import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { AppController } from "./viewmodels/app";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const appController = new AppController();
  ReactDOM.render(<App viewModel={appController} />, div);
});
