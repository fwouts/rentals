import { observable } from "mobx";
import { ApartmentDetails } from "../../api";
import { Authenticated } from "../authenticating";
import { CreatingApartment } from "./states/apartments/creating";
import { ListingApartments } from "./states/apartments/listing";
import { UpdatingApartment } from "./states/apartments/updating";
import { AdminDeletingOther } from "./states/users/admin-deleting-other";
import { AdminUpdatingOther } from "./states/users/admin-updating-other";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedAdmin {
  public readonly kind = "authenticated-admin";

  @observable
  public state!:
    | ListingApartments
    | CreatingApartment
    | UpdatingApartment
    | UpdatingSelf
    | DeletingSelf
    | AdminUpdatingOther
    | AdminDeletingOther;
  public readonly signOut: () => void;

  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.signOut = callbacks.signOut;
    this.listApartments();
  }

  public listApartments = async () => {
    this.state = new ListingApartments(this.authenticated);
    await this.state.loadFresh();
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
}

export interface Callbacks {
  signOut(): void;
}
