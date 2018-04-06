import { Alert, Button, Checkbox, Form, Input, Loading } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { Registering } from "../state/registering";

@observer
export class RegisteringPage extends React.Component<{controller: Registering}> {
  public render() {
    return (
      <div>
        <h1>
          Create an account
        </h1>
        {this.props.controller.pending && <Loading fullscreen={true} />}
        <Form model={this.props.controller} {...{onSubmit: this.onSubmit} as any}>
          {this.props.controller.error && <Alert title={this.props.controller.error} type="error" />}
          <Form.Item label="Name" required={true}>
            <Input
              value={this.props.controller.name}
              onChange={(value: any) => this.props.controller.name = value}
            />
          </Form.Item>
          <Form.Item label="Email address" required={true}>
            <Input
              value={this.props.controller.email}
              onChange={(value: any) => this.props.controller.email = value}
            />
          </Form.Item>
          <Form.Item label="Password" required={true}>
            <Input
              type="password"
              value={this.props.controller.password}
              onChange={(value: any) => this.props.controller.password = value}
            />
          </Form.Item>
          <Form.Item label="Confirm your password" required={true}>
            <Input
              type="password"
              value={this.props.controller.confirmPassword}
              onChange={(value: any) => this.props.controller.confirmPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              label="I'm a realtor. Let me list apartments."
              checked={this.props.controller.role === "realtor"}
              onChange={(checked: boolean) => this.props.controller.role = checked ? "realtor" : "client"}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit">Register</Button>
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
