import { observable } from "mobx";

export class AdminDeletingOther {
  public readonly kind = "admin-deleting-other";

  @observable public userId: string;
  @observable public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
