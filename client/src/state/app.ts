import { AuthenticatedAdmin } from "./authenticated/admin";
import { AuthenticatedClient } from "./authenticated/client";
import { AuthenticatedRealtor } from "./authenticated/realtor";
import { Authenticating } from "./authenticating";
import { Registering } from "./registering";
import { Unauthenticated } from "./unauthenticated";

export class AppController {
  public state:
    | Unauthenticated
    | Registering
    | Authenticating
    | AuthenticatedAdmin
    | AuthenticatedRealtor
    | AuthenticatedClient = new Unauthenticated();

  public register() {
    this.state = new Registering(() => {
      this.authenticate();
    });
  }

  public authenticate() {
    this.state = new Authenticating((authenticated) => {
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
  }
}
