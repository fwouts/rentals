import { observable } from "mobx";
import { ApartmentDetails } from "../../../../api";
import { deleteApartment } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class DeletingApartment {
  public readonly kind = "deleting-apartment";

  @observable public apartment: ApartmentDetails;
  @observable public error: string | null = null;
  @observable public pending = false;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: Authenticated,
    callbacks: Callbacks,
    apartment: ApartmentDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.apartment = apartment;
  }

  public async confirm() {
    try {
      this.pending = true;
      const response = await deleteApartment(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.apartment.apartmentId,
      );
      switch (response.status) {
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.callbacks.onDone();
          break;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      this.error = "An unexpected error has occurred.";
    } finally {
      this.pending = false;
    }
  }

  public cancel() {
    this.callbacks.onCancel();
  }
}

export interface Callbacks {
  onDone(): void;
  onCancel(): void;
}
