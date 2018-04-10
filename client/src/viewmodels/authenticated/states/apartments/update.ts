import { Message } from "element-react";
import { observable } from "mobx";
import { ApartmentDetails, ApartmentInfo, UserDetails } from "../../../../api";
import { updateApartment } from "../../../../client";
import { UserPickerViewModel } from "../../../components/userpicker";
import { SessionInfo } from "../../../signin";

export class UpdateApartmentViewModel {
  public readonly kind = "update-apartment";

  @observable public apartmentId: string;
  @observable public apartmentInfo: ApartmentInfo;
  @observable public realtorId: string;
  @observable public pending = false;

  @observable public realtorPicker: UserPickerViewModel | null;

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  private originalRealtorId: string;

  constructor(
    authenticated: SessionInfo,
    callbacks: Callbacks,
    apartment: ApartmentDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.apartmentId = apartment.apartmentId;
    this.apartmentInfo = apartment.info;
    this.realtorId = this.originalRealtorId = apartment.realtor.realtorId;
    if (authenticated.role === "admin") {
      this.realtorPicker = new UserPickerViewModel(
        authenticated,
        {
          onChange: () => {
            this.realtorId = this.originalRealtorId;
          },
          onPick: (user: UserDetails) => {
            this.realtorId = user.userId;
          },
        },
        "realtor",
      );
    } else {
      this.realtorPicker = null;
    }
  }

  public async submit() {
    try {
      this.pending = true;
      const response = await updateApartment(
        {
          Authorization: this.authenticated.authToken,
        },
        this.apartmentId,
        {
          info: this.apartmentInfo,
          realtorId: this.realtorId,
        },
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
