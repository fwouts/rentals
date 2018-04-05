import { ApartmentDetails, ListApartmentsFilter } from "../../../../api";
import { listApartments } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class ListingApartments {
  public readonly kind = "listing-apartments";

  public loading = false;
  public filter: ListApartmentsFilter = {};
  public apartments: ApartmentDetails[] = [];
  private currentResultsFilter: ListApartmentsFilter = {};
  private nextPageToken: string | null = null;
  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated) {
    this.authenticated = authenticated;
  }

  public async loadFresh() {
    const filter = this.filter;
    const response = await listApartments(
      {
        Authorization: this.authenticated.jwtToken,
      },
      {
        filter,
      },
    );
    this.apartments = response.results;
    this.currentResultsFilter = filter;
    this.nextPageToken = response.nextPageToken || null;
  }

  public async loadMore() {
    if (!this.nextPageToken) {
      return false;
    }
    const response = await listApartments(
      {
        Authorization: this.authenticated.jwtToken,
      },
      {
        filter: this.currentResultsFilter,
        pageToken: this.nextPageToken,
      },
    );
    this.apartments = this.apartments.concat(response.results);
    this.nextPageToken = response.nextPageToken || null;
    return true;
  }
}
