import { action, observable, runInAction } from "mobx";
import { ApartmentDetails, ListApartmentsFilter } from "../../../../api";
import { listApartments } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class ListingApartments {
  public readonly kind = "listing-apartments";

  @observable public loading = false;
  @observable public filter: ListApartmentsFilter = {};
  @observable public apartments: ApartmentDetails[] = [];
  @observable public total = 0;

  private currentResultsFilter: ListApartmentsFilter = {};
  private nextPageToken: string | null = null;
  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated) {
    this.authenticated = authenticated;
  }

  @action
  public async loadFresh() {
    try {
      this.loading = true;
      const filter = this.filter;
      const response = await listApartments(
        {
          Authorization: this.authenticated.jwtToken,
        },
        {
          filter,
        },
      );
      runInAction(() => {
        this.apartments = response.results;
        this.total = response.totalResults;
        this.currentResultsFilter = filter;
        this.nextPageToken = response.nextPageToken || null;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  @action
  public async loadMore() {
    if (!this.nextPageToken) {
      return false;
    }
    try {
      this.loading = true;
      const response = await listApartments(
        {
          Authorization: this.authenticated.jwtToken,
        },
        {
          filter: this.currentResultsFilter,
          pageToken: this.nextPageToken,
        },
      );
      runInAction(() => {
        this.apartments = this.apartments.concat(response.results);
        this.total = response.totalResults;
        this.nextPageToken = response.nextPageToken || null;
      });
      return true;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
