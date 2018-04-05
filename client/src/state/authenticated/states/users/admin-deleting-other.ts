export class AdminDeletingOther {
  public readonly kind = "admin-deleting-other";

  public userId: string;
  public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
