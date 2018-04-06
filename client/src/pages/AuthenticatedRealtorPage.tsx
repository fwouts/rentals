import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { CreatingApartmentComponent } from "../components/apartments/CreatingApartmentComponent";
import { ListingApartmentsComponent } from "../components/apartments/ListingApartmentsComponent";
import { UpdatingApartmentComponent } from "../components/apartments/UpdatingApartmentComponent";
import { AuthenticatedRealtor } from "../state/authenticated/realtor";

@observer
export class AuthenticatedRealtorPage extends React.Component<{controller: AuthenticatedRealtor}> {
  public render() {
    let element;
    switch (this.props.controller.state.kind) {
      case "listing-apartments":
        element = (
          <ListingApartmentsComponent
            controller={this.props.controller.state}
            enableRentedFilter={true}
            enableModification={{
              filter: {
                realtorId: this.props.controller.realtorId,
              },
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
    }
    return (
      <div>
        <Menu theme="dark" mode="horizontal" onSelect={this.onMenuSelect}>
          <Menu.SubMenu index="apartments" title="Apartments">
            <Menu.Item index="apartments-list">Browse apartments</Menu.Item>
            <Menu.Item index="apartments-create">Create an apartment listing</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item index="signout">
            Sign out
          </Menu.Item>
        </Menu>
        {element}
      </div>
    );
  }

  private onMenuSelect = (index: string) => {
    switch (index) {
      case "signout":
        this.props.controller.signOut();
        break;
      case "apartments-list":
        this.props.controller.listApartments();
        break;
      case "apartments-create":
        this.props.controller.createApartment();
        break;
    }
  }
}
