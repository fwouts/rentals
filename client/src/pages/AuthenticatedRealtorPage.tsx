import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { CreateApartment } from "../components/apartments/CreatingApartment";
import { ListApartments } from "../components/apartments/ListApartments";
import { UpdateApartment } from "../components/apartments/UpdateApartment";
import { SelfDeleteUser } from "../components/users/SelfDeleteUser";
import { SelfUpdateUser } from "../components/users/SelfUpdateUser";
import { AuthenticatedRealtorViewModel } from "../viewmodels/authenticated/realtor";

@observer
export class AuthenticatedRealtorPage extends React.Component<{viewModel: AuthenticatedRealtorViewModel}> {
  public render() {
    let element;
    switch (this.props.viewModel.state.kind) {
      case "list-apartments":
        element = (
          <ListApartments
            viewModel={this.props.viewModel.state}
            enableRentedFilter={true}
            enableModification={{
              filter: {
                realtorId: this.props.viewModel.realtorId,
              },
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
    }
  }
}
