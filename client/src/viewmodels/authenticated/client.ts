import { observable } from "mobx";
import { Router } from "../../router";
import { AppViewModel } from "../app";
import { SessionInfo } from "../signin";
import { ListApartmentsViewModel } from "./states/apartments/list";
import { SelfDeleteUserViewModel } from "./states/users/self-delete";
import { SelfUpdateUserViewModel } from "./states/users/self-update";

export class AuthenticatedClientViewModel {
  public readonly kind = "authenticated-client";

  @observable
  public state:
    | ListApartmentsViewModel
    | SelfUpdateUserViewModel
    | SelfDeleteUserViewModel;
  public readonly signOut: () => void;

  public readonly authenticated: SessionInfo;
  private readonly router: Router<AppViewModel>;

  public constructor(
    router: Router<AppViewModel>,
    authenticated: SessionInfo,
    callbacks: Callbacks,
  ) {
    this.router = router;
    this.authenticated = authenticated;
    this.signOut = callbacks.signOut;
    this.state = new ListApartmentsViewModel(this.authenticated);
  }

  public listApartments = async () => {
    this.state = new ListApartmentsViewModel(this.authenticated);
    this.state.loadFresh();
    this.router.push();
  }

  public updateUser = () => {
    this.state = new SelfUpdateUserViewModel(this.authenticated, {
      onDone: this.listApartments,
      onCancel: this.listApartments,
    });
    this.router.push();
  }

  public deleteUser = () => {
    this.state = new SelfDeleteUserViewModel(this.authenticated, {
      onDone: this.signOut,
      onCancel: this.listApartments,
    });
    this.router.push();
  }
}

export interface Callbacks {
  signOut(): void;
}
