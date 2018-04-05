export class DeletingSelf {
  public readonly kind = "deleting-user-self";

  public userId: string;
  public password = "";
  public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
