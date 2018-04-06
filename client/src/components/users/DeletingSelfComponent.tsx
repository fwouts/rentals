import { Button, Card, Form, Input } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { DeletingSelf } from "../../state/authenticated/states/users/deleting-self";

@observer
export class DeletingSelfComponent extends React.Component<{controller: DeletingSelf}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Delete your account
        </h1>}
      >
        <Form model={this.props.controller} {...{onSubmit: this.onSubmit} as any}>
          <Form.Item label="Enter your password" required={true}>
            <Input
              type="password"
              value={this.props.controller.password}
              onChange={(value: any) => this.props.controller.password = value}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={this.props.controller.cancel}>Cancel</Button>
            <Button loading={this.props.controller.pending} type="primary" nativeType="submit">Delete</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.confirm();
    e.preventDefault();
  }
}
