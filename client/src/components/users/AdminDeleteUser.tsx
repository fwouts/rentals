import { Button, Card, Form } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AdminDeleteUserViewModel } from "../../viewmodels/authenticated/states/users/admin-delete";

@observer
export class AdminDeleteUser extends React.Component<{viewModel: AdminDeleteUserViewModel}> {
  public render() {
    return (
      <Card
        className="container-small"
        header={<h1>
          Delete user account
        </h1>}
      >
        <p>
          You are about to delete the account associated with the email address: {this.props.viewModel.user.email}.
        </p>
        <p>
          Are you sure?
        </p>
        <Form model={this.props.viewModel} {...{onSubmit: this.onSubmit} as any}>
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
