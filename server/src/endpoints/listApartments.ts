import { decodeJwt } from "@/auth/jwt";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { Between, FindConditions } from "typeorm";
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
    };
  }
  const requestFilter = request.filter || {};
  const where: FindConditions<Apartment> = {
    ...(requestFilter.realtorId !== undefined && {
      realtor: {
        userId: requestFilter.realtorId,
      },
    }),
    ...(requestFilter.rented !== undefined && {
      rented: requestFilter.rented,
    }),
    ...(requestFilter.sizeRange !== undefined && {
      floorArea: Between(
        requestFilter.sizeRange.min,
        requestFilter.sizeRange.max,
      ),
    }),
    ...(requestFilter.priceRange !== undefined && {
      pricePerMonth: Between(
        requestFilter.priceRange.min,
        requestFilter.priceRange.max,
      ),
    }),
    ...(requestFilter.numberOfRooms !== undefined && {
      numberOfRooms: Between(
        requestFilter.numberOfRooms.min,
        requestFilter.numberOfRooms.max,
      ),
    }),
  };
  if (role === "client") {
    if (requestFilter.rented) {
      // Don't show rented apartments to clients.
      return {
        results: [],
        totalResults: 0,
      };
    } else {
      where.rented = false;
    }
  }
  if (role === "realtor") {
    if (requestFilter.realtorId && requestFilter.realtorId !== userId) {
      // Don't show other realtors' rented apartments to realtors.
      if (requestFilter.rented) {
        return {
          results: [],
          totalResults: 0,
        };
      } else {
        where.rented = false;
      }
    }
  }
  let skip;
  if (request.pageToken) {
    try {
      const token = JSON.parse(
        Buffer.from(request.pageToken, "base64").toString(),
      );
      skip = parseInt(token.skip, 10);
    } catch (e) {
      // Ignore any error, but log it for debugging purposes.
      // tslint:disable-next-line no-console
      console.warn(e);
      skip = 0;
    }
  } else {
    skip = 0;
  }
  const [results, totalCount] = await connection.manager.findAndCount(
    Apartment,
    {
      where,
      skip,
      take: maxResultsPerPage,
    },
  );
  return {
    results: results.map(Apartment.toApi),
    totalResults: totalCount,
    ...(skip + results.length < totalCount && {
      nextPageToken: Buffer.from(
        JSON.stringify({
          skip: skip + maxResultsPerPage,
        }),
      ).toString("base64"),
    }),
  };
}
