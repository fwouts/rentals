import { Alert, Button, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react"; import { Authenticating } from "../state/authenticating";

@observer
export class AuthenticatingPage extends React.Component<{controller: Authenticating}> {
  public render() {
    // HACK: onSubmit is missing from the FormProps type.
    const onSubmit: any = {
      onSubmit: this.onSubmit,
    };
    return (
      <div>
        <h1>
          Sign in
        </h1>
        <Form model={this.props.controller} {...onSubmit}>
          {this.props.controller.error && <Alert title={this.props.controller.error} type="error" />}
          <Form.Item label="Email address" required={true}>
            <Input
              value={this.props.controller.email}
              onChange={(value: any) => this.props.controller.updateEmail(value)}
            />
          </Form.Item>
          <Form.Item label="Password" required={true}>
            <Input
              type="password"
              value={this.props.controller.password}
              onChange={(value: any) => this.props.controller.updatePassword(value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" nativeType="submit">Sign in</Button>
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
