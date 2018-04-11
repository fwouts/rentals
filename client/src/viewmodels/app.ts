import { Message } from "element-react";
import { observable } from "mobx";
import { checkAuth } from "../client";
import { humanizeRole } from "../i18n/role";
import { Router } from "../router";
import { AuthenticatedAdminViewModel } from "./authenticated/admin";
import { AuthenticatedClientViewModel } from "./authenticated/client";
import { AuthenticatedRealtorViewModel } from "./authenticated/realtor";
import { RegisterViewModel } from "./register";
import { configureRoutes } from "./routes";
import { SessionInfo, SignInViewModel } from "./signin";
import { UnauthenticatedViewModel } from "./unauthenticated";

const LOCAL_STORAGE_AUTHENTICATION_KEY = "auth";

export class AppController {
  @observable public state!: AppViewModel;

  private router: Router<AppViewModel>;

  constructor() {
    this.router = new Router(() => this.state);
    configureRoutes(this.router, this);
    let authenticated: SessionInfo | null = null;
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
      this.onAuthenticated(authenticated);
      checkAuth({
        Authorization: authenticated.authToken,
      })
        .then((response) => {
          switch (response.status) {
            case "success":
              // If the user ID has changed, refresh.
              if (response.userId !== authenticated!.userId) {
                Message({
                  message:
                    "An unexpected error occurred but we signed you back in. You're good to go!",
                  type: "warning",
                });
                this.onAuthenticated(response);
              }
              if (
                response.userId !== authenticated!.userId ||
                response.role !== authenticated!.role
              ) {
                Message({
                  message: `You are now ${humanizeRole(
                    response.role,
                    true,
                  )}. Congratulations!`,
                  type: "info",
                });
                this.onAuthenticated(response);
              }
              break;
            case "error":
            default:
              this.signOut();
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
    this.router.start();
  }

  public register = () => {
    this.state = new RegisterViewModel(() => {
      this.signIn();
    });
    this.router.push();
  }

  public signIn = () => {
    this.state = new SignInViewModel(this.onAuthenticated);
    this.router.push();
  }

  public signOut = () => {
    if (window.localStorage) {
      window.localStorage.removeItem(LOCAL_STORAGE_AUTHENTICATION_KEY);
    }
    this.state = this.getUnauthenticatedState();
    this.router.push();
    Message({
      message: "You have been signed out.",
      type: "info",
    });
  }

  private onAuthenticated = (authenticated: SessionInfo) => {
    if (window.localStorage) {
      window.localStorage.setItem(
        LOCAL_STORAGE_AUTHENTICATION_KEY,
        JSON.stringify(authenticated),
      );
    }
    this.state = this.getAuthenticatedState(authenticated);
    this.state.listApartments();
    this.router.push();
  }

  private getAuthenticatedState(authenticated: SessionInfo) {
    const callbacks = {
      signOut: this.signOut,
    };
    switch (authenticated.role) {
      case "client":
        return new AuthenticatedClientViewModel(
          this.router,
          authenticated,
          callbacks,
        );
      case "realtor":
        return new AuthenticatedRealtorViewModel(
          this.router,
          authenticated,
          callbacks,
        );
      case "admin":
        return new AuthenticatedAdminViewModel(
          this.router,
          authenticated,
          callbacks,
        );
      default:
        throw new Error(`Unknown role: ${authenticated.role}.`);
    }
  }

  private getUnauthenticatedState() {
    return new UnauthenticatedViewModel({
      register: this.register,
      authenticate: this.signIn,
    });
  }
}

export type AppViewModel =
  | UnauthenticatedViewModel
  | RegisterViewModel
  | SignInViewModel
  | AuthenticatedAdminViewModel
  | AuthenticatedRealtorViewModel
  | AuthenticatedClientViewModel;
