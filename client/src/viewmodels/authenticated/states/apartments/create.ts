import { Message } from "element-react";
import { observable } from "mobx";
import { ApartmentInfo, UserDetails } from "../../../../api/types";
import { createApartment } from "../../../../client";
import { UserPickerViewModel } from "../../../components/userpicker";
import { SessionInfo } from "../../../signin";

export class CreateApartmentViewModel {
  public readonly kind = "create-apartment";

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
  @observable public realtorId: string | null = null;
  @observable public pending = false;

  @observable public realtorPicker: UserPickerViewModel | null;

  private readonly authenticated: SessionInfo;
  private readonly onSuccess: OnSuccess;

  public constructor(authenticated: SessionInfo, onSuccess: OnSuccess) {
    this.authenticated = authenticated;
    this.onSuccess = onSuccess;
    if (authenticated.role === "admin") {
      this.realtorPicker = new UserPickerViewModel(
        authenticated,
        {
          onChange: () => {
            this.realtorId = null;
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
      const response = await createApartment(
        {
          Authorization: this.authenticated.authToken,
        },
        {
          info: this.apartmentInfo,
          ...(this.realtorId && {
            realtorId: this.realtorId,
          }),
        },
      );
      switch (response.kind) {
        case "success":
          Message({
            type: "success",
            message: response.data.message,
          });
          this.onSuccess();
          break;
        case "failure":
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
}

export type OnSuccess = () => void;
