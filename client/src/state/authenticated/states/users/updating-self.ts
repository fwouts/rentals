import { Message } from "element-react";
import { observable } from "mobx";
import { updateUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class UpdatingSelf {
  public readonly kind = "updating-user-self";

  @observable public email = "";
  @observable public name = "";
  @observable public currentPassword = "";
  @observable public newPassword = "";
  @observable public confirmNewPassword = "";
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
  }

  public update = async () => {
    if (this.newPassword !== this.confirmNewPassword) {
      Message({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }
    try {
      this.pending = true;
      const response = await updateUser(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.authenticated.userId,
        {
          currentPassword: this.currentPassword,
          ...(this.email && {
            email: this.email,
          }),
          ...(this.name && {
            name: this.name,
          }),
          ...(this.newPassword && {
            newPassword: this.newPassword,
          }),
        },
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
