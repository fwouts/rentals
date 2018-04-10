import { observable } from "mobx";
import { ApartmentDetails } from "../../api";
import { SessionInfo } from "../signin";
import { CreateApartmentViewModel } from "./states/apartments/create";
import { ListApartmentsViewModel } from "./states/apartments/list";
import { UpdateApartmentViewModel } from "./states/apartments/update";
import { SelfDeleteUserViewModel } from "./states/users/self-delete";
import { SelfUpdateUserViewModel } from "./states/users/self-update";

export class AuthenticatedRealtorViewModel {
  public readonly kind = "authenticated-realtor";

  @observable
  public state!:
    | ListApartmentsViewModel
    | CreateApartmentViewModel
    | UpdateApartmentViewModel
    | SelfUpdateUserViewModel
    | SelfDeleteUserViewModel;
  public readonly realtorId: string;
  public readonly signOut: () => void;

  private readonly authenticated: SessionInfo;

  public constructor(authenticated: SessionInfo, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.realtorId = authenticated.userId;
    this.signOut = callbacks.signOut;
    this.listApartments();
  }

  public listApartments = async () => {
    this.state = new ListApartmentsViewModel(this.authenticated);
  }

  public createApartment = async () => {
    this.state = new CreateApartmentViewModel(
      this.authenticated,
      this.listApartments,
    );
  }

  public editApartment = async (apartment: ApartmentDetails) => {
    this.state = new UpdateApartmentViewModel(
      this.authenticated,
      {
        onDone: this.listApartments,
        onCancel: this.listApartments,
      },
      apartment,
    );
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
