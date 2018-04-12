import { observer } from "mobx-react";
import * as React from "react";
import { humanizeRole } from "../i18n/role";
import { SessionInfo } from "../viewmodels/signin";
import "./UserInfo.scss";

export const UserInfo = observer((props: {sessionInfo: SessionInfo}) => {
  return (
    <li className="UserInfo">
      {`Signed in as ${props.sessionInfo.name}`}
      <span className="role">
        ({humanizeRole(props.sessionInfo.role)})
      </span>
    </li>
  );
});
