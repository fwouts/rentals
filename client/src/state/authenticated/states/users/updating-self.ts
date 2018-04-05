import { observable } from "mobx";

export class UpdatingSelf {
  public readonly kind = "updating-user-self";

  @observable public userId: string;
  @observable public email = "";
  @observable public name = "";
  @observable public currentPassword = "";
  @observable public newPassword = "";
  @observable public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
