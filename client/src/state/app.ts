import { observable } from "mobx";
import { AuthenticatedAdmin } from "./authenticated/admin";
import { AuthenticatedClient } from "./authenticated/client";
import { AuthenticatedRealtor } from "./authenticated/realtor";
import { Authenticated, Authenticating } from "./authenticating";
import { Registering } from "./registering";
import { Unauthenticated } from "./unauthenticated";

const LOCAL_STORAGE_AUTHENTICATION_KEY = "auth";

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
    let authenticated: Authenticated | null = null;
    if (window.localStorage) {
      const persistedAuth = window.localStorage.getItem(
        LOCAL_STORAGE_AUTHENTICATION_KEY,
      );
      if (persistedAuth) {
        try {
          authenticated = JSON.parse(persistedAuth);
        } catch (e) {
          // tslint:disable-next-line no-console
          console.error(e);
          // Just ignore.
        }
      }
    }
    if (authenticated) {
      this.state = this.getState(authenticated);
    } else {
      this.state = new Unauthenticated({
        register: this.register,
        authenticate: this.authenticate,
      });
    }
  }

  public register = () => {
    this.state = new Registering(() => {
      this.authenticate();
    });
  }

  public authenticate = () => {
    this.state = new Authenticating((authenticated) => {
      if (window.localStorage) {
        window.localStorage.setItem(
          LOCAL_STORAGE_AUTHENTICATION_KEY,
          JSON.stringify(authenticated),
        );
      }
      this.state = this.getState(authenticated);
    });
  }

  private getState(authenticated: Authenticated) {
    switch (authenticated.role) {
      case "client":
        return new AuthenticatedClient(authenticated);
      case "realtor":
        return new AuthenticatedRealtor(authenticated);
      case "admin":
        return new AuthenticatedAdmin(authenticated);
      default:
        throw new Error(`Unknown role: ${authenticated.role}.`);
    }
  }
}
