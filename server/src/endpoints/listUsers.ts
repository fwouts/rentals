import { authenticate } from "@/auth/jwt";
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
  let currentUser = {
    role: "unknown",
  };
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch {
    // Ignore.
  }
  if (currentUser.role !== "admin") {
    return {
      results: [],
      totalResults: 0,
      pageCount: 0,
    };
  }
  let skip;
  if (request.page) {
    skip = (request.page - 1) * maxResultsPerPage;
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
    pageCount: Math.ceil(totalCount / maxResultsPerPage),
  };
}

function toUserDetails(user: User): UserDetails {
  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
