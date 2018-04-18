import { Message } from "element-react";
import { observable } from "mobx";
import { ListUsersFilter, Role, UserDetails } from "../../../../api/types";
import { listUsers } from "../../../../client";
import { SessionInfo } from "../../../signin";

const MAX_PER_PAGE = 10;

export class AdminListUsersViewModel {
  public readonly kind = "admin-list-users";

  @observable public loading = false;
  @observable
  public filter: Filter = {
    role: null,
  };
  @observable.shallow public users: UserDetails[] = [];
  @observable public total = 0;
  @observable public pageCount = 0;
  @observable public currentPage = 1;

  private appliedFilter = this.filter;
  private readonly authenticated: SessionInfo;
  private readonly callbacks: Callbacks;

  public constructor(authenticated: SessionInfo, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.callbacks = callbacks;
  }

  public loadFresh = async () => {
    this.users = [];
    this.total = 0;
    this.pageCount = 0;
    this.currentPage = 1;
    this.appliedFilter = this.filter;
    await this.loadPage(1);
  }

  public loadPage = async (pageNumber: number) => {
    try {
      this.loading = true;
      const response = await listUsers(
        {
          Authorization: this.authenticated.authToken,
        },
        {
          filter: toRequestFilter(this.appliedFilter),
          maxPerPage: MAX_PER_PAGE,
          page: pageNumber,
        },
      );
      switch (response.kind) {
        case "success":
          this.users = response.data.results;
          this.total = response.data.totalResults;
          this.pageCount = response.data.pageCount;
          this.currentPage = pageNumber;
          break;
        case "unauthorized":
        default:
          Message({
            type: "error",
            message: response.data,
          });
          break;
      }
    } finally {
      this.loading = false;
    }
  }

  public editUser(user: UserDetails) {
    this.callbacks.editUser(user);
  }

  public deleteUser(user: UserDetails) {
    this.callbacks.deleteUser(user);
  }
}

export interface Callbacks {
  editUser(user: UserDetails);
  deleteUser(user: UserDetails);
}

export interface Filter {
  role: Role | null;
}

function toRequestFilter(filter: Filter): ListUsersFilter {
  const requestFilter: ListUsersFilter = {};
  if (filter.role) {
    requestFilter.role = filter.role;
  }
  return requestFilter;
}
