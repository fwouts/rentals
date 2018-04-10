import { Button, Card, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { SelfDeleteUserViewModel } from "../../viewmodels/authenticated/states/users/self-delete";

@observer
export class SelfDeleteUser extends React.Component<{viewModel: SelfDeleteUserViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Delete your account
        </h1>}
      >
        <Form model={this.props.viewModel} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Enter your password" required={true}>
            <Input
              type="password"
              value={this.props.viewModel.password}
              onChange={(value: any) => this.props.viewModel.password = value}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.props.viewModel.cancel}>Cancel</Button>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Delete</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.viewModel.confirm();
    e.preventDefault();
  }
}
