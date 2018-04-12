import { Message } from "element-react";
import { observable } from "mobx";
import { updateUser } from "../../../../client";
import { SessionInfo } from "../../../signin";

export class SelfUpdateUserViewModel {
  public readonly kind = "self-update-user";

  @observable public email = "";
  @observable public name = "";
  @observable public currentPassword = "";
  @observable public newPassword = "";
  @observable public confirmNewPassword = "";
  @observable public pending = false;

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  constructor(authenticated: SessionInfo, callbacks: Callbacks) {
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
          Authorization: this.authenticated.authToken,
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
      switch (response.kind) {
        case "success":
          Message({
            type: "success",
            message: response.data,
          });
          this.callbacks.onDone();
          break;
        case "notfound":
          Message({
            type: "error",
            message: "This account does not exist anymore.",
          });
          break;
        case "failure":
        case "unauthorized":
        default:
          Message({
            type: "error",
            message: response.data,
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
