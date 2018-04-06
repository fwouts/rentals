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
): Promise<ListUsersResponse> {
  const maxResultsPerPage = request.maxPerPage
    ? Math.min(MAX_RESULTS_PER_PAGE, request.maxPerPage)
    : MAX_RESULTS_PER_PAGE;
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
  const whereQueries: string[] = [];
  const whereArgs: { [arg: string]: string } = {};
  if (request.filter) {
    if (request.filter.role) {
      whereQueries.push(`(user.role = :role)`);
      whereArgs.role = request.filter.role;
    }
    if (request.filter.name) {
      whereQueries.push(`(user.name ILIKE :name)`);
      whereArgs.name = "%" + request.filter.name + "%";
    }
  }
  let skip;
  if (request.page) {
    skip = (request.page - 1) * maxResultsPerPage;
  } else {
    skip = 0;
  }
  const [results, totalCount] = await connection.manager
    .getRepository(User)
    .createQueryBuilder("user")
    .where(whereQueries.join(" AND "), whereArgs)
    .skip(skip)
    .take(maxResultsPerPage)
    .getManyAndCount();
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
