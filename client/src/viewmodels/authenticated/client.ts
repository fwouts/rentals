import { observable } from "mobx";
import { SessionInfo } from "../signin";
import { ListApartmentsViewModel } from "./states/apartments/list";
import { SelfDeleteUserViewModel } from "./states/users/self-delete";
import { SelfUpdateUserViewModel } from "./states/users/self-update";

export class AuthenticatedClientViewModel {
  public readonly kind = "authenticated-client";

  @observable
  public state!:
    | ListApartmentsViewModel
    | SelfUpdateUserViewModel
    | SelfDeleteUserViewModel;
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

  public updateUser = () => {
    this.state = new SelfUpdateUserViewModel(this.authenticated, {
      onDone: this.listApartments,
      onCancel: this.listApartments,
    });
  }

  public deleteUser = () => {
    this.state = new SelfDeleteUserViewModel(this.authenticated, {
      onDone: this.signOut,
      onCancel: this.listApartments,
    });
  }
}

export interface Callbacks {
  signOut(): void;
}
