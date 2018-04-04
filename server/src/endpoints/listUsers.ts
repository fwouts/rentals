import { decodeJwt } from "@/auth/jwt";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import {
  AuthRequired,
  ListUsersRequest,
  ListUsersResponse,
  UserDetails,
} from "../api";

const MAX_RESULTS_PER_PAGE = 100;

export async function listUsers(
  headers: AuthRequired,
  request: ListUsersRequest,
  maxResultsPerPage = MAX_RESULTS_PER_PAGE,
): Promise<ListUsersResponse> {
  let role = "unknown";
  try {
    ({ role } = decodeJwt(headers.Authorization));
  } catch {
    // Ignore.
  }
  if (role !== "admin") {
    return {
      results: [],
      totalResults: 0,
    };
  }
  let skip;
  if (request.pageToken) {
    try {
      const token = JSON.parse(atob(request.pageToken));
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
  const [results, totalCount] = await connection.manager.findAndCount(User, {
    where: {
      ...(request.filter && {
        role: request.filter.role,
      }),
    },
    skip,
    take: maxResultsPerPage,
  });
  return {
    results: results.map(toUserDetails),
    totalResults: totalCount,
    ...(skip + results.length < totalCount && {
      nextPageToken: btoa(
        JSON.stringify({
          skip: skip + maxResultsPerPage,
        }),
      ),
    }),
  };
}

function toUserDetails(user: User): UserDetails {
  return {
    userId: user.userId,
    email: user.email,
    role: user.role,
  };
}
