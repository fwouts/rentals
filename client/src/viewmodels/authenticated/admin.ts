import { observable } from "mobx";
import { ApartmentDetails, UserDetails } from "../../api";
import { SessionInfo } from "../signin";
import { CreateApartmentViewModel } from "./states/apartments/create";
import { ListApartmentsViewModel } from "./states/apartments/list";
import { UpdateApartmentViewModel } from "./states/apartments/update";
import { AdminCreateUserViewModel } from "./states/users/admin-create";
import { AdminDeleteUserViewModel } from "./states/users/admin-delete";
import { AdminListUsersViewModel } from "./states/users/admin-list";
import { AdminUpdateUserViewModel } from "./states/users/admin-update";
import { SelfDeleteUserViewModel } from "./states/users/self-delete";
import { SelfUpdateUserViewModel } from "./states/users/self-update";
export class AuthenticatedAdminViewModel {
  public readonly kind = "authenticated-admin";

  @observable
  public state!:
    | ListApartmentsViewModel
    | CreateApartmentViewModel
    | UpdateApartmentViewModel
    | SelfUpdateUserViewModel
    | SelfDeleteUserViewModel
    | AdminListUsersViewModel
    | AdminCreateUserViewModel
    | AdminUpdateUserViewModel
    | AdminDeleteUserViewModel;
  public readonly signOut: () => void;

  private readonly authenticated: SessionInfo;

  public constructor(authenticated: SessionInfo, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.signOut = callbacks.signOut;
    this.listApartments();
  }

  public listApartments = async () => {
    this.state = new ListApartmentsViewModel(this.authenticated);
  }

  public createApartment = () => {
    this.state = new CreateApartmentViewModel(
      this.authenticated,
      this.listApartments,
    );
  }

  public editApartment = (apartment: ApartmentDetails) => {
    this.state = new UpdateApartmentViewModel(
      this.authenticated,
      {
        onDone: this.listApartments,
        onCancel: this.listApartments,
      },
      apartment,
    );
  }

  public listUsers = async () => {
    this.state = new AdminListUsersViewModel(this.authenticated, {
      editUser: this.updateUser,
      deleteUser: this.deleteUser,
    });
    await this.state.loadFresh();
  }

  public createUser = () => {
    this.state = new AdminCreateUserViewModel(
      this.authenticated,
      this.listUsers,
    );
  }

  public updateUser = (user?: UserDetails) => {
    if (!user || this.authenticated.userId === user.userId) {
      this.state = new SelfUpdateUserViewModel(this.authenticated, {
        onDone: this.listUsers,
        onCancel: this.listUsers,
      });
    } else {
      this.state = new AdminUpdateUserViewModel(
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
      this.state = new SelfDeleteUserViewModel(this.authenticated, {
        onDone: this.signOut,
        onCancel: this.listUsers,
      });
    } else {
      this.state = new AdminDeleteUserViewModel(
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
