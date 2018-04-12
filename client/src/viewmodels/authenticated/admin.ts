import { observable } from "mobx";
import { ApartmentDetails, UserDetails } from "../../api";
import { getApartment, getUser } from "../../client";
import { Router } from "../../router";
import { AppViewModel } from "../app";
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
  public state:
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

  private readonly router: Router<AppViewModel>;
  private readonly authenticated: SessionInfo;

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
    this.router.push();
  }

  public createApartment = () => {
    this.state = new CreateApartmentViewModel(
      this.authenticated,
      this.listApartments,
    );
    this.router.push();
  }

  public async fetchThenUpdateApartment(apartmentId: string) {
    const response = await getApartment(
      {
        Authorization: this.authenticated.authToken,
      },
      apartmentId,
    );
    switch (response.kind) {
      case "success":
        this.updateApartment(response.data);
        break;
    }
  }

  public updateApartment = (apartment: ApartmentDetails) => {
    this.state = new UpdateApartmentViewModel(
      this.authenticated,
      {
        onDone: this.listApartments,
        onCancel: this.listApartments,
      },
      apartment,
    );
    this.router.push();
  }

  public listUsers = async () => {
    this.state = new AdminListUsersViewModel(this.authenticated, {
      editUser: this.updateUser,
      deleteUser: this.deleteUser,
    });
    this.router.push();
    await this.state.loadFresh();
  }

  public createUser = () => {
    this.state = new AdminCreateUserViewModel(
      this.authenticated,
      this.listUsers,
    );
    this.router.push();
  }

  public async fetchThenUpdateUser(userId: string) {
    const response = await getUser(
      {
        Authorization: this.authenticated.authToken,
      },
      userId,
    );
    switch (response.kind) {
      case "success":
        this.updateUser(response.data);
        break;
    }
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
    this.router.push();
  }

  public async fetchThenDeleteUser(userId: string) {
    const response = await getUser(
      {
        Authorization: this.authenticated.authToken,
      },
      userId,
    );
    switch (response.kind) {
      case "success":
        this.deleteUser(response.data);
        break;
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
    this.router.push();
  }
}

export interface Callbacks {
  signOut(): void;
}
