import { observable } from "mobx";

export class AdminUpdatingOther {
  public readonly kind = "admin-updating-other";

  @observable public userId: string;
  @observable public email = "";
  @observable public name = "";
  @observable public newPassword = "";
  @observable public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
