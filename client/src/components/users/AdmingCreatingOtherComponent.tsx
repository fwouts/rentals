import { Alert, Button, Form, Input, Loading } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AdminCreatingOther } from "../../state/authenticated/states/users/admin-creating-other";

@observer
export class AdminCreatingOtherComponent extends React.Component<{controller: AdminCreatingOther}> {
  public render() {
    return (
      <div>
        <h1>
          Create user account
        </h1>
        {this.props.controller.pending && <Loading fullscreen={true} />}
        <Form model={this.props.controller} {...{onSubmit: this.onSubmit} as any}>
          {this.props.controller.error && <Alert title={this.props.controller.error} type="error" />}
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
          <Form.Item label="Password">
            <Input
              type="password"
              value={this.props.controller.password}
              onChange={(value: any) => this.props.controller.password = value}
            />
          </Form.Item>
          <Form.Item label="Confirm password">
            <Input
              type="password"
              value={this.props.controller.confirmPassword}
              onChange={(value: any) => this.props.controller.confirmPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit">Create</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.submit();
    e.preventDefault();
  }
}
