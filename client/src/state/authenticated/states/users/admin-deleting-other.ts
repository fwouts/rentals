import { observable } from "mobx";
import { UserDetails } from "../../../../api";
import { deleteUser } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class AdminDeletingOther {
  public readonly kind = "admin-deleting-other";

  @observable public user: UserDetails;
  @observable public error: string | null = null;
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: Authenticated,
    callbacks: Callbacks,
    user: UserDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.user = user;
  }

  public confirm = async () => {
    try {
      this.pending = true;
      const response = await deleteUser(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.user.userId,
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
