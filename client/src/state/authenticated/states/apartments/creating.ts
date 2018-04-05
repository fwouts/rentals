import { observable } from "mobx";
import { ApartmentInfo } from "../../../../api";

export class CreatingApartment {
  public readonly kind = "creating-apartment";

  @observable
  public apartmentInfo: ApartmentInfo = {
    floorArea: 0,
    pricePerMonth: 0,
    numberOfRooms: 0,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    rented: false,
  };
  @observable public pending = false;
}
