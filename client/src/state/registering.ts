import { Role } from "../api";
import { registerUser } from "../client";

export class Registering {
  public readonly kind = "registering";

  public email = "";
  public password = "";
  public confirmPassword = "";
  public name = "";
  public role: Role = "client";
  public error: string | null = null;
  private readonly onSuccess: OnSuccess;

  constructor(onSuccess: OnSuccess) {
    this.onSuccess = onSuccess;
  }

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
    switch (response.status) {
      case "error":
        this.error = response.message;
        break;
      case "success":
        this.onSuccess();
        break;
    }
  }
}

export type OnSuccess = () => void;
