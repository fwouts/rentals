export class UpdatingSelf {
  public readonly kind = "updating-user-self";

  public userId: string;
  public email = "";
  public name = "";
  public currentPassword = "";
  public newPassword = "";
  public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
