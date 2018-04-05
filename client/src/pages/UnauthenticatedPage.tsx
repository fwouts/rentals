import { Button } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { Unauthenticated } from "../state/unauthenticated";

@observer
export class UnauthenticatedPage extends React.Component<{controller: Unauthenticated}> {
  public render() {
    return (
      <div className="UnauthenticatedPage">
        <h1>
          Welcome to Rentals!
        </h1>
        <p>
          Do you already have an account?
        </p>
        <div>
          <Button type="primary" onClick={this.props.controller.register}>Register</Button>
          <Button onClick={this.props.controller.authenticate}>Sign in</Button>
        </div>
      </div>
    );
  }
}
