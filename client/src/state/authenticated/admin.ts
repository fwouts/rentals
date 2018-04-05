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
  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated) {
    this.authenticated = authenticated;
  }

  public listApartments() {
    this.state = new ListingApartments(this.authenticated);
  }
}
