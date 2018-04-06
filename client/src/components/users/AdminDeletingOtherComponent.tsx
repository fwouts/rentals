import { Alert, Button, Form, Loading } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AdminDeletingOther } from "../../state/authenticated/states/users/admin-deleting-other";

@observer
export class AdminDeletingOtherComponent extends React.Component<{controller: AdminDeletingOther}> {
  public render() {
    return (
      <div>
        <h1>
          Delete user account
        </h1>
        {this.props.controller.pending && <Loading fullscreen={true} />}
        <Form model={this.props.controller} {...{onSubmit: this.onSubmit} as any}>
          {this.props.controller.error && <Alert title={this.props.controller.error} type="error" />}
          <Form.Item>
            <Button onClick={this.props.controller.cancel}>Cancel</Button>
            <Button type="primary" nativeType="submit">Delete</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onSubmit = (e: Event) => {
    this.props.controller.confirm();
    e.preventDefault();
  }
}
