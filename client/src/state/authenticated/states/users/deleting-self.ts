import { observable } from "mobx";

export class DeletingSelf {
  public readonly kind = "deleting-user-self";

  @observable public userId: string;
  @observable public password = "";
  @observable public pending = false;

  constructor(userId: string) {
    this.userId = userId;
  }
}
