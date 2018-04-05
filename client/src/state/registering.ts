import { action, observable, runInAction } from "mobx";
import { Role } from "../api";
import { registerUser } from "../client";

export class Registering {
  public readonly kind = "registering";

  @observable public email = "";
  @observable public password = "";
  @observable public confirmPassword = "";
  @observable public name = "";
  @observable public role: Role = "client";
  @observable public error: string | null = null;

  private readonly onSuccess: OnSuccess;

  constructor(onSuccess: OnSuccess) {
    this.onSuccess = onSuccess;
  }

  @action
  public async submit() {
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match.";
      return;
    }
    // TODO: Check for empty fields, trim inputs (across all forms).
    const response = await registerUser(
      {},
      {
        email: this.email,
        password: this.password,
        name: this.name,
        role: this.role,
      },
    );
    runInAction(() => {
      switch (response.status) {
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.onSuccess();
          break;
      }
    });
  }
}

export type OnSuccess = () => void;
