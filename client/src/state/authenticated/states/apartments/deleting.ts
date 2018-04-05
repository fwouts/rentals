import { observable } from "mobx";

export class DeletingApartment {
  public readonly kind = "deleting-apartment";

  @observable public apartmentId: string;
  @observable public pending = false;

  constructor(apartmentId: string) {
    this.apartmentId = apartmentId;
  }
}
