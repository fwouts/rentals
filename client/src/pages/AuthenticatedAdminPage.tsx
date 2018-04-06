import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { CreatingApartmentComponent } from "../components/apartments/CreatingApartmentComponent";
import { ListingApartmentsComponent } from "../components/apartments/ListingApartmentsComponent";
import { UpdatingApartmentComponent } from "../components/apartments/UpdatingApartmentComponent";
import { DeletingSelfComponent } from "../components/users/DeletingSelfComponent";
import { UpdatingSelfComponent } from "../components/users/UpdatingSelfComponent";
import { AuthenticatedAdmin } from "../state/authenticated/admin";

@observer
export class AuthenticatedAdminPage extends React.Component<{controller: AuthenticatedAdmin}> {
  public render() {
    let element;
    switch (this.props.controller.state.kind) {
      case "listing-apartments":
        element = (
          <ListingApartmentsComponent
            controller={this.props.controller.state}
            enableRentedFilter={true}
            realtorFilter={this.props.controller.state.realtorFilter!}
            enableModification={{
              filter: "all",
              editApartment: this.props.controller.editApartment,
              deleteApartment: this.props.controller.state.deleteApartment,
            }}
          />
        );
        break;
      case "creating-apartment":
        element = (
          <CreatingApartmentComponent
            controller={this.props.controller.state}
          />
        );
        break;
      case "updating-apartment":
        element = (
          <UpdatingApartmentComponent
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
      default:
        throw new Error(`Unsupported state: ${this.props.controller.state.kind}.`);
    }
    return (
      <div>
        <Menu theme="dark" mode="horizontal" onSelect={this.onMenuSelect}>
          <Menu.SubMenu index="apartments" title="Apartments">
            <Menu.Item index="apartments-list">Browse apartments</Menu.Item>
            <Menu.Item index="apartments-create">Create an apartment listing</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu index="users" title="Users">
            <Menu.Item index="users-list">Browse users</Menu.Item>
            <Menu.Item index="users-create">Create a user</Menu.Item>
          </Menu.SubMenu>
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
      case "apartments-create":
        this.props.controller.createApartment();
        break;
      case "users-list":
        this.props.controller.listUsers();
        break;
      case "users-create":
        this.props.controller.createUser();
        break;
    }
  }
}
