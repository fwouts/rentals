import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { ListingApartmentsComponent } from "../components/apartments/ListingApartmentsComponent";
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
    }
    return (
      <div>
        <Menu theme="dark" mode="horizontal" onSelect={this.onMenuSelect}>
          <Menu.Item index="apartments-list">Browse apartments</Menu.Item>
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
    }
  }
}
