import { observable } from "mobx";
import { ListUsersFilter, Role, UserDetails } from "../../../../api";
import { listUsers } from "../../../../client";
import { Authenticated } from "../../../authenticating";

const MAX_PER_PAGE = 10;

export class AdminListingUsers {
  public readonly kind = "admin-listing-users";

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
  private readonly authenticated: Authenticated;
  private readonly callbacks: Callbacks;

  public constructor(authenticated: Authenticated, callbacks: Callbacks) {
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
          Authorization: this.authenticated.jwtToken,
        },
        {
          filter: toRequestFilter(this.appliedFilter),
          maxPerPage: MAX_PER_PAGE,
          page: pageNumber,
        },
      );
      this.users = response.results;
      this.total = response.totalResults;
      this.pageCount = response.pageCount;
      this.currentPage = pageNumber;
      return true;
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
