import { Button, Card, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AdminUpdateUserViewModel } from "../../viewmodels/authenticated/states/users/admin-update";

@observer
export class AdminUpdateUser extends React.Component<{viewModel: AdminUpdateUserViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Update user account
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
          <Form.Item label="New password">
            <Input
              type="password"
              value={this.props.viewModel.newPassword}
              onChange={(value: any) => this.props.viewModel.newPassword = value}
            />
          </Form.Item>
          <Form.Item label="Confirm new password">
            <Input
              type="password"
              value={this.props.viewModel.confirmNewPassword}
              onChange={(value: any) => this.props.viewModel.confirmNewPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.props.viewModel.cancel}>Cancel</Button>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.viewModel.update();
    e.preventDefault();
  }
}
