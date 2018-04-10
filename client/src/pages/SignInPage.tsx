import { Button, Card, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { SignInViewModel} from "../viewmodels/signin";

@observer
export class SignInPage extends React.Component<{viewModel: SignInViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={
          <h2>
            Sign in
          </h2>
        }
      >
        <Form model={this.props.viewModel} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Email address" required={true}>
            <Input
              value={this.props.viewModel.email}
              onChange={(value: any) => this.props.viewModel.email = value}
            />
          </Form.Item>
          <Form.Item label="Password" required={true}>
            <Input
              type="password"
              value={this.props.viewModel.password}
              onChange={(value: any) => this.props.viewModel.password = value}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Sign in</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.viewModel.submit();
    e.preventDefault();
  }
}
