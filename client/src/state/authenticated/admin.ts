import { observable } from "mobx";
import { ApartmentDetails, UserDetails } from "../../api";
import { Authenticated } from "../authenticating";
import { CreatingApartment } from "./states/apartments/creating";
import { ListingApartments } from "./states/apartments/listing";
import { UpdatingApartment } from "./states/apartments/updating";
import { AdminCreatingOther } from "./states/users/admin-creating-other";
import { AdminDeletingOther } from "./states/users/admin-deleting-other";
import { AdminListingUsers } from "./states/users/admin-listing";
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
    | AdminListingUsers
    | AdminCreatingOther
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
  }

  public createApartment = () => {
    this.state = new CreatingApartment(this.authenticated, this.listApartments);
  }

  public editApartment = (apartment: ApartmentDetails) => {
    this.state = new UpdatingApartment(
      this.authenticated,
      {
        onDone: this.listApartments,
        onCancel: this.listApartments,
      },
      apartment,
    );
  }

  public listUsers = async () => {
    this.state = new AdminListingUsers(this.authenticated, {
      editUser: this.updateUser,
      deleteUser: this.deleteUser,
    });
    await this.state.loadFresh();
  }

  public createUser = () => {
    this.state = new AdminCreatingOther(this.authenticated, this.listUsers);
  }

  public updateUser = (user?: UserDetails) => {
    if (!user || this.authenticated.userId === user.userId) {
      this.state = new UpdatingSelf(this.authenticated, {
        onDone: this.listUsers,
        onCancel: this.listUsers,
      });
    } else {
      this.state = new AdminUpdatingOther(
        this.authenticated,
        {
          onDone: this.listUsers,
          onCancel: this.listUsers,
        },
        user,
      );
    }
  }

  public deleteUser = (user?: UserDetails) => {
    if (!user || this.authenticated.userId === user.userId) {
      this.state = new DeletingSelf(this.authenticated, {
        onDone: this.signOut,
        onCancel: this.listUsers,
      });
    } else {
      this.state = new AdminDeletingOther(
        this.authenticated,
        {
          onDone: this.listUsers,
          onCancel: this.listUsers,
        },
        user,
      );
    }
  }
}

export interface Callbacks {
  signOut(): void;
}
