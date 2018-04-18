import { Message } from "element-react";
import { observable } from "mobx";
import { ApartmentDetails } from "../../../../api/types";
import { deleteApartment } from "../../../../client";
import { SessionInfo } from "../../../signin";

export class DeleteApartmentViewModel {
  public readonly kind = "delete-apartment";

  @observable public apartment: ApartmentDetails;
  @observable public pending = false;

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  constructor(
    authenticated: SessionInfo,
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
          Authorization: this.authenticated.authToken,
        },
        this.apartment.apartmentId,
      );
      switch (response.kind) {
        case "success":
          Message({
            type: "success",
            message: response.data,
          });
          this.callbacks.onDone();
          break;
        case "notfound":
          Message({
            type: "error",
            message: "This apartment does not exist anymore.",
          });
          break;
        case "unauthorized":
        default:
          Message({
            type: "error",
            message: response.data,
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
