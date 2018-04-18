import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import {
  AuthRequired,
  ListApartments_Response,
  ListApartmentsRequest,
} from "../api/types";

const MAX_RESULTS_PER_PAGE = 500;

export async function listApartments(
  headers: AuthRequired,
  request: ListApartmentsRequest,
): Promise<ListApartments_Response> {
  const maxResultsPerPage = request.maxPerPage
    ? Math.min(MAX_RESULTS_PER_PAGE, request.maxPerPage)
    : MAX_RESULTS_PER_PAGE;
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  const requestFilter = request.filter || {};
  if (currentUser.role === "client") {
    if (requestFilter.rented) {
      // Don't show rented apartments to clients.
      return {
        kind: "unauthorized",
        data: "Clients cannot see rented apartments.",
      };
    } else {
      requestFilter.rented = false;
    }
  }
  if (currentUser.role === "realtor") {
    if (
      requestFilter.realtorId &&
      requestFilter.realtorId !== currentUser.userId
    ) {
      // Don't show other realtors' rented apartments to realtors.
      if (requestFilter.rented) {
        return {
          kind: "unauthorized",
          data: "Realtors cannot see others' rented apartments.",
        };
      } else {
        requestFilter.rented = false;
      }
    }
  }
  const whereQueries: string[] = [];
  const whereArgs: { [arg: string]: string | number | boolean } = {};
  if (requestFilter.realtorId) {
    whereQueries.push(`(apartment.realtorid = :realtorId)`);
    whereArgs.realtorId = requestFilter.realtorId;
  }
  if (requestFilter.rented !== undefined) {
    whereQueries.push(`(apartment.rented = :rented)`);
    whereArgs.rented = requestFilter.rented;
  }
  if (requestFilter.sizeRange) {
    whereQueries.push(`(apartment.floorArea BETWEEN :floorMin AND :floorMax)`);
    whereArgs.floorMin = requestFilter.sizeRange.min;
    whereArgs.floorMax = requestFilter.sizeRange.max;
  }
  if (requestFilter.priceRange) {
    whereQueries.push(
      `(apartment.pricePerMonth BETWEEN :priceMin AND :priceMax)`,
    );
    whereArgs.priceMin = requestFilter.priceRange.min;
    whereArgs.priceMax = requestFilter.priceRange.max;
  }
  if (requestFilter.numberOfRooms) {
    whereQueries.push(
      `(apartment.numberOfRooms BETWEEN :roomsMin AND :roomsMax)`,
    );
    whereArgs.roomsMin = requestFilter.numberOfRooms.min;
    whereArgs.roomsMax = requestFilter.numberOfRooms.max;
  }
  if (requestFilter.viewport) {
    if (
      requestFilter.viewport.southWest.longitude <
      requestFilter.viewport.northEast.longitude
    ) {
      // We're not crossing the 180° Meridian.
      // For example:
      // southWest.longitude = New York (-74)
      // northEast.longitude = Paris (+2)
      // We want points between [southWest.longitude, northEast.longitude].
      whereQueries.push(
        `(
           (apartment.longitude BETWEEN :west AND :east)
           AND
           (apartment.latitude BETWEEN :south AND :north)
         )`,
      );
    } else {
      // We are crossing the 180° Meridian.
      // For example:
      // southWest.longitude = Noumea (+166)
      // northEast.longitude = Hawaii (-155)
      // We want points between [southWest.longitude, +180] and [-180, northEast.longitude].
      whereQueries.push(
        `(
           (
            (apartment.longitude BETWEEN :west AND +180)
            OR
            (apartment.longitude BETWEEN -180 AND :east)
           )
           AND
           (apartment.latitude BETWEEN :south AND :north)
         )`,
      );
    }
    whereArgs.north = requestFilter.viewport.northEast.latitude;
    whereArgs.south = requestFilter.viewport.southWest.latitude;
    whereArgs.east = requestFilter.viewport.northEast.longitude;
    whereArgs.west = requestFilter.viewport.southWest.longitude;
  }
  let skip;
  if (request.page) {
    skip = (request.page - 1) * maxResultsPerPage;
  } else {
    skip = 0;
  }
  const [results, totalCount] = await connection.manager
    .getRepository(Apartment)
    .createQueryBuilder("apartment")
    .innerJoinAndSelect("apartment.realtor", "user")
    .where(whereQueries.join(" AND "), whereArgs)
    .skip(skip)
    .take(maxResultsPerPage)
    .getManyAndCount();
  return {
    kind: "success",
    data: {
      results: results.map(Apartment.toApi),
      totalResults: totalCount,
      pageCount: Math.ceil(totalCount / maxResultsPerPage),
    },
  };
}
