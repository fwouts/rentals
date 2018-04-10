import "element-theme-default";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";
import { AppController } from "./viewmodels/app";

const appController = new AppController();

ReactDOM.render(<App viewModel={appController} />, document.getElementById("root") as HTMLElement);
