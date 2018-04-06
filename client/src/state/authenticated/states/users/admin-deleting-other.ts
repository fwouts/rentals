import { observable } from "mobx";
import { deleteUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class AdminDeletingOther {
  public readonly kind = "admin-deleting-other";

  @observable public userId: string;
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

  public confirm = async () => {
    try {
      this.pending = true;
      const response = await deleteUser(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.userId,
        {},
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
