import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { ListApartments} from "../components/apartments/ListApartments";
import { SelfDeleteUser } from "../components/users/SelfDeleteUser";
import { SelfUpdateUser } from "../components/users/SelfUpdateUser";
import { AuthenticatedClientViewModel } from "../viewmodels/authenticated/client";

@observer
export class AuthenticatedClientPage extends React.Component<{viewModel: AuthenticatedClientViewModel}> {
  public render() {
    let element;
    switch (this.props.viewModel.state.kind) {
      case "list-apartments":
        element = (
          <ListApartments
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "self-update-user":
        element = (
          <SelfUpdateUser
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "self-delete-user":
        element = (
          <SelfDeleteUser
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      default:
        throw new Error(`Unsupported state: ${JSON.stringify(this.props.viewModel.state)}.`);
    }
    return (
      <div className="container-large">
        <Menu theme="dark" mode="horizontal" onSelect={this.onMenuSelect}>
          <Menu.Item index="apartments-list">Browse apartments</Menu.Item>
          <Menu.SubMenu index="account" title="Account">
            <Menu.Item index="account-update">Update my account</Menu.Item>
            <Menu.Item index="account-delete">Delete my account</Menu.Item>
            <Menu.Item index="account-signout">Sign out</Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <main>
          {element}
        </main>
      </div>
    );
  }

  private onMenuSelect = (index: string) => {
    switch (index) {
      case "account-signout":
        this.props.viewModel.signOut();
        break;
      case "account-update":
        this.props.viewModel.updateUser();
        break;
      case "account-delete":
        this.props.viewModel.deleteUser();
        break;
      case "apartments-list":
        this.props.viewModel.listApartments();
        break;
    }
  }
}
