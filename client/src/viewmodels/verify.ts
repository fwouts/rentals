import { Message } from "element-react";
import { observable } from "mobx";
import { verifyEmailAddress } from "../client";
import { SessionInfo } from "./signin";

export class VerifyViewModel {
  public readonly kind = "verify";

  @observable public pending = false;
  @observable public error: string | null = null;

  public readonly token: string;
  private readonly onSuccess: OnSuccess;

  constructor(token: string, onSuccess: OnSuccess) {
    this.token = token;
    this.onSuccess = onSuccess;
  }

  public submit = async () => {
    try {
      this.pending = true;
      const response = await verifyEmailAddress({
        token: this.token,
      });
      switch (response.kind) {
        case "success":
          Message({
            type: "success",
            message: "Thanks, your email address is now verified!",
          });
          this.onSuccess(response.data);
          break;
        case "failure":
        default:
          this.error = response.data;
          break;
      }
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      this.error = "An unexpected error has occurred.";
    } finally {
      this.pending = false;
    }
  }
}

export type OnSuccess = (authenticated: SessionInfo) => void;
