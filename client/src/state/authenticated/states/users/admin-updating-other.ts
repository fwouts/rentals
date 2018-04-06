import { Message } from "element-react";
import { observable } from "mobx";
import { UserDetails } from "../../../../api";
import { updateUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class AdminUpdatingOther {
  public readonly kind = "admin-updating-other";

  @observable public userId: string;
  @observable public email: string;
  @observable public name: string;
  @observable public newPassword = "";
  @observable public confirmNewPassword = "";
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: Authenticated,
    callbacks: Callbacks,
    user: UserDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.userId = user.userId;
    this.email = user.email;
    this.name = user.name;
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
        this.userId,
        {
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
