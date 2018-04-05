import { action, observable, runInAction } from "mobx";
import { AuthenticatedAdmin } from "./authenticated/admin";
import { AuthenticatedClient } from "./authenticated/client";
import { AuthenticatedRealtor } from "./authenticated/realtor";
import { Authenticating } from "./authenticating";
import { Registering } from "./registering";
import { Unauthenticated } from "./unauthenticated";

export class AppController {
  @observable
  public state:
    | Unauthenticated
    | Registering
    | Authenticating
    | AuthenticatedAdmin
    | AuthenticatedRealtor
    | AuthenticatedClient;

  constructor() {
    this.state = new Unauthenticated({
      register: this.register,
      authenticate: this.authenticate,
    });
  }

  @action
  public register = () => {
    this.state = new Registering(() => {
      this.authenticate();
    });
  }

  @action
  public authenticate = () => {
    this.state = new Authenticating((authenticated) => {
      runInAction(() => {
        switch (authenticated.role) {
          case "client":
            this.state = new AuthenticatedClient(authenticated);
            break;
          case "realtor":
            this.state = new AuthenticatedRealtor(authenticated);
            break;
          case "admin":
            this.state = new AuthenticatedAdmin(authenticated);
            break;
        }
      });
    });
  }
}
