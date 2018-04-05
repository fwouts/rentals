import { observable, runInAction } from "mobx";
import { Role } from "../api";
import { loginUser } from "../client";

export class Authenticating {
  public readonly kind = "authenticating";

  @observable public email = "";
  @observable public password = "";
  @observable public error: string | null = null;

  private readonly onSuccess: OnSuccess;

  constructor(onSuccess: OnSuccess) {
    this.onSuccess = onSuccess;
  }

  public submit = async () => {
    const response = await loginUser({
      email: this.email,
      password: this.password,
    });
    runInAction(() => {
      switch (response.status) {
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.onSuccess(response);
          break;
      }
    });
  }
}

export type OnSuccess = (authenticated: Authenticated) => void;

export interface Authenticated {
  jwtToken: string;
  role: Role;
  userId: string;
}
