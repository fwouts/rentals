export class DeletingApartment {
  public readonly kind = "deleting-apartment";

  public apartmentId: string;
  public pending = false;

  constructor(apartmentId: string) {
    this.apartmentId = apartmentId;
  }
}
