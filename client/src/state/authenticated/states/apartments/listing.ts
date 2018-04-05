import { observable } from "mobx";
import { ApartmentDetails, ListApartmentsFilter } from "../../../../api";
import { listApartments } from "../../../../client";
import { Authenticated } from "../../../authenticating";

export class ListingApartments {
  public readonly kind = "listing-apartments";

  @observable public loading = false;
  @observable
  public filter: Filter = {
    realtorId: null,
    rented: null,
    sizeRange: null,
    priceRange: null,
    numberOfRooms: null,
  };
  @observable public apartments: ApartmentDetails[] = [];
  @observable public total = 0;
  @observable public pageCount = 0;
  @observable public currentPage = 1;

  private appliedFilter = this.filter;
  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated) {
    this.authenticated = authenticated;
  }

  public loadFresh = async () => {
    this.apartments = [];
    this.total = 0;
    this.pageCount = 0;
    this.currentPage = 1;
    this.appliedFilter = this.filter;
    await this.loadPage(1);
  }

  public loadPage = async (pageNumber: number) => {
    try {
      this.loading = true;
      const response = await listApartments(
        {
          Authorization: this.authenticated.jwtToken,
        },
        {
          filter: toRequestFilter(this.appliedFilter),
          page: pageNumber,
        },
      );
      this.apartments = response.results;
      this.total = response.totalResults;
      this.pageCount = response.pageCount;
      this.currentPage = pageNumber;
      return true;
    } finally {
      this.loading = false;
    }
  }
}

export interface Filter {
  realtorId: string | null;
  rented: boolean | null;
  sizeRange: {
    min: number;
    max: number;
  } | null;
  priceRange: {
    min: number;
    max: number;
  } | null;
  numberOfRooms: {
    min: number;
    max: number;
  } | null;
}

function toRequestFilter(filter: Filter): ListApartmentsFilter {
  const requestFilter: ListApartmentsFilter = {};
  if (filter.realtorId) {
    requestFilter.realtorId = filter.realtorId;
  }
  if (filter.rented !== null) {
    requestFilter.rented = filter.rented;
  }
  if (filter.sizeRange) {
    requestFilter.sizeRange = filter.sizeRange;
  }
  if (filter.priceRange) {
    requestFilter.priceRange = filter.priceRange;
  }
  if (filter.numberOfRooms) {
    requestFilter.numberOfRooms = filter.numberOfRooms;
  }
  return requestFilter;
}
