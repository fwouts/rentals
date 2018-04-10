import { Button, Card, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AdminCreateUserViewModel } from "../../viewmodels/authenticated/states/users/admin-create";

@observer
export class AdminCreateUser extends React.Component<{viewModel: AdminCreateUserViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Create user account
        </h1>}
      >
        <Form model={this.props.viewModel} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Name">
            <Input
              value={this.props.viewModel.name}
              onChange={(value: any) => this.props.viewModel.name = value}
            />
          </Form.Item>
          <Form.Item label="Email address">
            <Input
              value={this.props.viewModel.email}
              onChange={(value: any) => this.props.viewModel.email = value}
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input
              type="password"
              value={this.props.viewModel.password}
              onChange={(value: any) => this.props.viewModel.password = value}
            />
          </Form.Item>
          <Form.Item label="Confirm password">
            <Input
              type="password"
              value={this.props.viewModel.confirmPassword}
              onChange={(value: any) => this.props.viewModel.confirmPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Create</Button>
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
