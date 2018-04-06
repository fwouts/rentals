import { observable } from "mobx";
import { ApartmentDetails, ApartmentInfo, UserDetails } from "../../../../api";
import { updateApartment } from "../../../../client";
import { Authenticated } from "../../../authenticating";
import { UserPicker } from "../../../components/userpicker";

export class UpdatingApartment {
  public readonly kind = "updating-apartment";

  @observable public apartmentId: string;
  @observable public apartmentInfo: ApartmentInfo;
  @observable public realtorId: string;
  @observable public error: string | null = null;
  @observable public pending = false;

  @observable public realtorPicker: UserPicker | null;

  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  private originalRealtorId: string;

  constructor(
    authenticated: Authenticated,
    callbacks: Callbacks,
    apartment: ApartmentDetails,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.apartmentId = apartment.apartmentId;
    this.apartmentInfo = apartment.info;
    this.realtorId = this.originalRealtorId = apartment.realtor.realtorId;
    if (authenticated.role === "admin") {
      this.realtorPicker = new UserPicker(
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
