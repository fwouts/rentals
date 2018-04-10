import { Button, Card, Checkbox, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { RegisterViewModel } from "../viewmodels/register";

@observer
export class RegisterPage extends React.Component<{viewModel: RegisterViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={
          <h2>
            Create an account
          </h2>
        }
      >
        <Form model={this.props.viewModel} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Name" required={true}>
            <Input
              value={this.props.viewModel.name}
              onChange={(value: any) => this.props.viewModel.name = value}
            />
          </Form.Item>
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
          <Form.Item label="Confirm your password" required={true}>
            <Input
              type="password"
              value={this.props.viewModel.confirmPassword}
              onChange={(value: any) => this.props.viewModel.confirmPassword = value}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              label="I'm a realtor. Let me list apartments."
              checked={this.props.viewModel.role === "realtor"}
              onChange={(checked: boolean) => this.props.viewModel.role = checked ? "realtor" : "client"}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={this.props.viewModel.pending} type="primary" nativeType="submit">Register</Button>
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
