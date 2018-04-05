export class AdminUpdatingOther {
  public readonly kind = "admin-updating-other";

  public userId: string;
  public email = "";
  public name = "";
  public newPassword = "";
  public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
