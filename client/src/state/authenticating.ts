import { observable } from "mobx";
import { Role } from "../api";
import { loginUser } from "../client";

export class Authenticating {
  public readonly kind = "authenticating";

  @observable public email = "";
  @observable public password = "";
  @observable public error: string | null = null;
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
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.onSuccess(response);
          break;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      this.error = "An unexpected error has occurred.";
    } finally {
      this.pending = false;
    }
  }
}

export type OnSuccess = (authenticated: Authenticated) => void;

export interface Authenticated {
  jwtToken: string;
  role: Role;
  userId: string;
}
