import {observer} from "mobx-react";
import * as React from "react";
import { AuthenticatedAdminPage } from "./pages/AuthenticatedAdminPage";
import { AuthenticatedClientPage } from "./pages/AuthenticatedClientPage";
import { AuthenticatedRealtorPage } from "./pages/AuthenticatedRealtorPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SignInPage } from "./pages/SignInPage";
import { UnauthenticatedPage } from "./pages/UnauthenticatedPage";
import { VerifyPage } from "./pages/VerifyPage";
import { AppController } from "./viewmodels/app";

@observer
class App extends React.Component<{viewModel: AppController}> {
  public render() {
    switch (this.props.viewModel.state.kind) {
      case "unauthenticated":
        return <UnauthenticatedPage viewModel={this.props.viewModel.state} />;
      case "register":
        return <RegisterPage viewModel={this.props.viewModel.state} />;
      case "verify":
        return <VerifyPage viewModel={this.props.viewModel.state} />;
      case "signin":
        return <SignInPage viewModel={this.props.viewModel.state} />;
      case "authenticated-client":
        return <AuthenticatedClientPage viewModel={this.props.viewModel.state} />;
      case "authenticated-realtor":
        return <AuthenticatedRealtorPage viewModel={this.props.viewModel.state} />;
        case "authenticated-admin":
          return <AuthenticatedAdminPage viewModel={this.props.viewModel.state} />;
      default:
        throw new Error(`Unknown state: ${JSON.stringify(this.props.viewModel.state)}.`);
    }
  }
}

export default App;
