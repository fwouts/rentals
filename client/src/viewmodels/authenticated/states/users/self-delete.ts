import { Message } from "element-react";
import { observable } from "mobx";
import { deleteUser } from "../../../../client";
import { SessionInfo } from "../../../signin";

export class SelfDeleteUserViewModel {
  public readonly kind = "self-delete-user";

  @observable public password = "";
  @observable public pending = false;

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  constructor(authenticated: SessionInfo, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
  }

  public confirm = async () => {
    try {
      this.pending = true;
      const response = await deleteUser(
        {
          Authorization: this.authenticated.authToken,
        },
        this.authenticated.userId,
        {
          password: this.password,
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
