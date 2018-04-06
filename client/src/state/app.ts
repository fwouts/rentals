import { observable } from "mobx";
import { checkAuth } from "../client";
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
      this.state = this.getAuthenticatedState(authenticated);
      checkAuth({
        Authorization: authenticated.jwtToken,
      })
        .then((response) => {
          switch (response.status) {
            case "success":
              // If the user ID or role have changed, refresh.
              if (
                response.userId !== authenticated!.userId ||
                response.role !== authenticated!.role
              ) {
                this.onAuthenticated(response);
              }
              break;
            case "error":
            default:
              this.state = this.getUnauthenticatedState();
          }
        })
        .catch((e) => {
          // tslint:disable-next-line no-console
          console.error(e);
          this.state = this.getUnauthenticatedState();
        });
    } else {
      this.state = this.getUnauthenticatedState();
    }
  }

  public register = () => {
    this.state = new Registering(() => {
      this.authenticate();
    });
  }

  public authenticate = () => {
    this.state = new Authenticating(this.onAuthenticated);
  }

  private onAuthenticated = (authenticated: Authenticated) => {
    if (window.localStorage) {
      window.localStorage.setItem(
        LOCAL_STORAGE_AUTHENTICATION_KEY,
        JSON.stringify(authenticated),
      );
    }
    this.state = this.getAuthenticatedState(authenticated);
  }

  private getAuthenticatedState(authenticated: Authenticated) {
    const callbacks = {
      signOut: this.signOut,
    };
    switch (authenticated.role) {
      case "client":
        return new AuthenticatedClient(authenticated, callbacks);
      case "realtor":
        return new AuthenticatedRealtor(authenticated, callbacks);
      case "admin":
        return new AuthenticatedAdmin(authenticated, callbacks);
      default:
        throw new Error(`Unknown role: ${authenticated.role}.`);
    }
  }

  private getUnauthenticatedState() {
    return new Unauthenticated({
      register: this.register,
      authenticate: this.authenticate,
    });
  }

  private signOut = () => {
    if (window.localStorage) {
      window.localStorage.removeItem(LOCAL_STORAGE_AUTHENTICATION_KEY);
    }
    this.state = this.getUnauthenticatedState();
  }
}
