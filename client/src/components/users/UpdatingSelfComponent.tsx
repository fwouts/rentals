import { Button, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { UpdatingSelf } from "../../state/authenticated/states/users/updating-self";

@observer
export class UpdatingSelfComponent extends React.Component<{controller: UpdatingSelf}> {
  public render() {
    return (
      <div>
        <h1>
          Update your account
        </h1>
        <Form model={this.props.controller} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Name">
            <Input
              value={this.props.controller.name}
              onChange={(value: any) => this.props.controller.name = value}
            />
          </Form.Item>
          <Form.Item label="Email address">
            <Input
              value={this.props.controller.email}
              onChange={(value: any) => this.props.controller.email = value}
            />
          </Form.Item>
          <Form.Item label="Current password" required={true}>
            <Input
              type="password"
              value={this.props.controller.currentPassword}
              onChange={(value: any) => this.props.controller.currentPassword = value}
            />
          </Form.Item>
          <Form.Item label="New password">
            <Input
              type="password"
              value={this.props.controller.newPassword}
              onChange={(value: any) => this.props.controller.newPassword = value}
            />
          </Form.Item>
          <Form.Item label="Confirm new password">
            <Input
              type="password"
              value={this.props.controller.confirmNewPassword}
              onChange={(value: any) => this.props.controller.confirmNewPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.props.controller.cancel}>Cancel</Button>
            <Button loading={this.props.controller.pending} type="primary" nativeType="submit">Update</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.update();
    e.preventDefault();
  }
}
