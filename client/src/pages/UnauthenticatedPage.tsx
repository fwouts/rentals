import { Button, Card } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import {  UnauthenticatedViewModel } from "../viewmodels/unauthenticated";

@observer
export class UnauthenticatedPage extends React.Component<{viewModel: UnauthenticatedViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={
          <h2>
            Welcome to Rentals!
          </h2>
        }
      >
        <div>
          <Button size="large" type="primary" onClick={this.props.viewModel.register}>Register</Button>
          <Button size="large" onClick={this.props.viewModel.authenticate}>Sign in</Button>
        </div>
      </Card>
    );
  }
}
