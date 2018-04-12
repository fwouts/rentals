import { observable } from "mobx";
import { Role, UserDetails } from "../../api";
import { listUsers } from "../../client";
import { SessionInfo } from "../signin";

export class UserPickerViewModel {
  @observable public name = "";

  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;
  private readonly role?: Role;

  private previousName = this.name;

  public constructor(
    authenticated: SessionInfo,
    callbacks: Callbacks,
    role?: Role,
  ) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
    this.role = role;
  }

  public fetchSuggestions = async (): Promise<UserSuggestion[]> => {
    const name = this.name;
    if (name !== this.previousName) {
      this.callbacks.onChange();
      this.previousName = name;
    }
    const response = await listUsers(
      {
        Authorization: this.authenticated.authToken,
      },
      {
        filter: {
          name,
          role: this.role,
        },
        maxPerPage: 10,
      },
    );
    if (response.kind !== "success") {
      return [];
    }
    return response.data.results.map((user) => {
      return {
        value: user.name,
        user,
      };
    });
  }

  public pick = (suggestion: UserSuggestion) => {
    this.name = suggestion.value;
    this.callbacks.onPick(suggestion.user);
  }
}

export interface Callbacks {
  onChange(): void;
  onPick(user: UserDetails): void;
}

export interface UserSuggestion {
  value: string;
  user: UserDetails;
}
