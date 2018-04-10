import { Message } from "element-react";
import { observable } from "mobx";
import { Role } from "../api";
import { loginUser } from "../client";

export class SignInViewModel {
  public readonly kind = "signin";

  @observable public email = "";
  @observable public password = "";
  @observable public pending = false;

  private readonly onSuccess: OnSuccess;

  constructor(onSuccess: OnSuccess) {
    this.onSuccess = onSuccess;
  }

  public submit = async () => {
    try {
      this.pending = true;
      const response = await loginUser({
        email: this.email,
        password: this.password,
      });
      switch (response.status) {
        case "success":
          Message({
            type: "success",
            message: "Hi there!",
          });
          this.onSuccess(response);
          break;
        case "error":
        default:
          Message({
            type: "error",
            message: response.message,
          });
          break;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      Message({
        type: "error",
        message: "An unexpected error has occurred.",
      });
    } finally {
      this.pending = false;
    }
  }
}

export type OnSuccess = (authenticated: SessionInfo) => void;

export interface SessionInfo {
  authToken: string;
  role: Role;
  userId: string;
}
