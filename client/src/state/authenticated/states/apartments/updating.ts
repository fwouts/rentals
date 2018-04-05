import { observable } from "mobx";
import { ApartmentDetails, ApartmentInfo } from "../../../../api";
import { updateApartment } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class UpdatingApartment {
  public readonly kind = "updating-apartment";

  @observable public apartmentId: string;
  @observable public apartmentInfo: ApartmentInfo;
  @observable public realtorId: string;
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
    this.apartmentId = apartment.apartmentId;
    this.apartmentInfo = apartment.info;
    this.realtorId = apartment.realtor.realtorId;
  }

  public async submit() {
    try {
      this.pending = true;
      const response = await updateApartment(
        {
          Authorization: this.authenticated.jwtToken,
        },
        this.apartmentId,
        {
          info: this.apartmentInfo,
          realtorId: this.realtorId,
        },
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
