import { Alert, Card, Loading } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { VerifyViewModel} from "../viewmodels/verify";

@observer
export class VerifyPage extends React.Component<{viewModel: VerifyViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={
          <h2>
            Verifying your email address
          </h2>
        }
      >
        <Loading
          text="Please wait while we're verifying your email address..."
          loading={this.props.viewModel.pending}
        />
        {this.props.viewModel.error && (
          <Alert
            title={this.props.viewModel.error}
            type="error"
            closable={false}
          />
        )}
      </Card>
    );
  }
}
