import { Message } from "element-react";
import { observable } from "mobx";
import { UserDetails } from "../../../../api";
import { deleteUser } from "../../../../client";
import { SessionInfo } from "../../../signin";

export class AdminDeleteUserViewModel {
  public readonly kind = "admin-delete-user";

  @observable public user: UserDetails;
  @observable public pending = false;

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: SessionInfo,
    callbacks: Callbacks,
    user: UserDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.user = user;
  }

  public confirm = async () => {
    try {
      this.pending = true;
      const response = await deleteUser(
        {
          Authorization: this.authenticated.authToken,
        },
        this.user.userId,
        {},
      );
      switch (response.status) {
        case "success":
          Message({
            type: "success",
            message: response.message,
          });
          this.callbacks.onDone();
          break;
        case "error":
        default:
          Message({
            type: "error",
            message: response.message,
          });
          break;
      }
    } finally {
      this.pending = false;
    }
  }

  public cancel = () => {
    this.callbacks.onCancel();
  }
}

export interface Callbacks {
  onDone();
  onCancel();
}
