import { ApartmentInfo } from "../../../../api";

export class UpdatingApartment {
  public readonly kind = "updating-apartment";

  public apartmentId: string;
  public apartmentInfo: ApartmentInfo;
  public pending = false;

  constructor(apartmentId: string, apartmentInfo: ApartmentInfo) {
    this.apartmentId = apartmentId;
    this.apartmentInfo = apartmentInfo;
  }
}
