import { Button, Card } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { Unauthenticated } from "../state/unauthenticated";

@observer
export class UnauthenticatedPage extends React.Component<{controller: Unauthenticated}> {
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
          <Button size="large" type="primary" onClick={this.props.controller.register}>Register</Button>
          <Button size="large" onClick={this.props.controller.authenticate}>Sign in</Button>
        </div>
      </Card>
    );
  }
}
