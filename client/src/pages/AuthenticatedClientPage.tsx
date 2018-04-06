import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { ListingApartmentsComponent } from "../components/apartments/ListingApartmentsComponent";
import { DeletingSelfComponent } from "../components/users/DeletingSelfComponent";
import { UpdatingSelfComponent } from "../components/users/UpdatingSelfComponent";
import { AuthenticatedClient } from "../state/authenticated/client";

@observer
export class AuthenticatedClientPage extends React.Component<{controller: AuthenticatedClient}> {
  public render() {
    let element;
    switch (this.props.controller.state.kind) {
      case "listing-apartments":
        element = (
          <ListingApartmentsComponent
            controller={this.props.controller.state}
          />
        );
        break;
      case "updating-user-self":
        element = (
          <UpdatingSelfComponent
            controller={this.props.controller.state}
          />
        );
        break;
      case "deleting-user-self":
        element = (
          <DeletingSelfComponent
            controller={this.props.controller.state}
          />
        );
        break;
    }
    return (
      <div>
        <Menu theme="dark" mode="horizontal" onSelect={this.onMenuSelect}>
          <Menu.Item index="apartments-list">Browse apartments</Menu.Item>
          <Menu.SubMenu index="account" title="Account">
            <Menu.Item index="account-update">Update my account</Menu.Item>
            <Menu.Item index="account-delete">Delete my account</Menu.Item>
            <Menu.Item index="account-signout">Sign out</Menu.Item>
          </Menu.SubMenu>
        </Menu>
        {element}
      </div>
    );
  }

  private onMenuSelect = (index: string) => {
    switch (index) {
      case "account-signout":
        this.props.controller.signOut();
        break;
      case "account-update":
        this.props.controller.updateUser();
        break;
      case "account-delete":
        this.props.controller.deleteUser();
        break;
      case "apartments-list":
        this.props.controller.listApartments();
        break;
    }
  }
}
