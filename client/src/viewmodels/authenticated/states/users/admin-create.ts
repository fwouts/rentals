import { Message } from "element-react";
import { observable } from "mobx";
import { Role } from "../../../../api/types";
import { registerUser } from "../../../../client";
import { SessionInfo } from "../../../signin";

export class AdminCreateUserViewModel {
  public readonly kind = "admin-create-user";

  @observable public email = "";
  @observable public password = "";
  @observable public confirmPassword = "";
  @observable public name = "";
  @observable public role: Role = "client";
  @observable public pending = false;

  private readonly authenticated: SessionInfo;
  private readonly onSuccess: OnSuccess;

  constructor(authenticated: SessionInfo, onSuccess: OnSuccess) {
    this.authenticated = authenticated;
    this.onSuccess = onSuccess;
  }

  public submit = async () => {
    try {
      this.pending = true;
      if (this.password !== this.confirmPassword) {
        Message({
          type: "error",
          message: "Passwords do not match.",
        });
        return;
      }
      // TODO: Check for empty fields, trim inputs (across all forms).
      const response = await registerUser(
        {
          Authorization: this.authenticated.authToken,
        },
        {
          email: this.email,
          password: this.password,
          name: this.name,
          role: this.role,
        },
      );
      switch (response.kind) {
        case "success":
          Message({
            type: "success",
            message: response.data,
          });
          this.onSuccess();
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

export type OnSuccess = () => void;
