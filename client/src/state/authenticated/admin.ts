import { observable } from "mobx";
import { Authenticated } from "../authenticating";
import { CreatingApartment } from "./states/apartments/creating";
import { DeletingApartment } from "./states/apartments/deleting";
import { ListingApartments } from "./states/apartments/listing";
import { UpdatingApartment } from "./states/apartments/updating";
import { Home } from "./states/home";
import { AdminDeletingOther } from "./states/users/admin-deleting-other";
import { AdminUpdatingOther } from "./states/users/admin-updating-other";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedAdmin {
  public readonly kind = "authenticated-admin";

  @observable
  public state:
    | Home
    | ListingApartments
    | CreatingApartment
    | UpdatingApartment
    | DeletingApartment
    | UpdatingSelf
    | DeletingSelf
    | AdminUpdatingOther
    | AdminDeletingOther = new Home();
  public readonly signOut: () => void;

  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.signOut = callbacks.signOut;
  }

  public listApartments = async () => {
    this.state = new ListingApartments(this.authenticated);
    await this.state.loadFresh();
  }
}

export interface Callbacks {
  signOut(): void;
}
