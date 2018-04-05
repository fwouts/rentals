import { decodeJwt } from "@/auth/jwt";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import {
  AuthRequired,
  ListApartmentsRequest,
  ListApartmentsResponse,
} from "../api";

const MAX_RESULTS_PER_PAGE = 20;

export async function listApartments(
  headers: AuthRequired,
  request: ListApartmentsRequest,
  maxResultsPerPage = MAX_RESULTS_PER_PAGE,
): Promise<ListApartmentsResponse> {
  let userId;
  let role;
  try {
    ({ userId, role } = decodeJwt(headers.Authorization));
  } catch (e) {
    return {
      results: [],
      totalResults: 0,
      pageCount: 0,
    };
  }
  const requestFilter = request.filter || {};
  if (role === "client") {
    if (requestFilter.rented) {
      // Don't show rented apartments to clients.
      return {
        results: [],
        totalResults: 0,
        pageCount: 0,
      };
    } else {
      requestFilter.rented = false;
    }
  }
  if (role === "realtor") {
    if (requestFilter.realtorId && requestFilter.realtorId !== userId) {
      // Don't show other realtors' rented apartments to realtors.
      if (requestFilter.rented) {
        return {
          results: [],
          totalResults: 0,
          pageCount: 0,
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
    results: results.map(Apartment.toApi),
    totalResults: totalCount,
    pageCount: Math.ceil(totalCount / maxResultsPerPage),
  };
}
