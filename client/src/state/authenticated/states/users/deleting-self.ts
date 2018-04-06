import { Message } from "element-react";
import { observable } from "mobx";
import { deleteUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class DeletingSelf {
  public readonly kind = "deleting-user-self";

  @observable public password = "";
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
  }

  public confirm = async () => {
    try {
      this.pending = true;
      const response = await deleteUser(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.authenticated.userId,
        {
          password: this.password,
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
