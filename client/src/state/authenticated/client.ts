import { observable } from "mobx";
import { UserDetails } from "../../api";
import { Authenticated } from "../authenticating";
import { ListingApartments } from "./states/apartments/listing";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedClient {
  public readonly kind = "authenticated-client";

  @observable public state!: ListingApartments | UpdatingSelf | DeletingSelf;
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

  public updateUser = () => {
    this.state = new UpdatingSelf(this.authenticated, {
      onDone: this.listApartments,
      onCancel: this.listApartments,
    });
  }

  public deleteUser = (user: UserDetails) => {
    this.state = new DeletingSelf(this.authenticated, {
      onDone: this.listApartments,
      onCancel: this.listApartments,
    });
  }
}

export interface Callbacks {
  signOut(): void;
}
