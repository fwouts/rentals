import { observable } from "mobx";
import { ApartmentDetails } from "../../api";
import { Authenticated } from "../authenticating";
import { CreatingApartment } from "./states/apartments/creating";
import { ListingApartments } from "./states/apartments/listing";
import { UpdatingApartment } from "./states/apartments/updating";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedRealtor {
  public readonly kind = "authenticated-realtor";

  @observable
  public state!:
    | ListingApartments
    | CreatingApartment
    | UpdatingApartment
    | UpdatingSelf
    | DeletingSelf;
  public readonly realtorId: string;
  public readonly signOut: () => void;

  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.realtorId = authenticated.userId;
    this.signOut = callbacks.signOut;
    this.listApartments();
  }

  public listApartments = async () => {
    this.state = new ListingApartments(this.authenticated);
  }

  public createApartment = async () => {
    this.state = new CreatingApartment(this.authenticated, this.listApartments);
  }

  public editApartment = async (apartment: ApartmentDetails) => {
    this.state = new UpdatingApartment(
      this.authenticated,
      {
        onDone: this.listApartments,
        onCancel: this.listApartments,
      },
      apartment,
    );
  }

  public updateUser = () => {
    this.state = new UpdatingSelf(this.authenticated, {
      onDone: this.listApartments,
      onCancel: this.listApartments,
    });
  }

  public deleteUser = () => {
    this.state = new DeletingSelf(this.authenticated, {
      onDone: this.signOut,
      onCancel: this.listApartments,
    });
  }
}

export interface Callbacks {
  signOut(): void;
}
