import { observable } from "mobx";
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
  @observable public pending = false;

  private readonly onSuccess: OnSuccess;

  constructor(onSuccess: OnSuccess) {
    this.onSuccess = onSuccess;
  }

  public submit = async () => {
    try {
      this.pending = true;
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
      switch (response.status) {
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.onSuccess();
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

export type OnSuccess = () => void;
