import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { CreateApartment } from "../components/apartments/CreatingApartment";
import { ListApartments} from "../components/apartments/ListApartments";
import { UpdateApartment} from "../components/apartments/UpdateApartment";
import { AdminCreateUser } from "../components/users/AdminCreateUser";
import { AdminDeleteUser } from "../components/users/AdminDeleteUser";
import { AdminListUsers} from "../components/users/AdminListUsers";
import { AdminUpdateUser } from "../components/users/AdminUpdateUser";
import { SelfDeleteUser } from "../components/users/SelfDeleteUser";
import { SelfUpdateUser } from "../components/users/SelfUpdateUser";
import { AuthenticatedAdminViewModel } from "../viewmodels/authenticated/admin";

@observer
export class AuthenticatedAdminPage extends React.Component<{viewModel: AuthenticatedAdminViewModel}> {
  public render() {
    let element;
    switch (this.props.viewModel.state.kind) {
      case "list-apartments":
        element = (
          <ListApartments
            viewModel={this.props.viewModel.state}
            enableRentedFilter={true}
            realtorFilter={this.props.viewModel.state.realtorFilter!}
            enableModification={{
              filter: "all",
              updateApartment: this.props.viewModel.updateApartment,
              deleteApartment: this.props.viewModel.state.deleteApartment,
            }}
          />
        );
        break;
      case "create-apartment":
        element = (
          <CreateApartment
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "update-apartment":
        element = (
          <UpdateApartment
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
      case "admin-list-users":
        element = (
          <AdminListUsers
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "admin-create-user":
        element = (
          <AdminCreateUser
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "admin-update-user":
        element = (
          <AdminUpdateUser
            viewModel={this.props.viewModel.state}
          />
        );
        break;
      case "admin-delete-user":
        element = (
          <AdminDeleteUser
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
      case "apartments-create":
        this.props.viewModel.createApartment();
        break;
      case "users-list":
        this.props.viewModel.listUsers();
        break;
      case "users-create":
        this.props.viewModel.createUser();
        break;
    }
  }
}
