import { isEqual } from "lodash";
import { observable } from "mobx";
import {
  ApartmentDetails,
  ListApartmentsFilter,
  UserDetails,
  Viewport,
} from "../../../../api";
import { listApartments } from "../../../../client";
import { UserPickerViewModel } from "../../../components/userpicker";
import { SessionInfo } from "../../../signin";
import { DeleteApartmentViewModel } from "./delete";

const LIST_MAX_PER_PAGE = 10;
const MAP_MAX_RESULTS = 100;

const WORLD_VIEWPORT: Viewport = {
  southWest: {
    latitude: -90,
    longitude: -180,
  },
  northEast: {
    latitude: +90,
    longitude: +180,
  },
};

export class ListApartmentsViewModel {
  public readonly kind = "list-apartments";

  @observable public loading = false;
  @observable
  public filter: Filter = {
    realtorId: null,
    rented: null,
    sizeRange: null,
    priceRange: null,
    numberOfRooms: null,
  };
  @observable
  public tab:
    | {
        kind: "list";
      }
    | {
        kind: "map";
        viewport: Viewport;
      };
  @observable.shallow public apartments: ApartmentDetails[] = [];
  @observable public total = 0;
  @observable public pageCount = 0;
  @observable public currentPage = 1;

  @observable public realtorFilter: UserPickerViewModel | null;
  @observable public deletingApartment: DeleteApartmentViewModel | null = null;

  private appliedFilter = this.filter;
  private readonly authenticated: SessionInfo;

  public constructor(authenticated: SessionInfo) {
    this.authenticated = authenticated;
    this.tab = {
      kind: "map",
      viewport: WORLD_VIEWPORT,
    };
    if (authenticated.role === "admin") {
      this.realtorFilter = new UserPickerViewModel(
        authenticated,
        {
          onChange: () => {
            this.filter.realtorId = null;
          },
          onPick: (user: UserDetails) => {
            this.filter.realtorId = user.userId;
          },
        },
        "realtor",
      );
    } else {
      this.realtorFilter = null;
    }
  }

  public switchTab = async (tab: "list" | "map") => {
    if (this.tab.kind === tab) {
      return;
    }
    switch (tab) {
      case "list":
        this.tab = {
          kind: "list",
        };
        break;
      case "map":
        this.tab = {
          kind: "map",
          viewport: WORLD_VIEWPORT,
        };
        break;
    }
    await this.loadFresh();
  }

  public updateViewport = async (viewport: Viewport) => {
    if (this.tab.kind !== "map") {
      return;
    }
    if (!isEqual(viewport, this.tab.viewport)) {
      this.tab.viewport = viewport;
      await this.loadFresh();
    }
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
      let request;
      switch (this.tab.kind) {
        case "list":
          request = {
            filter: toRequestFilter(this.appliedFilter),
            maxPerPage: LIST_MAX_PER_PAGE,
            page: pageNumber,
          };
          break;
        case "map":
          request = {
            filter: toRequestFilter(this.appliedFilter, this.tab.viewport),
            maxPerPage: MAP_MAX_RESULTS,
            page: pageNumber,
          };
          break;
      }
      const response = await listApartments(
        {
          Authorization: this.authenticated.jwtToken,
        },
        request,
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

  public deleteApartment = async (apartment: ApartmentDetails) => {
    this.deletingApartment = new DeleteApartmentViewModel(
      this.authenticated,
      {
        onDone: () => {
          this.deletingApartment = null;
          this.apartments = this.apartments.filter(
            (a) => a.apartmentId !== apartment.apartmentId,
          );
          this.total--;
        },
        onCancel: () => (this.deletingApartment = null),
      },
      apartment,
    );
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

function toRequestFilter(
  filter: Filter,
  viewport?: Viewport,
): ListApartmentsFilter {
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
  if (viewport) {
    requestFilter.viewport = viewport;
  }
  return requestFilter;
}
