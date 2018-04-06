import { observable } from "mobx";
import { updateUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class AdminUpdatingOther {
  public readonly kind = "admin-updating-other";

  @observable public userId: string;
  @observable public email = "";
  @observable public name = "";
  @observable public newPassword = "";
  @observable public confirmNewPassword = "";
  @observable public error: string | null = null;
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: Authenticated,
    callbacks: Callbacks,
    userId: string,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.userId = userId;
  }

  public update = async () => {
    if (this.newPassword !== this.confirmNewPassword) {
      this.error = "Passwords do not match.";
      return;
    }
    try {
      this.pending = true;
      const response = await updateUser(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.userId,
        {
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
      switch (response.status) {
        case "success":
          this.callbacks.onDone();
          break;
        case "error":
        default:
          this.error = response.message;
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
