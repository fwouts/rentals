import { observable } from "mobx";
import { ApartmentInfo, UserDetails } from "../../../../api";
import { createApartment } from "../../../../client";
import { Authenticated } from "../../../authenticating";
import { UserPicker } from "../../../components/userpicker";

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
  @observable public realtorId: string | null = null;
  @observable public error: string | null = null;
  @observable public pending = false;

  @observable public realtorPicker: UserPicker | null;

  private readonly authenticated: Authenticated;
  private readonly onSuccess: OnSuccess;

  public constructor(authenticated: Authenticated, onSuccess: OnSuccess) {
    this.authenticated = authenticated;
    this.onSuccess = onSuccess;
    if (authenticated.role === "admin") {
      this.realtorPicker = new UserPicker(
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
          Authorization: this.authenticated.jwtToken,
        },
        {
          info: this.apartmentInfo,
          ...(this.realtorId && {
            realtorId: this.realtorId,
          }),
        },
      );
      switch (response.status) {
        case "error":
          this.error = response.message;
          break;
        case "success":
          this.onSuccess();
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
}

export type OnSuccess = () => void;
