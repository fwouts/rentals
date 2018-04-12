import { observable } from "mobx";
import { ApartmentDetails } from "../../api";
import { getApartment } from "../../client";
import { Router } from "../../router";
import { AppViewModel } from "../app";
import { SessionInfo } from "../signin";
import { CreateApartmentViewModel } from "./states/apartments/create";
import { ListApartmentsViewModel } from "./states/apartments/list";
import { UpdateApartmentViewModel } from "./states/apartments/update";
import { SelfDeleteUserViewModel } from "./states/users/self-delete";
import { SelfUpdateUserViewModel } from "./states/users/self-update";

export class AuthenticatedRealtorViewModel {
  public readonly kind = "authenticated-realtor";

  @observable
  public state:
    | ListApartmentsViewModel
    | CreateApartmentViewModel
    | UpdateApartmentViewModel
    | SelfUpdateUserViewModel
    | SelfDeleteUserViewModel;
  public readonly realtorId: string;
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
    this.realtorId = authenticated.userId;
    this.signOut = callbacks.signOut;
    this.state = new ListApartmentsViewModel(this.authenticated);
  }

  public listApartments = async () => {
    this.state = new ListApartmentsViewModel(this.authenticated);
    this.router.push();
  }

  public createApartment = async () => {
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

  public updateApartment = async (apartment: ApartmentDetails) => {
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
