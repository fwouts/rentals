import { observable } from "mobx";
import { Authenticated } from "../authenticating";
import { CreatingApartment } from "./states/apartments/creating";
import { DeletingApartment } from "./states/apartments/deleting";
import { ListingApartments } from "./states/apartments/listing";
import { UpdatingApartment } from "./states/apartments/updating";
import { Home } from "./states/home";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedRealtor {
  public readonly kind = "authenticated-realtor";

  @observable
  public state:
    | Home
    | ListingApartments
    | CreatingApartment
    | UpdatingApartment
    | DeletingApartment
    | UpdatingSelf
    | DeletingSelf = {
    kind: "home",
  };
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
