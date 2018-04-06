import { Message } from "element-react";
import { observable } from "mobx";
import { ApartmentDetails } from "../../../../api";
import { deleteApartment } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class DeletingApartment {
  public readonly kind = "deleting-apartment";

  @observable public apartment: ApartmentDetails;
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
        case "success":
          Message({
            type: "success",
            message: response.message,
          });
          this.callbacks.onDone();
          break;
        case "error":
        default:
          Message({
            type: "error",
            message: response.message,
          });
          break;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      Message({
        type: "error",
        message: "An unexpected error has occurred.",
      });
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
