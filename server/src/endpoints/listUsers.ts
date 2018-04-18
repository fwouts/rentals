import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import {
  AuthRequired,
  ListUsers_Response,
  ListUsersRequest,
  UserDetails,
} from "../api/types";

const MAX_RESULTS_PER_PAGE = 100;

export async function listUsers(
  headers: AuthRequired,
  request: ListUsersRequest,
): Promise<ListUsers_Response> {
  const maxResultsPerPage = request.maxPerPage
    ? Math.min(MAX_RESULTS_PER_PAGE, request.maxPerPage)
    : MAX_RESULTS_PER_PAGE;
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  if (currentUser.role !== "admin") {
    return {
      kind: "unauthorized",
      data: "Only admins can list users.",
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
    kind: "success",
    data: {
      results: results.map(toUserDetails),
      totalResults: totalCount,
      pageCount: Math.ceil(totalCount / maxResultsPerPage),
    },
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
