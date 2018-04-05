import { observer } from "mobx-react";
import * as React from "react";
import { Unauthenticated } from "../state/unauthenticated";
import "./UnauthenticatedPage.css";

@observer
export class UnauthenticatedPage extends React.Component<{controller: Unauthenticated}> {
  public render() {
    return (
      <div className="UnauthenticatedPage">
        Welcome!
      </div>
    );
  }
}
