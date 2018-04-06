import {observer} from "mobx-react";
import * as React from "react";
import { AuthenticatedAdminPage } from "./pages/AuthenticatedAdminPage";
import { AuthenticatingPage } from "./pages/AuthenticatingPage";
import { RegisteringPage } from "./pages/RegisteringPage";
import { UnauthenticatedPage } from "./pages/UnauthenticatedPage";
import { AppController } from "./state/app";

@observer
class App extends React.Component<{controller: AppController}> {
  public render() {
    switch (this.props.controller.state.kind) {
      case "unauthenticated":
        return <UnauthenticatedPage controller={this.props.controller.state} />;
      case "registering":
        return <RegisteringPage controller={this.props.controller.state} />;
      case "authenticating":
        return <AuthenticatingPage controller={this.props.controller.state} />;
      case "authenticated-admin":
        return <AuthenticatedAdminPage controller={this.props.controller.state} />;
      default:
        throw new Error(`Unknown state: ${this.props.controller.state.kind}.`);
    }
  }
}

export default App;
