import { observable } from "mobx";
import { ApartmentInfo } from "../../../../api";

export class UpdatingApartment {
  public readonly kind = "updating-apartment";

  @observable public apartmentId: string;
  @observable public apartmentInfo: ApartmentInfo;
  @observable public pending = false;

  constructor(apartmentId: string, apartmentInfo: ApartmentInfo) {
    this.apartmentId = apartmentId;
    this.apartmentInfo = apartmentInfo;
  }
}
