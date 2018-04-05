import {observer} from "mobx-react";
import * as React from "react";
import "./App.css";
import { UnauthenticatedPage } from "./pages/UnauthenticatedPage";
import { AppController } from "./state/app";

@observer
class App extends React.Component<{controller: AppController}> {
  public render() {
    let element;
    switch (this.props.controller.state.kind) {
      case "unauthenticated":
        element = <UnauthenticatedPage controller={this.props.controller.state} />;
        break;
      default:
        throw new Error(`Unknown state: ${this.props.controller.state.kind}.`);
    }
    return (
      <div className="App">
        {element}
      </div>
    );
  }
}

export default App;
