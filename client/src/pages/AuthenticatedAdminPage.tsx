import { Menu } from "element-react";
import { observer } from "mobx-react";
import * as React from "react";
import { AuthenticatedAdmin } from "../state/authenticated/admin";

@observer
export class AuthenticatedAdminPage extends React.Component<{controller: AuthenticatedAdmin}> {
  public render() {
    return (
      <div>
        <Menu theme="dark" onSelect={this.onMenuSelect}>
          <Menu.Item index="signout">
            Sign out
          </Menu.Item>
        </Menu>
        Hi admin
      </div>
    );
  }

  private onMenuSelect = (index: string) => {
    switch (index) {
      case "signout":
        this.props.controller.signOut();
        break;
    }
  }
}
